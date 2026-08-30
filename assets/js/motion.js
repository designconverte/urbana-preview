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
     O pin é CSS `sticky` (zero JS). Aqui só a estética de profundidade: quem
     ficou atrás encolhe e desfoca conforme os próximos POUSAM POR CIMA. Sem
     rotação, porque "nada gira" é regra da marca.

     POR QUE NÃO É ScrollTrigger.
     Era, com `trigger: cartao` e `scrub`, e tinha dois defeitos.

     1. O desfoque começava quando o card GRUDAVA, e nesse instante o card
        seguinte ainda estava fora da tela. Ele borrava sem ter nada por cima,
        que é o oposto do efeito de profundidade pretendido.

     2. `.razao` é `position: sticky`. Quando um `ScrollTrigger.refresh()` roda
        com o card já grudado (no `load`, no `fonts.ready` ou ao trocar de
        filtro), a medição pega a posição TRAVADA em vez da natural e as
        coordenadas do gatilho saem erradas. Como isso depende de quando as
        imagens terminam de carregar, o defeito aparecia de forma
        intermitente, e um refresh manual "consertava".

     Ler a geometria a cada quadro resolve os dois: a sobreposição real entre
     um card e os seguintes é a própria definição do efeito, e posição medida
     agora não tem como estar velha. */

  function pilhaDeRazoes() {
    const cartoes = Array.from(document.querySelectorAll('.razao'));
    if (cartoes.length < 2) return;

    const caixas = cartoes.map((c) => c.querySelector('.razao__caixa'));

    /* Quanto o card `j` já cobriu o card `i`, de 0 a 1.
       0 = o topo de j ainda está na base de i, nada coberto.
       1 = o topo de j alcançou o topo de i, cobertura total. */
    const cobertura = (retI, retJ) => {
      if (retI.height <= 0) return 0;
      const avanco = (retI.bottom - retJ.top) / retI.height;
      return Math.min(1, Math.max(0, avanco));
    };

    let pendente = false;

    const pintar = () => {
      pendente = false;
      const rets = cartoes.map((c) => c.getBoundingClientRect());

      cartoes.forEach((cartao, i) => {
        /* Profundidade = soma do quanto cada card seguinte já cobriu este.
           Um card totalmente pousado soma 1, e a pilha inteira reproduz a
           mesma escada de antes, só que ancorada no que está na tela. */
        let profundidade = 0;
        for (let j = i + 1; j < cartoes.length; j += 1) {
          profundidade += cobertura(rets[i], rets[j]);
        }

        const caixa = caixas[i];
        if (!caixa) return;
        if (profundidade <= 0.001) {
          // Sem nada por cima: limpa em vez de escrever blur(0px), para não
          // deixar a camada de composição ligada à toa.
          caixa.style.filter = '';
          caixa.style.transform = '';
          return;
        }
        caixa.style.filter = `blur(${(profundidade * 0.9).toFixed(2)}px)`;
        caixa.style.transform = `scale(${Math.max(0.9, 1 - profundidade * 0.03).toFixed(4)})`;
      });
    };

    const agendar = () => {
      if (pendente) return;
      pendente = true;
      requestAnimationFrame(pintar);
    };

    pintar();
    addEventListener('scroll', agendar, { passive: true });
    addEventListener('resize', agendar, { passive: true });
    addEventListener('load', agendar);
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
