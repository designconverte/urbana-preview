/* ==========================================================================
   URBANA · comportamento da página
   Sem dependências. GSAP é opcional e vive em motion.js; nada aqui depende
   dele, então a página continua inteira e utilizável se o CDN falhar.
   ========================================================================== */

(() => {
  'use strict';

  const cfg = window.URBANA_CONFIG;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /** Lê 'endereco.completo' dentro do config, inclusive getters. */
  const pegar = (caminho) => caminho.split('.').reduce((o, k) => (o == null ? o : o[k]), cfg);

  const escapar = (texto) => String(texto).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  /* Avisa o tracking sem depender dele. Se tracking.js não estiver na página,
     o evento cai no vazio e nada quebra. */
  function emitir(nome, params = {}, opcoes = {}) {
    dispatchEvent(new CustomEvent('urbana:evento', { detail: { nome, params, opcoes } }));
  }

  /* Nome de evento do GA4: minúsculo, sem acento, só letra número e underscore,
     começando por letra, no máximo 40 caracteres. Nome fora dessa regra o GA4
     descarta em silêncio, sem erro em lugar nenhum. */
  function slugEvento(texto) {
    return texto
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 40);
  }

  /* Todo caminho que leva ao WhatsApp de um modelo passa por aqui, para os
     dois eventos saírem sempre iguais e sempre juntos:

     1. `generate_lead`, que é A conversão. Uma só, com o modelo em parâmetro.
        É esta que deve ser marcada como evento-chave no GA4 e importada no
        Google Ads: o lance automático precisa do volume somado, não de 21
        conversões com uma venda cada.

     2. `btn_interesse_{marca}_{modelo}`, que é só para segmentar. Vai apenas
        para o GA4 e NÃO deve ser marcado como evento-chave. Como não vai para
        a Meta nem para o log, não existe risco de contar a mesma conversão
        duas vezes. */
  function interesseNoModelo(modelo, origem, extras = {}) {
    if (!modelo) return;
    const dados = {
      origem,
      item_id: modelo.id,
      item_name: `${modelo.fabricante} ${modelo.nome}`,
      item_brand: modelo.fabricante,
      item_category: modelo.categoria || undefined,
      ...extras,
    };
    emitir('generate_lead', dados);
    emitir(slugEvento(`btn_interesse_${modelo.fabricante}_${modelo.nome}`), dados, { somenteGa4: true });
  }

  /** Monta o link do WhatsApp com a mensagem já preenchida. */
  function linkWhats(chave, trocas = {}) {
    let texto = cfg.mensagens[chave] || cfg.mensagens.geral;
    for (const [k, v] of Object.entries(trocas)) {
      texto = texto.replaceAll(`{${k}}`, v);
    }
    return `https://wa.me/${cfg.whatsapp.e164}?text=${encodeURIComponent(texto)}`;
  }

  /* ── 1. Dados da loja no HTML ─────────────────────────────────────────── */

  function aplicarConfig() {
    $$('[data-config]').forEach((el) => { el.textContent = pegar(el.dataset.config) ?? ''; });
    $$('[data-config-text]').forEach((el) => { el.textContent = pegar(el.dataset.configText) ?? ''; });
    $$('[data-config-href]').forEach((el) => { el.href = pegar(el.dataset.configHref) ?? '#'; });

    $$('[data-whats]').forEach((el) => {
      el.href = linkWhats(el.dataset.whats);
      el.target = '_blank';
      el.rel = 'noopener';
    });

    const rota = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(cfg.endereco.busca)}`;
    $$('[data-rota]').forEach((el) => { el.href = rota; });

    // Link do rodapé que reabre a escolha de cookies (exigência de LGPD:
    // consentimento tem que ser tão fácil de retirar quanto de dar).
    $('#rever-cookies')?.addEventListener('click', () => window.URBANA_CONSENTIMENTO?.reabrir());

    // Horário só aparece depois de confirmado com a loja. Ver config.js.
    const horario = cfg.horarios.confirmado
      ? `${cfg.horarios.semana} · ${cfg.horarios.sabado}`
      : 'Horário de atendimento: consulte pelo WhatsApp';
    $$('[data-horarios]').forEach((el) => { el.textContent = horario; });
  }

  /* ── 2. Header e CTA flutuante ────────────────────────────────────────── */

  function scrollUI() {
    const header = $('#header');
    const flutuante = $('#flutuante');
    let ticking = false;

    const atualizar = () => {
      const y = window.scrollY;
      header.classList.toggle('is-fixo', y > 8);

      // O CTA aparece depois de 25% de scroll (styleguide §06).
      const total = document.documentElement.scrollHeight - window.innerHeight;
      flutuante.classList.toggle('is-visivel', total > 0 && y / total > 0.25);
      ticking = false;
    };

    addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(atualizar);
    }, { passive: true });

    atualizar();
  }

  /* ── 3. Menu mobile ───────────────────────────────────────────────────── */

  function menu() {
    const painel = $('#menu');
    const toggle = $('#menu-toggle');
    if (!painel || !toggle) return;

    const itens = $$('.menu__item-wrap', painel);
    itens.forEach((item, i) => item.style.setProperty('--i', i));

    const corpo = $('.menu__painel', painel);
    const header = $('#header');

    const definir = (aberto) => {
      if (aberto) {
        /* A barra de anúncio quebra em duas linhas no celular, então a altura
           do header varia com o scroll. Medir na hora é o único jeito de o
           primeiro item nunca nascer embaixo do botão de fechar. */
        corpo.style.paddingTop = `${Math.round(header.getBoundingClientRect().bottom) + 24}px`;
      }
      painel.classList.toggle('is-aberto', aberto);
      painel.setAttribute('aria-hidden', String(!aberto));
      toggle.setAttribute('aria-expanded', String(aberto));
      document.body.classList.toggle('is-locked', aberto);
      document.body.classList.toggle('menu-aberto', aberto);
      window.URBANA_MOTION?.travarScroll(aberto);
      if (aberto) {
        $('.menu__item', painel)?.focus({ preventScroll: true });
      }
    };

    toggle.addEventListener('click', () => definir(toggle.getAttribute('aria-expanded') !== 'true'));
    $$('.menu__item, .menu__rodape a', painel).forEach((a) => a.addEventListener('click', () => definir(false)));

    // A gaveta não ocupa a tela toda: clicar no scrim fecha, como se espera.
    painel.addEventListener('click', (e) => {
      if (!e.target.closest('.menu__painel')) definir(false);
    });

    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && painel.classList.contains('is-aberto')) {
        definir(false);
        toggle.focus();
      }
    });

    // Voltar para desktop com o menu aberto deixaria o body travado.
    matchMedia('(min-width: 1081px)').addEventListener('change', (e) => {
      if (e.matches) definir(false);
    });
  }

  /* ── 4. Categorias ────────────────────────────────────────────────────── */

  function categorias() {
    const alvo = $('#categorias-grade');
    if (!alvo) return;

    /* Etiqueta legal no lugar de ícone. Autopropelido e ciclomotor são o MESMO
       veículo: o que os separa é a lei, não a silhueta, então nenhum pictograma
       honesto distingue os dois. A etiqueta distingue, e ainda usa o código de
       cor do styleguide (verde = liberdade legal, âmbar = obrigação). */
    // `oculta` tira a categoria SÓ do bloco de cards; ela continua no filtro da
    // vitrine. Serve para categoria ainda não confirmada com a loja.
    const lista = window.URBANA_CATEGORIAS.filter((c) => c.id !== 'todos' && !c.oculta);
    alvo.innerHTML = lista.map((c) => {
      const classe = window.URBANA_CLASSIFICACOES[c.id];
      const etiqueta = classe
        ? `<span class="tag tag--${classe.tom}">${escapar(classe.rotulo)}</span>`
        : '';
      return `
      <a class="categoria" href="#modelos" data-ir-categoria="${c.id}" data-anima>
        <span class="categoria__etiqueta">${etiqueta}</span>
        <span class="categoria__nome">${escapar(c.nome)}</span>
        <p class="categoria__nota">${escapar(c.nota)}</p>
        <span class="categoria__seta" aria-hidden="true">Ver modelos →</span>
      </a>`;
    }).join('');

    alvo.addEventListener('click', (e) => {
      const link = e.target.closest('[data-ir-categoria]');
      // `false`: a âncora href="#modelos" já cuida da rolagem daqui.
      if (link) vitrine.filtrar(link.dataset.irCategoria, false, 'card_categoria');
    });
  }

  /* ── 5. Vitrine ───────────────────────────────────────────────────────── */

  const vitrine = (() => {
    const grade = $('#vitrine-grade');
    const vazio = $('#vitrine-vazio');
    const barra = $('#filtro');
    const nota = $('#filtro-nota');
    let ativa = 'todos';

    const modelos = () => window.URBANA_MODELOS || [];
    const contar = (id) => (id === 'todos' ? modelos().length : modelos().filter((m) => m.categoria === id).length);

    /* No máximo três números por card, sempre nesta ordem. Só entram os que o
       fabricante confirmou: com dois, a grade fica com duas colunas em vez de
       inventar um valor para preencher a terceira. */
    const ORDEM_NUMEROS = [
      ['velocidade', 'Velocidade'],
      ['potencia', 'Potência'],
      ['autonomia', 'Autonomia'],
    ];

    function blocoNumeros(m) {
      const s = m.specs;
      /* Só entra na linha de números o campo que É número: alguns modelos têm
         a ficha em texto livre ("25 a 40 km", "2000 W ou 3000 W"), que não cabe
         num dígito grande com unidade sobrescrita. Esses ficam só na ficha do
         modal. Sem esta checagem o card imprimia "undefined undefined". */
      const numerico = (v) => v && typeof v === 'object' && v.valor != null && v.unidade;
      const disponiveis = s ? ORDEM_NUMEROS.filter(([campo]) => numerico(s[campo])) : [];

      if (!disponiveis.length) {
        return `
          <div class="card__pendente">
            <strong>Ficha técnica sob consulta</strong>
            Velocidade, potência e autonomia deste modelo são confirmados pelo consultor.
          </div>`;
      }

      const celulas = disponiveis.map(([campo, rotulo]) => `
        <div class="card__numero">
          <b>${s[campo].valor}<span>${escapar(s[campo].unidade)}</span></b>
          <small>${rotulo}</small>
        </div>`).join('');

      return `<div class="card__numeros" data-colunas="${disponiveis.length}">${celulas}</div>`;
    }

    function etiquetas(m) {
      if (!m.classificacao) return '';
      const c = window.URBANA_CLASSIFICACOES[m.classificacao];
      if (!c) return '';
      return `<span class="tag tag--${c.tom}">${escapar(c.rotulo)}</span>`;
    }

    function card(m) {
      const classe = m.classificacao ? window.URBANA_CLASSIFICACOES[m.classificacao] : null;
      const categoria = classe ? classe.extenso : m.descritivo;
      return `
        <article class="card" data-categoria="${m.categoria || ''}" data-id="${m.id}" data-anima>
          <div class="card__foto${m.recorte ? ' card__foto--recorte' : ''}">
            <img src="${m.foto}" alt="${escapar(m.alt)}" loading="lazy" decoding="async" width="900" height="675">
            <div class="card__tags u-tags">${etiquetas(m)}</div>
            <span class="card__fabricante">${escapar(m.fabricante)}</span>
          </div>
          <div class="card__corpo">
            <div>
              <p class="card__categoria">${escapar(categoria)}</p>
              <h3 class="card__nome">${escapar(m.nome)}</h3>
            </div>
            ${blocoNumeros(m)}
            <div class="card__acoes">
              <a class="btn btn--primario" href="${linkWhats('modelo', { modelo: `${m.fabricante} ${m.nome}` })}" target="_blank" rel="noopener">Comprar</a>
              <button class="btn btn--contorno" type="button" data-detalhes="${m.id}">+ Detalhes</button>
            </div>
          </div>
        </article>`;
    }

    function render() {
      const visiveis = ativa === 'todos' ? modelos() : modelos().filter((m) => m.categoria === ativa);
      grade.innerHTML = visiveis.map(card).join('');
      grade.hidden = visiveis.length === 0;

      const meta = window.URBANA_CATEGORIAS.find((c) => c.id === ativa);
      nota.textContent = meta ? meta.nota : '';

      if (visiveis.length === 0) {
        vazio.hidden = false;
        vazio.innerHTML = `
          <p class="t-h3" style="margin-bottom:var(--urb-12)">Estamos subindo os modelos desta categoria.</p>
          <p style="margin:0 auto var(--urb-24);max-width:52ch">
            A ficha técnica de cada veículo só entra no site depois de confirmada pelo
            fabricante. Enquanto isso, o consultor passa as opções disponíveis na hora.
          </p>
          <a class="btn btn--whats" href="${linkWhats('categoria', { categoria: meta ? meta.nome.toLowerCase() : 'mobilidade elétrica' })}" target="_blank" rel="noopener">
            Ver opções pelo WhatsApp
          </a>`;
      } else {
        vazio.hidden = true;
      }

      brilhoDeBorda();
      window.URBANA_MOTION?.revelar(grade);
      /* A grade acabou de mudar de altura. Sem recalcular, tudo que vem abaixo
         da vitrine fica preso em opacity 0, porque os gatilhos apontam para
         posições que não existem mais. */
      window.URBANA_MOTION?.recalcular();
    }

    /* Depois de filtrar, traz o visitante de volta ao topo da vitrine. Sem isso,
       trocar de uma categoria com 12 modelos para uma com 1 encolhe a página
       vários milhares de pixels e joga a pessoa numa seção lá embaixo, sem que
       ela tenha rolado nada. */
    function irParaVitrine() {
      const secao = $('#modelos');
      if (!secao) return;
      const raiz = getComputedStyle(document.documentElement);
      const alturaHeader = parseFloat(raiz.getPropertyValue('--urb-header')) || 80;
      const alturaFiltro = barra ? barra.getBoundingClientRect().height : 0;
      // Posiciona o topo da GRADE logo abaixo do header e da barra de filtro.
      const deslocamento = -(alturaHeader + alturaFiltro + 24);
      window.URBANA_MOTION?.rolarPara(grade, deslocamento);
    }

    function barraFiltro() {
      barra.innerHTML = window.URBANA_CATEGORIAS.map((c) => `
        <button class="filtro__btn" type="button" data-cat="${c.id}" aria-pressed="${c.id === ativa}">
          ${escapar(c.nome)}
          <span class="filtro__contagem">${contar(c.id)}</span>
        </button>
      `).join('');
    }

    function filtrar(id, rolar = true, origem = 'filtro') {
      if (id !== ativa) emitir('filtrar_categoria', { categoria: id, origem });
      ativa = id;
      $$('.filtro__btn', barra).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === id)));
      render();
      if (rolar) requestAnimationFrame(irParaVitrine);
    }

    /* A barra de pills gruda abaixo do header. O estado "grudado" vem de uma
       sentinela de 1px logo acima dela: quando a sentinela sai da área visível
       descontada a altura do header, o filtro encostou. Comparar scrollY com
       offsetTop erraria toda vez que a altura do header mudasse de breakpoint. */
    function grudar() {
      const barraFiltroEl = $('#filtro');
      const sentinela = $('#filtro-sentinela');
      if (!barraFiltroEl || !sentinela || !('IntersectionObserver' in window)) return;

      let observador = null;
      const montar = () => {
        observador?.disconnect();
        const raiz = getComputedStyle(document.documentElement);
        const alturaHeader = parseFloat(raiz.getPropertyValue('--urb-header')) || 80;
        observador = new IntersectionObserver(
          ([entrada]) => barraFiltroEl.classList.toggle('is-fixo', !entrada.isIntersecting),
          { rootMargin: `-${Math.round(alturaHeader) + 10}px 0px 0px 0px`, threshold: 0 },
        );
        observador.observe(sentinela);
      };

      montar();
      // A altura do header muda de breakpoint, e com ela a margem do observador.
      let agendado = null;
      addEventListener('resize', () => {
        clearTimeout(agendado);
        agendado = setTimeout(montar, 150);
      });
    }

    function iniciar() {
      if (!grade) return;
      barraFiltro();
      render();
      grudar();
      barra.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-cat]');
        if (btn) filtrar(btn.dataset.cat);
      });

      /* Fotos e vídeos que chegam depois também mudam a altura da página. */
      addEventListener('load', () => window.URBANA_MOTION?.recalcular());
      grade.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-detalhes]');
        if (btn) { modal.abrir(btn.dataset.detalhes, btn); return; }

        const comprar = e.target.closest('.card a[href*="wa.me"]');
        if (comprar) {
          const card = comprar.closest('.card');
          comprar.dataset.rastreado = '1'; // já contado aqui, não repetir na delegação
          interesseNoModelo(modelos().find((x) => x.id === card?.dataset.id), 'card');
        }
      });
    }

    return { iniciar, filtrar };
  })();

  /* ── 6. Facho de luz na borda do card ─────────────────────────────────
     Duas variáveis CSS: proximidade da borda e ângulo do cursor. Nada anima
     em JS: o CSS faz o resto. A proximidade projeta o vetor centro→cursor
     até a moldura retangular, por isso chega a 100 tanto na quina quanto no
     meio de uma aresta. */

  function brilhoDeBorda() {
    if (matchMedia('(hover: none)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    $$('.card').forEach((card) => {
      if (card.dataset.brilho === 'on') return;
      card.dataset.brilho = 'on';

      let pendente = false;
      let ultimo = null;

      const escrever = () => {
        pendente = false;
        if (!ultimo) return;
        card.style.setProperty('--brilho', ultimo.brilho.toFixed(3));
        card.style.setProperty('--angulo', `${ultimo.angulo.toFixed(1)}deg`);
      };

      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);

        const kx = dx === 0 ? Infinity : (r.width / 2) / Math.abs(dx);
        const ky = dy === 0 ? Infinity : (r.height / 2) / Math.abs(dy);
        const proximidade = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);

        let angulo = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        if (angulo < 0) angulo += 360;

        // Só acende no terço externo. No centro do card o facho fica apagado.
        ultimo = { brilho: Math.max(0, (proximidade - 0.35) / 0.65), angulo };
        if (!pendente) {
          pendente = true;
          requestAnimationFrame(escrever);
        }
      });

      card.addEventListener('pointerleave', () => {
        ultimo = null;
        card.style.setProperty('--brilho', '0');
      });
    });
  }

  /* ── 7. Lightbox da galeria ───────────────────────────────────────────
     Existe por um motivo só: o slider recorta para preencher o quadro, e às
     vezes o visitante quer ver a moto inteira. Aqui a foto aparece em
     `contain`, sem corte. */

  const lightbox = (() => {
    const raiz = $('#lightbox');
    let fotos = [];
    let indice = 0;
    let voltarPara = null;

    function pintar() {
      const foto = fotos[indice];
      if (!foto) return;
      $('#lightbox-foto').src = foto.src;
      $('#lightbox-foto').alt = foto.alt || '';
      $('#lightbox-contador').textContent = `${indice + 1} / ${fotos.length}`;
      const soUma = fotos.length < 2;
      $$('.lightbox__seta', raiz).forEach((b) => { b.hidden = soUma; });
      $('#lightbox-contador').hidden = soUma;
    }

    function andar(passo) {
      if (!fotos.length) return;
      indice = (indice + passo + fotos.length) % fotos.length;
      pintar();
    }

    function abrir(lista, inicio = 0) {
      if (!raiz || !lista?.length) return;
      fotos = lista;
      indice = Math.max(0, Math.min(inicio, lista.length - 1));
      voltarPara = document.activeElement;
      pintar();
      raiz.classList.add('is-aberto');
      raiz.setAttribute('aria-hidden', 'false');
      $('.lightbox__fechar', raiz).focus({ preventScroll: true });
    }

    function fechar() {
      if (!raiz || !raiz.classList.contains('is-aberto')) return;
      raiz.classList.remove('is-aberto');
      raiz.setAttribute('aria-hidden', 'true');
      voltarPara?.focus?.({ preventScroll: true });
      voltarPara = null;
    }

    const estaAberto = () => Boolean(raiz?.classList.contains('is-aberto'));

    function iniciar() {
      if (!raiz) return;

      raiz.addEventListener('click', (e) => {
        const passo = e.target.closest('[data-lightbox-passo]');
        if (passo) { andar(Number(passo.dataset.lightboxPasso)); return; }
        if (e.target.closest('[data-fechar-lightbox]')) { fechar(); return; }
        // Clicar no fundo ou na própria foto fecha: o gesto óbvio é sair.
        fechar();
      });

      addEventListener('keydown', (e) => {
        if (!estaAberto()) return;
        if (e.key === 'Escape') { e.stopPropagation(); fechar(); }
        if (e.key === 'ArrowRight') andar(1);
        if (e.key === 'ArrowLeft') andar(-1);
      }, true);
    }

    return { iniciar, abrir, fechar, estaAberto };
  })();

  /* ── 8. Modal de detalhes ─────────────────────────────────────────────── */

  const modal = (() => {
    const raiz = $('#modal');
    let origem = null;
    let atual = null;
    let corAtiva = 0;

    /* Cada cor pode ter conjunto próprio de fotos. Enquanto não tiver, o swatch
       apenas muda a mensagem do WhatsApp e a galeria segue a do modelo. */
    function fotosDaCorAtiva(m) {
      return m.cores?.[corAtiva]?.galeria || m.galeria || [];
    }

    function galeria(m, indice = 0) {
      const trilho = $('#modal-slider');
      const fotos = fotosDaCorAtiva(m);
      if (!fotos.length) return;
      const i = Math.min(indice, fotos.length - 1);

      /* Cada foto pode desligar o recorte por conta própria: algumas vieram do
         fabricante sobre fundo branco e ficariam com moldura no poço claro. */
      trilho.innerHTML = fotos.map((f, k) => {
        const recorte = f.recorte !== false && m.recorte;
        return `
          <div class="modal__slide" role="group" aria-roledescription="slide"
               aria-label="${k + 1} de ${fotos.length}">
            <img src="${f.src}" alt="${escapar(f.alt)}" draggable="false"
                 class="${recorte ? 'is-recorte' : ''}" decoding="async">
          </div>`;
      }).join('');

      $('#modal-miniaturas').innerHTML = fotos.map((f, k) => `
        <button class="modal__mini" type="button" data-foto="${k}" aria-current="${k === i}"
                aria-label="Ver foto ${k + 1} de ${fotos.length}">
          <img src="${f.src}" alt="" loading="lazy" decoding="async">
        </button>
      `).join('');

      irPara(i, 'auto');
    }

    /* ── Slider ────────────────────────────────────────────────────────────
       O snap e a rolagem são do CSS, o que dá swipe nativo no toque de graça.
       O JS entra só para: arrastar com o mouse (que o browser não faz),
       manter a miniatura em sincronia e responder às setas do teclado. */

    let houveArrasto = false;
    const trilhoArrastou = () => houveArrasto;

    function slideAtual() {
      const trilho = $('#modal-slider');
      const largura = trilho.clientWidth || 1;
      return Math.round(trilho.scrollLeft / largura);
    }

    function irPara(indice, comportamento = 'smooth') {
      const trilho = $('#modal-slider');
      const slides = trilho.children.length;
      if (!slides) return;
      const alvo = Math.max(0, Math.min(indice, slides - 1));
      trilho.scrollTo({ left: alvo * trilho.clientWidth, behavior: comportamento });
      marcarMiniatura(alvo);
    }

    function marcarMiniatura(indice) {
      $$('#modal-miniaturas .modal__mini').forEach((b, k) => {
        b.setAttribute('aria-current', String(k === indice));
      });
    }

    function ligarSlider() {
      const trilho = $('#modal-slider');
      if (!trilho) return;

      let pendente = false;
      trilho.addEventListener('scroll', () => {
        if (pendente) return;
        pendente = true;
        requestAnimationFrame(() => {
          pendente = false;
          marcarMiniatura(slideAtual());
        });
      }, { passive: true });

      trilho.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); irPara(slideAtual() + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); irPara(slideAtual() - 1); }
      });

      // Arrasto com mouse. No toque o próprio browser já resolve.
      let arrastando = false;
      let inicioX = 0;
      let inicioScroll = 0;
      let moveu = 0;

      trilho.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch') return;
        arrastando = true;
        moveu = 0;
        inicioX = e.clientX;
        inicioScroll = trilho.scrollLeft;
        trilho.classList.add('is-arrastando');
        trilho.setPointerCapture(e.pointerId);
      });

      trilho.addEventListener('pointermove', (e) => {
        if (!arrastando) return;
        const delta = e.clientX - inicioX;
        moveu = Math.abs(delta);
        trilho.scrollLeft = inicioScroll - delta;
      });

      const soltar = (e) => {
        if (!arrastando) return;
        arrastando = false;
        // Um arrasto termina em `click`. Sem esta marca, soltar o mouse depois
        // de deslizar abriria o lightbox junto.
        houveArrasto = moveu > 6;
        setTimeout(() => { houveArrasto = false; }, 0);
        trilho.classList.remove('is-arrastando');
        if (trilho.hasPointerCapture?.(e.pointerId)) trilho.releasePointerCapture(e.pointerId);

        /* Passou de um quinto da largura, vai para o próximo. Abaixo disso,
           volta: um arrasto curto quase sempre é hesitação, não intenção. */
        const largura = trilho.clientWidth || 1;
        const partiu = Math.round(inicioScroll / largura);
        const delta = trilho.scrollLeft - inicioScroll;
        if (moveu > largura * 0.2) irPara(partiu + (delta > 0 ? 1 : -1));
        else irPara(partiu);
      };

      trilho.addEventListener('pointerup', soltar);
      trilho.addEventListener('pointercancel', soltar);
    }

    function ficha(m) {
      const alvo = $('#modal-ficha');
      if (!m.specs) {
        alvo.innerHTML = `
          <div style="grid-template-columns:1fr">
            <dt style="color:rgba(255,255,255,.78);line-height:1.6">
              A ficha técnica completa deste modelo é confirmada pelo consultor.
              Nenhum número entra aqui sem confirmação por escrito do fabricante.
            </dt>
          </div>`;
        return;
      }
      /* Campo sem dado simplesmente não aparece. Listar dez linhas de "não
         informado" comunica ausência, não especificação. */
      alvo.innerHTML = window.URBANA_FICHA_ORDEM
        .filter(([chave]) => m.specs[chave] != null)
        .map(([chave, rotulo]) => {
          const bruto = m.specs[chave];
          const valor = typeof bruto === 'object' ? `${bruto.valor} ${bruto.unidade}` : bruto;
          return `<div><dt>${rotulo}</dt><dd>${escapar(valor)}</dd></div>`;
        }).join('');
    }

    function equipamentos(m) {
      const bloco = $('#modal-equipamentos');
      const itens = m.equipamentos || [];
      bloco.hidden = !itens.length;
      if (!itens.length) return;
      $('#modal-equipamentos-lista').innerHTML =
        itens.map((item) => `<li>${escapar(item)}</li>`).join('');
    }

    function cores(m) {
      const bloco = $('#modal-cores');
      if (!m.cores || !m.cores.length) { bloco.hidden = true; return; }
      bloco.hidden = false;

      // O nome sai da bolinha e vai para o rótulo, mas continua no aria-label:
      // swatch sem nome acessível é botão mudo para quem usa leitor de tela.
      $('#modal-cor-nome').textContent = m.cores[corAtiva].nome;
      $('#modal-swatches').innerHTML = m.cores.map((c, i) => `
        <button class="modal__swatch" type="button" data-cor="${i}"
                aria-pressed="${i === corAtiva}" aria-label="Cor ${escapar(c.nome)}"
                title="${escapar(c.nome)}">
          <i style="background:${escapar(c.hex)}" aria-hidden="true"></i>
        </button>
      `).join('');
    }

    function cta() {
      const botao = $('#modal-cta');
      const nome = `${atual.fabricante} ${atual.nome}`;
      const cor = atual.cores?.[corAtiva]?.nome;
      botao.href = cor
        ? linkWhats('modeloCor', { modelo: nome, cor })
        : linkWhats('modelo', { modelo: nome });
    }

    function abrir(id, gatilho) {
      atual = (window.URBANA_MODELOS || []).find((m) => m.id === id);
      if (!atual) return;
      origem = gatilho || null;
      corAtiva = 0;

      const classe = atual.classificacao ? window.URBANA_CLASSIFICACOES[atual.classificacao] : null;
      $('#modal-eyebrow').textContent = `${atual.fabricante} · ${classe ? classe.extenso : atual.descritivo}`;
      $('#modal-titulo').textContent = atual.nome;
      $('#modal-tags').innerHTML = classe ? `<span class="tag tag--${classe.tom}">${escapar(classe.rotulo)}</span>` : '';

      const chamada = $('#modal-chamada');
      chamada.textContent = atual.chamada || '';
      chamada.hidden = !atual.chamada;

      galeria(atual);
      ficha(atual);
      equipamentos(atual);
      cores(atual);
      cta();
      $('#modal-corpo').scrollTop = 0;

      emitir('view_item', {
        item_id: atual.id,
        item_name: `${atual.fabricante} ${atual.nome}`,
        item_brand: atual.fabricante,
        item_category: atual.categoria || undefined,
      });

      raiz.classList.add('is-aberto');
      raiz.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      window.URBANA_MOTION?.travarScroll(true);
      history.replaceState(null, '', `#modelo/${atual.id}`);
      $('#modal-titulo').setAttribute('tabindex', '-1');
      $('#modal-titulo').focus({ preventScroll: true });
    }

    function fechar() {
      lightbox.fechar();
      raiz.classList.remove('is-aberto');
      raiz.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      window.URBANA_MOTION?.travarScroll(false);
      if (location.hash.startsWith('#modelo/')) {
        history.replaceState(null, '', location.pathname + location.search);
      }
      origem?.focus({ preventScroll: true });
      origem = null;
      atual = null;
    }

    function iniciar() {
      if (!raiz) return;
      ligarSlider();
      lightbox.iniciar();

      raiz.addEventListener('click', (e) => {
        if (e.target.closest('[data-fechar-modal]')) { fechar(); return; }

        const mini = e.target.closest('[data-foto]');
        if (mini) { irPara(Number(mini.dataset.foto)); return; }

        /* Clique na foto grande abre a versão inteira, sem corte.
           O alvo é o TRILHO, não o slide: durante o arrasto o trilho captura o
           ponteiro, e o browser passa a entregar o clique nele em vez de na
           imagem. Testar só o slide fazia o clique simples nunca casar. */
        if (e.target.closest('.modal__slider') && !trilhoArrastou()) {
          lightbox.abrir(fotosDaCorAtiva(atual), slideAtual());
          return;
        }

        const cta = e.target.closest('#modal-cta');
        if (cta && atual) {
          cta.dataset.rastreado = '1'; // ver a nota de fase de bolha em tracking.js
          interesseNoModelo(atual, 'modal', { cor: atual.cores?.[corAtiva]?.nome });
          return;
        }

        const swatch = e.target.closest('[data-cor]');
        if (swatch) {
          const anterior = fotosDaCorAtiva(atual);
          corAtiva = Number(swatch.dataset.cor);
          cores(atual);
          /* Só remonta o slider se esta cor tiver fotos próprias. Sem isso, o
             clique jogaria o visitante de volta para a primeira foto sem que
             nada na imagem tivesse mudado. */
          if (fotosDaCorAtiva(atual) !== anterior) galeria(atual, 0);
          cta();
        }
      });

      addEventListener('keydown', (e) => {
        if (!raiz.classList.contains('is-aberto')) return;
        // Com o lightbox por cima, o ESC é dele.
        if (lightbox.estaAberto()) return;
        if (e.key === 'Escape') { fechar(); return; }
        if (e.key !== 'Tab') return;

        // Prende o foco dentro do modal enquanto ele estiver aberto.
        const focaveis = $$('button, a[href], [tabindex]:not([tabindex="-1"])', raiz)
          .filter((el) => el.offsetParent !== null);
        if (!focaveis.length) return;
        const primeiro = focaveis[0];
        const ultimo = focaveis[focaveis.length - 1];
        if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
        else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
      });

      /* Âncora compartilhável: /#modelo/evon-pulse abre o modal direto.
         O `hashchange` não é luxo: colar a âncora com a página JÁ aberta é uma
         navegação same-document, o script não roda de novo e o link não faria
         nada. É exatamente o caso de quem recebe o link de um amigo que já
         estava no site. */
      const abrirPorHash = () => {
        const hash = location.hash.match(/^#modelo\/(.+)$/);
        if (hash) abrir(decodeURIComponent(hash[1]), null);
      };
      addEventListener('hashchange', abrirPorHash);
      requestAnimationFrame(abrirPorHash);
    }

    return { iniciar, abrir };
  })();

  /* ── 9. FAQ ───────────────────────────────────────────────────────────── */

  function faq() {
    const alvo = $('#faq-lista');
    if (!alvo) return;

    alvo.innerHTML = (window.URBANA_FAQ || []).map((f, i) => `
      <div class="faq__item${i === 0 ? ' is-aberto' : ''}">
        <h3 style="margin:0">
          <button class="faq__botao" type="button" aria-expanded="${i === 0}" aria-controls="faq-r${i}">
            <span>${escapar(f.q)}</span>
            <span class="faq__sinal" aria-hidden="true">${i === 0 ? '−' : '+'}</span>
          </button>
        </h3>
        <div class="faq__resposta" id="faq-r${i}" role="region">
          <div><p>${escapar(f.a)}</p></div>
        </div>
      </div>
    `).join('');

    alvo.addEventListener('click', (e) => {
      const btn = e.target.closest('.faq__botao');
      if (!btn) return;
      const item = btn.closest('.faq__item');
      const aberto = item.classList.toggle('is-aberto');
      btn.setAttribute('aria-expanded', String(aberto));
      $('.faq__sinal', btn).textContent = aberto ? '−' : '+';
    });
  }

  /* ── 10. Depoimentos ───────────────────────────────────────────────────── */

  function depoimentos() {
    const lista = window.URBANA_DEPOIMENTOS || [];
    const secao = $('#depoimentos');
    if (!secao || !lista.length) return; // sem depoimento real, o bloco não existe

    secao.hidden = false;
    $('#depoimentos-grade').innerHTML = lista.map((d) => `
      <figure class="depoimento" data-anima style="margin:0">
        <div class="depoimento__estrelas" aria-label="${d.estrelas} de 5 estrelas">${'★'.repeat(d.estrelas)}</div>
        <blockquote class="depoimento__texto" style="margin:0">${escapar(d.texto)}</blockquote>
        <figcaption class="depoimento__autor">
          <span class="depoimento__inicial" aria-hidden="true">${escapar(d.nome.split(' ').map((p) => p[0]).slice(0, 2).join(''))}</span>
          <span class="depoimento__meta">
            <span class="depoimento__nome">${escapar(d.nome)}</span>
            <span class="depoimento__modelo">${escapar(d.modelo)}</span>
          </span>
        </figcaption>
      </figure>
    `).join('');
  }

  /* ── 11. Simulador de custo ───────────────────────────────────────────── */

  function simulador() {
    const km = $('#km-dia');
    if (!km) return;

    // Premissas exibidas na legenda do bloco: mudou aqui, muda lá.
    const DIAS = 30;
    const PRECO_GASOLINA = 6.20;   // R$/litro
    const CONSUMO_MOTO = 35;       // km/litro
    const PRECO_KWH = 0.85;        // R$/kWh
    const CONSUMO_ELETRICO = 0.03; // kWh/km

    const real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

    const atualizar = () => {
      const dia = Number(km.value);
      const mes = dia * DIAS;
      const gasolina = (mes / CONSUMO_MOTO) * PRECO_GASOLINA;
      const eletrico = mes * CONSUMO_ELETRICO * PRECO_KWH;

      $('#km-saida').textContent = `${dia} km/dia`;
      $('#custo-gasolina').textContent = real.format(gasolina);
      $('#custo-eletrico').textContent = real.format(eletrico);
      $('#economia-nota').textContent =
        `Diferença estimada de ${real.format(gasolina - eletrico)} por mês, ou ${real.format((gasolina - eletrico) * 12)} em um ano.`;
    };

    km.addEventListener('input', atualizar);
    atualizar();
  }

  /* ── 12. Formulário de test ride ──────────────────────────────────────── */

  function formulario() {
    const form = $('#form-testride');
    if (!form) return;

    const marcar = (campo, erroId, mensagem) => {
      const erro = $(`#${erroId}`);
      campo.setAttribute('aria-invalid', String(Boolean(mensagem)));
      erro.textContent = mensagem || '';
      return !mensagem;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = $('#tr-nome');
      const whats = $('#tr-whats');

      const nomeOk = marcar(nome, 'erro-nome',
        nome.value.trim().length < 2 ? 'Informe o seu nome para o consultor te chamar.' : '');

      // 10 ou 11 dígitos: fixo com DDD ou celular com nono dígito.
      const digitos = whats.value.replace(/\D/g, '');
      const whatsOk = marcar(whats, 'erro-whats',
        digitos.length < 10 || digitos.length > 11 ? 'Informe o WhatsApp com DDD, ex.: (19) 90000-0000.' : '');

      if (!nomeOk || !whatsOk) {
        (!nomeOk ? nome : whats).focus();
        return;
      }

      const url = linkWhats('testRide', {
        nome: nome.value.trim(),
        interesse: $('#tr-interesse').value,
      });

      /* Conversão principal da página. `telefone` e `nome_lead` são hasheados
         no servidor antes de irem para a Meta, e nunca entram em custom_data. */
      emitir('generate_lead', {
        origem: 'formulario',
        interesse: $('#tr-interesse').value,
        telefone: whats.value,
        nome_lead: nome.value.trim(),
        value: 1,
        currency: 'BRL',
      });

      window.open(url, '_blank', 'noopener');

      // Sucesso substitui o formulário inteiro por confirmação + WhatsApp.
      form.outerHTML = `
        <div class="form__sucesso" role="status">
          <h3 class="t-h3">Quase lá, ${escapar(nome.value.trim().split(' ')[0])}.</h3>
          <p style="margin:0">
            Abrimos o WhatsApp com a sua mensagem pronta. Se a janela não apareceu,
            toque no botão abaixo. O consultor responde em horário comercial.
          </p>
          <a class="btn btn--primario" href="${url}" target="_blank" rel="noopener" style="justify-self:center">
            Abrir o WhatsApp
          </a>
        </div>`;
    });
  }

  /* ── 13. Mídia pesada só quando faz sentido ───────────────────────────── */

  function midia() {
    /* Três motivos para não sair tocando sozinho: o sistema pediu menos
       movimento, o navegador está em economia de dados, ou a conexão é 2G. */
    const pouparMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches
      || navigator.connection?.saveData === true
      || /2g/.test(navigator.connection?.effectiveType || '');

    const anexar = (video, src, tocar = true) => {
      if (!src || video.src) return;
      video.src = src;
      video.addEventListener('canplay', () => video.classList.add('is-pronto'), { once: true });
      if (tocar) {
        video.play().catch(() => { /* autoplay bloqueado: o pôster fica */ });
      }
    };

    const hero = $('#hero-video');
    const controle = $('#hero-controle');

    if (hero) {
      const mobile = matchMedia('(max-width: 760px)').matches;
      const fonte = mobile ? hero.dataset.srcMobile : hero.dataset.src;

      /* Em modo de poupar, o vídeo NÃO carrega e NÃO toca: fica no pôster e o
         botão vira "play". Antes disso a função inteira desistia aqui, e quem
         tem "efeitos de animação" desligado no Windows via um hero parado sem
         nenhuma pista de que havia vídeo e de que dava para assistir. */
      if (!pouparMovimento) anexar(hero, fonte);

      if (controle) {
        controle.hidden = false;

        const pintar = () => {
          const tocando = !hero.paused && hero.src;
          controle.querySelector('use').setAttribute('href', tocando ? '#i-pausa' : '#i-play');
          controle.querySelector('.u-visually-hidden').textContent =
            tocando ? 'Pausar o vídeo de fundo' : 'Reproduzir o vídeo de fundo';
        };

        controle.addEventListener('click', () => {
          if (!hero.src) {
            // Primeira vez em modo de poupar: só agora vale baixar o arquivo.
            anexar(hero, fonte);
            return;
          }
          if (hero.paused) hero.play().catch(() => {}); else hero.pause();
        });

        ['play', 'pause', 'loadeddata'].forEach((e) => hero.addEventListener(e, pintar));
        pintar();
      }
    }

    // Vídeos de apoio só carregam quando entram na tela.
    const lazy = $$('[data-lazy-video]');
    if (!lazy.length) return;

    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        anexar(entrada.target, entrada.target.dataset.src);
        obs.unobserve(entrada.target);
      });
    }, { rootMargin: '200px' });

    lazy.forEach((v) => obs.observe(v));
  }

  /* ── 14. Mapa ─────────────────────────────────────────────────────────── */

  function mapa() {
    const frame = $('#mapa');
    if (!frame) return;
    const src = `https://www.google.com/maps?q=${encodeURIComponent(cfg.endereco.busca)}&output=embed`;

    // Só monta o iframe quando o rodapé se aproxima, para o Google ficar fora do first paint.
    const obs = new IntersectionObserver((entradas, o) => {
      if (!entradas[0].isIntersecting) return;
      frame.src = src;
      o.disconnect();
    }, { rootMargin: '300px' });
    obs.observe(frame);
  }

  /* ── partida ──────────────────────────────────────────────────────────── */

  function iniciar() {
    aplicarConfig();
    scrollUI();
    menu();
    categorias();
    vitrine.iniciar();
    modal.iniciar();
    faq();
    depoimentos();
    simulador();
    formulario();
    midia();
    mapa();

    /* motion.js roda antes daqui (é `defer`, e este init espera o DOMContentLoaded),
       então tudo que foi injetado agora ainda não tem tween. Sem esta chamada, o
       conteúdo dinâmico ficaria preso em opacity: 0 para sempre. */
    window.URBANA_MOTION?.revelar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
