/* ==========================================================================
   URBANA · movimento
   Regra do styleguide: entrada em scroll de 320 ms, deslocamento de 16 px,
   UMA VEZ SÓ. Nada pisca, nada gira, nada faz parallax de fundo.
   Se o GSAP não carregar, este arquivo não faz nada e a página fica inteira,
   porque o estado "invisível" só é aplicado depois que a animação é garantida.
   ========================================================================== */

(() => {
  'use strict';

  const semMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sem GSAP ou com movimento reduzido: no-op público e nada escondido.
  if (!window.gsap || semMovimento) {
    window.URBANA_MOTION = {
      revelar: () => {},
      travarScroll: () => {},
      recalcular: () => {},
      rolarPara: (alvo, deslocamento = 0) => {
        if (alvo) window.scrollTo({ top: alvo.getBoundingClientRect().top + window.scrollY + deslocamento });
      },
    };
    return;
  }

  const { gsap } = window;
  gsap.registerPlugin(window.ScrollTrigger);
  const { ScrollTrigger } = window;

  document.body.classList.add('js-anima');

  const ENTRADA = { duracao: 0.32, deslocamento: 16, ease: 'power2.out' };

  /* ── Scroll suave (só no desktop, com ponteiro fino) ──────────────────── */

  let lenis = null;

  /* Overlays têm rolagem própria. O Lenis escuta a roda no documento inteiro,
     então enquanto um modal está aberto ele precisa sair do caminho, senão a
     roda dentro do painel não faz nada e só a barra de rolagem funciona. */
  function travarScroll(travado) {
    if (!lenis) return;
    if (travado) lenis.stop();
    else lenis.start();
  }

  function scrollSuave() {
    if (!window.Lenis || !matchMedia('(min-width: 1025px) and (pointer: fine)').matches) return;

    lenis = new window.Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((tempo) => lenis.raf(tempo * 1000));
    gsap.ticker.lagSmoothing(0);

    // Âncoras precisam pedir ao Lenis, senão o scroll nativo briga com ele.
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const alvo = document.querySelector(id);
      if (!alvo) return;
      e.preventDefault();
      const topo = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--urb-header')) || 80;
      lenis.scrollTo(alvo, { offset: -(topo + 16), duration: 0.9 });
    });
  }

  /* ── Entradas ─────────────────────────────────────────────────────────── */

  function revelar(escopo = document) {
    const alvos = Array.from(escopo.querySelectorAll('[data-anima]'))
      .filter((el) => !el.dataset.animaPronto);

    alvos.forEach((el) => { el.dataset.animaPronto = '1'; });

    // Vizinhos que entram juntos ganham stagger; o resto entra sozinho.
    const grupos = new Map();
    alvos.forEach((el) => {
      const pai = el.parentElement;
      if (!grupos.has(pai)) grupos.set(pai, []);
      grupos.get(pai).push(el);
    });

    grupos.forEach((itens) => {
      gsap.to(itens, {
        opacity: 1,
        y: 0,
        duration: ENTRADA.duracao,
        ease: ENTRADA.ease,
        stagger: itens.length > 1 ? 0.06 : 0,
        scrollTrigger: {
          trigger: itens[0],
          start: 'top 88%',
          once: true, // uma vez só, porque reentrada é ruído
        },
      });
    });
  }

  /* ── Hero: o título sobe de dentro de uma máscara, linha a linha ──────── */

  function hero() {
    const titulo = document.querySelector('[data-anima-linhas]');
    if (titulo) {
      const linhas = titulo.innerHTML.split(/<br\s*\/?>/i);
      titulo.innerHTML = linhas
        .map((linha) => `<span class="hero__linha" style="display:block;overflow:hidden"><span style="display:block">${linha.trim()}</span></span>`)
        .join('');
      titulo.dataset.animaPronto = '1';
      titulo.style.opacity = '1';
      titulo.style.transform = 'none';

      gsap.from(titulo.querySelectorAll('.hero__linha > span'), {
        yPercent: 108,
        duration: 0.72,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.12,
      });
    }

    // O resto do hero entra em cascata curta, sem esperar scroll.
    const restante = Array.from(document.querySelectorAll('.hero__conteudo > [data-anima]'))
      .filter((el) => el !== titulo);
    restante.forEach((el) => { el.dataset.animaPronto = '1'; });

    gsap.to(restante, {
      opacity: 1,
      y: 0,
      duration: 0.42,
      ease: 'power2.out',
      stagger: 0.07,
      delay: 0.2,
    });
  }

  /* ── Contadores ───────────────────────────────────────────────────────── */

  function contadores() {
    document.querySelectorAll('[data-contador]').forEach((el) => {
      const alvo = Number(el.dataset.contador);
      const estado = { valor: 0 };
      gsap.to(estado, {
        valor: alvo,
        duration: 1.1,
        ease: 'power2.out',
        delay: 0.4,
        onUpdate: () => { el.textContent = Math.round(estado.valor).toLocaleString('pt-BR'); },
        scrollTrigger: { trigger: el, start: 'top bottom', once: true },
      });
    });
  }

  /* ── Razões: a pilha se monta no scroll ───────────────────────────────
     O pin é CSS `sticky` (zero JS). O ScrollTrigger só cuida da estética de
     profundidade: quem já chegou encolhe e desfoca conforme os próximos
     pousam por cima. Sem rotação, porque "nada gira" é regra da marca. */

  function pilhaDeRazoes() {
    const cartoes = gsap.utils.toArray('.razao');
    if (cartoes.length < 2) return;

    /* O pin já é CSS. Aqui só lemos as MESMAS medidas que o CSS usa, para o
       trigger começar exatamente onde o card gruda, inclusive no celular,
       onde o passo e a altura do header são menores. */
    const medida = () => {
      const raiz = getComputedStyle(document.documentElement);
      const card = getComputedStyle(cartoes[0]);
      const alturaHeader = parseFloat(raiz.getPropertyValue('--urb-header')) || 80;
      const passo = parseFloat(card.getPropertyValue('--razao-passo')) || 18;
      return { base: alturaHeader + 32, passo };
    };

    const ultimo = cartoes[cartoes.length - 1];

    cartoes.forEach((cartao, i) => {
      const profundidade = cartoes.length - 1 - i;
      if (!profundidade) return;

      gsap.to(cartao.querySelector('.razao__caixa'), {
        scale: Math.max(0.9, 1 - profundidade * 0.03),
        filter: `blur(${(profundidade * 0.9).toFixed(2)}px)`,
        ease: 'none',
        scrollTrigger: {
          trigger: cartao,
          start: () => {
            const { base, passo } = medida();
            return `top ${base + i * passo}`;
          },
          endTrigger: ultimo,
          end: () => {
            const { base, passo } = medida();
            return `top ${base + (cartoes.length - 1) * passo}`;
          },
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });
  }

  /* ── Seção atual no menu ──────────────────────────────────────────────── */

  function menuAtivo() {
    document.querySelectorAll('.header__link').forEach((link) => {
      const secao = document.querySelector(link.getAttribute('href'));
      if (!secao) return;
      const marcar = (ativo) => {
        if (ativo) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      };
      ScrollTrigger.create({
        trigger: secao,
        start: 'top 40%',
        end: 'bottom 40%',
        onToggle: (self) => marcar(self.isActive),
      });
    });
  }

  /* Qualquer coisa que mude a ALTURA da página invalida as posições que o
     ScrollTrigger calculou. Filtrar a vitrine muda a altura em milhares de
     pixels, e sem este recálculo as seções abaixo nunca disparam a entrada:
     ficam em opacity 0 e viram um vazio enorme no lugar do conteúdo. */
  function recalcular() {
    ScrollTrigger.refresh();
  }

  /* Rolagem que respeita o Lenis. Com ele ativo, `window.scrollTo` briga com o
     loop dele e o resultado é um solavanco. */
  function rolarPara(alvo, deslocamento = 0) {
    if (!alvo) return;
    if (lenis) {
      lenis.scrollTo(alvo, { offset: deslocamento, duration: 0.7 });
      return;
    }
    window.scrollTo({
      top: alvo.getBoundingClientRect().top + window.scrollY + deslocamento,
      behavior: 'smooth',
    });
  }

  window.URBANA_MOTION = { revelar, travarScroll, recalcular, rolarPara };

  hero();
  scrollSuave();
  contadores();
  pilhaDeRazoes();
  menuAtivo();
  revelar();

  // Fontes chegando depois mudam altura de bloco e desalinham os triggers.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  addEventListener('load', () => {
    ScrollTrigger.refresh();

    /* Rede de segurança: qualquer [data-anima] que tenha entrado no DOM sem
       passar por revelar() ficaria invisível para sempre, porque o CSS o
       esconde. Conteúdo faltando é pior que conteúdo sem animação. */
    setTimeout(() => {
      const orfaos = document.querySelectorAll('[data-anima]:not([data-anima-pronto])');
      if (orfaos.length) gsap.set(orfaos, { opacity: 1, y: 0, clearProps: 'transform' });
    }, 1200);
  });
})();
