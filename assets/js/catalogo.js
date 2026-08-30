/* ==========================================================================
   URBANA · catálogo de modelos
   --------------------------------------------------------------------------
   FONTE DOS DADOS:
   · Evon: fichas técnicas em PDF do fabricante (Nimbus e Pulse).
   · Voe: CATÁLOGO VOE 2026.pdf, 19 produtos. Fotos e cores saíram do próprio
     PDF (recortes com alpha; hex amostrado dos swatches impressos).
   Nada aqui é estimativa.

   NOMES DE COR: o styleguide manda usar o nome de fábrica quando a pintura não
   corresponde à paleta da Urbana, que é o caso de praticamente toda lataria.
   Unificar a nomenclatura entre fabricantes segue pendente com o cliente.

   PENDÊNCIAS:
   · Bravus: ficha recebida. A lista de equipamentos NÃO vem nela, foi herdada
     da linha Evon: confirmar com a loja se ele tem mesmo marcha ré, NFC e
     alarme antes de publicar. O tom do Cinza Zenith também é aproximado.
   · Voe Lux e Voe Susan: o catálogo escreve "VEREFICAR CORES" no lugar dos
     swatches, então ficam sem cores até a confirmação.
   · Voe Chopper: removido do site a pedido do cliente. Está no catálogo do
     fabricante, mas fora da vitrine.
   · Voe MC20 Mini aparece no índice do catálogo mas não tem página.
   · Eco, Pop, patinetes e Drift: ver as notas de classificação legal.
   · Disponibilidade: o catálogo é a linha do fabricante, não o estoque da
     Urbana. Confirmar o que fica no site antes de publicar.

   COMO COMPLETAR: preencha `classificacao`, `categoria` e `specs`. O card monta
   os números e a etiqueta legal sozinho, e campo sem dado some da ficha.
   ========================================================================== */

/* Ordem canônica da ficha técnica, a mesma para toda marca, para que Evon, Voe
   e MotoChefe fiquem comparáveis linha a linha. Campo ausente não é renderizado. */
window.URBANA_FICHA_ORDEM = [
  ['classificacao', 'Classificação legal'],
  ['velocidade', 'Velocidade máxima'],
  ['potencia', 'Potência do motor'],
  ['autonomia', 'Autonomia'],
  ['bateria', 'Bateria'],
  ['recarga', 'Tempo de recarga'],
  ['freios', 'Freios'],
  ['suspensao', 'Suspensão'],
  ['pneus', 'Pneus'],
  ['protecao', 'Proteção à água'],
  ['ocupantes', 'Carga máxima'],
  ['dimensoes', 'Dimensões'],
  ['rampa', 'Rampa máxima'],
  ['garantia', 'Garantia'],
  ['fabricante', 'Fabricante'],
];

window.URBANA_CATEGORIAS = [
  {
    id: 'todos',
    nome: 'Todos',
    nota: 'Todos os modelos em loja. A classificação legal de cada um aparece na etiqueta do card.',
  },
  {
    id: 'autopropelido',
    nome: 'Autopropelidos',
    nota: 'Autopropelidos: até 32 km/h e 1000 W de fábrica. Sem CNH, sem emplacamento, sem IPVA. O argumento vem antes do modelo.',
  },
  {
    id: 'ciclomotor',
    nome: 'Ciclomotores',
    nota: 'Ciclomotores: mais desempenho, exigem ACC ou CNH categoria A, registro e emplacamento. A Urbana entrega a documentação do primeiro emplacamento.',
  },
  {
    id: 'ebike',
    nome: 'E-bikes',
    nota: 'Bicicletas elétricas. A classificação legal de cada uma depende da potência do motor e é confirmada pelo consultor antes da compra.',
  },
  {
    id: 'triciclo',
    nome: 'Triciclos',
    nota: 'Triciclos: estabilidade e carga. Público sênior e uso comercial de bairro.',
  },
  {
    id: 'patinete',
    nome: 'Patinetes e lazer',
    nota: 'Equipamentos de baixa potência para deslocamento curto e uso recreativo. O consultor orienta sobre onde cada um pode circular.',
    /* PENDENTE de confirmação com a loja: `oculta` tira só o CARD do bloco
       "Quatro portas de entrada", que voltou a ter quatro. O pill do filtro e
       os quatro produtos continuam na vitrine. Para sumir de vez, apague esta
       entrada e troque `categoria` dos quatro produtos para null. */
    oculta: true,
  },
];

/* Rótulo e cor da etiqueta por classificação. Verde = liberdade legal,
   âmbar = obrigação. Nunca o contrário. */
window.URBANA_CLASSIFICACOES = {
  autopropelido: { rotulo: 'Sem CNH', tom: 'livre', extenso: 'Autopropelido' },
  ciclomotor: { rotulo: 'Exige emplacamento', tom: 'exige', extenso: 'Ciclomotor' },
  ebike: { rotulo: 'Ciclovia liberada', tom: 'livre', extenso: 'E-bike' },
  triciclo: { rotulo: 'Consulte enquadramento', tom: 'exige', extenso: 'Triciclo' },
};

/* ── Cores ────────────────────────────────────────────────────────────────
   Hex amostrado dos swatches impressos em cada catálogo, não de código de
   pintura. Para o swatch trocar a galeria, dê `galeria` à cor; sem ela o
   clique só muda a mensagem do WhatsApp. */

const COR = {
  branco: { nome: 'Branco', hex: '#FFFFFF' },
  preto: { nome: 'Preto', hex: '#000000' },
  cinza: { nome: 'Cinza', hex: '#575757' },
  prata: { nome: 'Prata', hex: '#A7A1A6' },
  vermelho: { nome: 'Vermelho', hex: '#E61C21' },
  azul: { nome: 'Azul', hex: '#5CE1E6' },
  amarelo: { nome: 'Amarelo', hex: '#FDCA18' },
  verde: { nome: 'Verde', hex: '#007A37' },

  /* Cores abaixo entraram pelas fotos do X11, e o hex saiu da propria foto,
     amostrado na faixa de luz caracteristica da lataria (nem o brilho, nem a
     sombra). E o unico jeito honesto: escolher "no olho" foi o que deixou o
     azul cadastrado como ciano claro com a moto sendo azul marinho. */
  grafite: { nome: 'Grafite', hex: '#363C40' },
  dourado: { nome: 'Dourado', hex: '#AB9A85' },

  /* Cor de arte, nao de pintura chapada: o swatch e a bandeira. O `hex` fica
     como reserva, para o caso do SVG nao carregar. */
  reinounido: {
    nome: 'Reino Unido',
    hex: '#1B3053',
    imagem: 'assets/img/swatches/reino-unido.svg',
  },
};

const cores = (...chaves) => chaves.map((k) => COR[k]);

// A Evon imprime os próprios swatches, com hex um pouco diferente da Voe.
const CORES_EVON = [
  { nome: 'Branco', hex: '#FFFFFF' },
  { nome: 'Prata', hex: '#BEC5CA' },
  { nome: 'Preto', hex: '#100E0D' },
  { nome: 'Vermelho', hex: '#EC1B24' },
];

/* O Bravus tem uma cor a mais que Nimbus e Pulse. Só ele ganha lista própria
   porque só a ficha dele chegou com os cinco tons; se as outras duas também
   tiverem o Zenith, é trocar as três por esta lista.
   ⚠ O tom do Zenith é aproximado: a ficha traz o nome, não o código. */
const CORES_BRAVUS = [
  ...CORES_EVON,
  { nome: 'Cinza Zenith', hex: '#53585C' },
];

/* ── Blocos repetidos ─────────────────────────────────────────────────── */

const EVON_COMUM = {
  classificacao: 'Autopropelido · CONTRAN 996/2023',
  velocidade: { valor: 32, unidade: 'km/h' },
  potencia: { valor: 1000, unidade: 'W' },
  recarga: '6 a 8 h',
  freios: 'Disco dianteiro e traseiro',
  suspensao: 'Dianteira e traseira',
  pneus: '10 x 3.5 polegadas, tubeless',
  ocupantes: 'Até 150 kg',
  dimensoes: '1.300 mm entre-eixos · 1.160 mm de altura · 700 mm de largura',
  garantia: 'Bateria 12 m · motor e chassi 12 m',
  fabricante: 'Evon',
};

const EVON_EQUIPAMENTOS = [
  'Marcha ré', 'Baú interno', 'Farol em LED', 'Porta-objetos',
  'Display digital', 'Tecnologia NFC', 'Sistema de alarme',
  '3 modos de velocidade', 'USB para carregar celular',
];

// Comum aos autopropelidos Voe, conforme as páginas do catálogo.
const VOE_AUTO = {
  classificacao: 'Autopropelido · CONTRAN 996/2023',
  velocidade: { valor: 32, unidade: 'km/h' },
  suspensao: 'Amortecedores dianteiro e traseiro',
  fabricante: 'Voe',
};

const VOE_EQUIP_BASE = [
  'Carregador bivolt', 'Tecnologia NFC', 'Alarme antifurto',
  'Painel e setas em LED', '3 níveis de velocidade', 'Buzina',
];

/* Monta um produto Voe sem repetir a papelada. Só o que o catálogo informa
   entra em `specs`: campo ausente não aparece na ficha. */
function voe(slug, nome, dados) {
  return {
    id: `voe-${slug}`,
    nome,
    fabricante: 'Voe',
    descritivo: dados.descritivo || 'Scooter elétrica',
    categoria: dados.categoria,
    classificacao: dados.classificacao,
    chamada: null, // o catálogo do fabricante não traz texto de venda por modelo
    foto: `assets/img/models/voe-${slug}-card.webp`,
    recorte: true,
    alt: dados.alt,
    // Um slide só por padrão (o catálogo traz uma foto). Modelos com material
    // extra do cliente passam `galeria` própria e sobrescrevem isso.
    galeria: dados.galeria || [{ src: `assets/img/models/voe-${slug}-1.webp`, alt: dados.alt }],
    specs: dados.specs,
    equipamentos: dados.equipamentos,
    cores: dados.cores || null,
    preco: null,
  };
}

window.URBANA_MODELOS = [
  /* ── Evon ──────────────────────────────────────────────────────────── */
  {
    id: 'evon-bravus',
    nome: 'Bravus',
    fabricante: 'Evon',
    descritivo: 'Scooter elétrica',
    categoria: 'autopropelido',
    classificacao: 'autopropelido',
    chamada: 'Traços marcantes e personalidade forte para quem valoriza um design de presença e atitude.',
    foto: 'assets/img/models/bravus-card.webp',
    recorte: true,
    alt: 'Scooter elétrica Evon Bravus branca, recorte sem fundo em três quartos',
    galeria: [
      { src: 'assets/img/models/bravus-1.webp', alt: 'Evon Bravus branca em três quartos frontal' },
      { src: 'assets/img/models/bravus-2.webp', alt: 'Evon Bravus branca de perfil' },
      { src: 'assets/img/models/bravus-3.webp', alt: 'Evon Bravus branca em três quartos traseiro, com baú' },
      { src: 'assets/img/models/bravus-4.webp', alt: 'Evon Bravus branca vista de frente' },
    ],
    /* Três desvios do EVON_COMUM, todos por causa do que a ficha diz e do que
       ela NÃO diz:
       · `recarga` vira 4 h, contra as 6 a 8 h de Nimbus e Pulse.
       · `bateria` fica de fora: a ficha não traz, e deduzir pela autonomia
         seria inventar um número que o cliente leria como oficial.
       · `dimensoes` sai fora pelo mesmo motivo. Entre-eixos e altura são
         medida de carroceria, e o Bravus tem corpo diferente dos irmãos de
         linha: repetir os números deles daria um dado errado com cara de certo. */
    specs: (() => {
      const { dimensoes, ...base } = EVON_COMUM;
      return { ...base, autonomia: { valor: 50, unidade: 'km' }, recarga: '4 h' };
    })(),
    equipamentos: EVON_EQUIPAMENTOS,
    cores: CORES_BRAVUS,
    preco: null,
  },
  {
    id: 'evon-nimbus',
    nome: 'Nimbus',
    fabricante: 'Evon',
    descritivo: 'Scooter elétrica',
    categoria: 'autopropelido',
    classificacao: 'autopropelido',
    chamada: 'Estabilidade e força para dominar a rua. Não é só uma scooter, é uma declaração de independência urbana.',
    foto: 'assets/img/models/nimbus-card.webp',
    recorte: true,
    alt: 'Scooter elétrica Evon Nimbus grafite, recorte sem fundo em três quartos',
    galeria: [
      { src: 'assets/img/models/nimbus-1.webp', alt: 'Evon Nimbus grafite em três quartos frontal' },
      { src: 'assets/img/models/nimbus-2.webp', alt: 'Evon Nimbus grafite em três quartos traseiro, com baú' },
      { src: 'assets/img/models/nimbus-3.webp', alt: 'Evon Nimbus grafite vista de frente' },
      { src: 'assets/img/models/nimbus-4.webp', alt: 'Lanterna traseira em LED da Evon Nimbus', recorte: false },
    ],
    specs: { ...EVON_COMUM, autonomia: { valor: 60, unidade: 'km' }, bateria: 'Lítio 72V 20Ah' },
    equipamentos: EVON_EQUIPAMENTOS,
    cores: CORES_EVON,
    preco: null,
  },
  {
    id: 'evon-pulse',
    nome: 'Pulse',
    fabricante: 'Evon',
    descritivo: 'Scooter elétrica',
    categoria: 'autopropelido',
    classificacao: 'autopropelido',
    chamada: 'Feita para o ritmo acelerado da cidade, com desenho aerodinâmico e agilidade de sobra.',
    foto: 'assets/img/models/pulse-card.webp',
    recorte: true,
    alt: 'Scooter elétrica Evon Pulse prata, recorte sem fundo em três quartos',
    galeria: [
      { src: 'assets/img/models/pulse-1.webp', alt: 'Evon Pulse prata em três quartos frontal esquerdo' },
      { src: 'assets/img/models/pulse-2.webp', alt: 'Evon Pulse prata em três quartos frontal direito' },
      { src: 'assets/img/models/pulse-3.webp', alt: 'Evon Pulse prata em três quartos traseiro' },
      { src: 'assets/img/models/pulse-4.webp', alt: 'Evon Pulse prata vista de frente' },
    ],
    // O baú EXTERNO da Pulse é acessório vendido à parte (nota da ficha).
    specs: { ...EVON_COMUM, autonomia: { valor: 50, unidade: 'km' }, bateria: 'Lítio 60V 20Ah' },
    equipamentos: EVON_EQUIPAMENTOS,
    cores: CORES_EVON,
    preco: null,
  },

  /* ── Voe · autopropelidos ──────────────────────────────────────────── */
  voe('calebito', 'Calebito', {
    categoria: 'autopropelido',
    classificacao: 'autopropelido',
    descritivo: 'Bicicleta elétrica',
    alt: 'Bicicleta elétrica Voe Calebito preta e branca com cesta, recorte sem fundo',
    specs: {
      ...VOE_AUTO,
      potencia: { valor: 500, unidade: 'W' },
      autonomia: { valor: 45, unidade: 'km' },
      bateria: 'Fosfato de ferro-lítio 48V 15Ah',
      freios: 'Hidráulico a disco dianteiro · tambor traseiro',
      ocupantes: 'Até 130 kg',
    },
    equipamentos: [...VOE_EQUIP_BASE, 'Travamento de roda traseira', 'Cesta frontal'],
    cores: cores('branco', 'preto', 'cinza'),
  }),
  voe('dot', 'Dot', {
    categoria: 'autopropelido',
    classificacao: 'autopropelido',
    alt: 'Scooter elétrica Voe Dot cinza com baú, recorte sem fundo',
    specs: {
      ...VOE_AUTO,
      potencia: { valor: 1000, unidade: 'W' },
      autonomia: { valor: 45, unidade: 'km' },
      bateria: 'Lítio 60V 20Ah',
      freios: 'Hidráulico a disco dianteiro · tambor traseiro',
      ocupantes: 'Até 150 kg',
    },
    equipamentos: [...VOE_EQUIP_BASE, 'Travamento de roda traseira', 'Retrovisores'],
    cores: cores('branco', 'preto', 'cinza'),
  }),
  voe('fantom', 'Fantom', {
    categoria: 'autopropelido',
    classificacao: 'autopropelido',
    alt: 'Scooter elétrica Voe Fantom branca com baú, recorte sem fundo',
    specs: {
      ...VOE_AUTO,
      potencia: { valor: 1000, unidade: 'W' },
      autonomia: { valor: 45, unidade: 'km' },
      bateria: 'Lítio 60V 20Ah',
      freios: 'Hidráulico a disco dianteiro · tambor traseiro',
      ocupantes: 'Até 150 kg',
    },
    equipamentos: [...VOE_EQUIP_BASE, 'Travamento de roda traseira', 'Retrovisores'],
    cores: cores('branco', 'preto', 'cinza'),
  }),
  voe('lux', 'Lux', {
    categoria: 'autopropelido',
    classificacao: 'autopropelido',
    alt: 'Scooter elétrica Voe Lux preta e vermelha com baú, recorte sem fundo',
    specs: {
      ...VOE_AUTO,
      potencia: { valor: 1000, unidade: 'W' },
      autonomia: { valor: 65, unidade: 'km' },
      bateria: 'Lítio 60V 20Ah, removível com alça',
      recarga: '5 h',
      freios: 'Hidráulico a disco dianteiro e traseiro',
      protecao: 'IP67',
      ocupantes: 'Até 150 kg',
    },
    equipamentos: [
      ...VOE_EQUIP_BASE, 'Marcha ré', 'Modo parking', 'Banco com espaço para garupa',
      'Baú', 'Chaves reserva', 'Roda dianteira de liga aro 10',
    ],
    cores: null, // catálogo escreve "VEREFICAR CORES"
  }),
  voe('raptor', 'Raptor', {
    categoria: 'autopropelido',
    classificacao: 'autopropelido',
    alt: 'Scooter elétrica Voe Raptor vermelha com baú, recorte sem fundo',
    specs: {
      ...VOE_AUTO,
      potencia: { valor: 1000, unidade: 'W' },
      autonomia: { valor: 70, unidade: 'km' },
      bateria: 'Lítio ferro fosfato 60V 25Ah, removível com alça',
      recarga: '5 h',
      freios: 'Hidráulico a disco dianteiro e traseiro',
      ocupantes: 'Até 180 kg',
    },
    equipamentos: [
      ...VOE_EQUIP_BASE, 'Marcha ré', 'Modo parking', 'Banco com espaço para garupa',
      'Baú', 'Botão de alerta', 'Chaves reserva', 'Bloqueio na roda traseira',
      'Roda dianteira de liga aro 12',
    ],
    cores: cores('vermelho', 'branco', 'preto', 'cinza'),
  }),
  voe('sol', 'Sol', {
    categoria: 'autopropelido',
    classificacao: 'autopropelido',
    descritivo: 'Bicicleta elétrica',
    alt: 'Bicicleta elétrica Voe Sol preta com cesta e baú, recorte sem fundo',
    specs: {
      ...VOE_AUTO,
      potencia: { valor: 1000, unidade: 'W' },
      autonomia: { valor: 45, unidade: 'km' },
      bateria: 'Lítio 60V 20Ah',
      freios: 'Hidráulico a disco dianteiro · tambor traseiro',
      ocupantes: 'Até 150 kg',
    },
    equipamentos: [...VOE_EQUIP_BASE, 'Baú de 27 litros', 'Retrovisores', 'Cesta frontal'],
    cores: cores('branco', 'preto', 'cinza'),
  }),
  voe('susan', 'Susan', {
    categoria: 'autopropelido',
    classificacao: 'autopropelido',
    alt: 'Scooter elétrica Voe Susan bordô e creme, desenho retrô, recorte sem fundo',
    specs: {
      ...VOE_AUTO,
      potencia: { valor: 1000, unidade: 'W' },
      autonomia: { valor: 65, unidade: 'km' },
      bateria: 'Fosfato de ferro-lítio 60V 20Ah',
      freios: 'Hidráulico a disco dianteiro · tambor traseiro',
      ocupantes: 'Até 180 kg',
    },
    equipamentos: [...VOE_EQUIP_BASE, 'Baú', 'Retrovisores'],
    cores: null, // catálogo escreve "VEREFICAR CORES"
  }),
  voe('titan', 'Titan', {
    categoria: 'autopropelido',
    classificacao: 'autopropelido',
    alt: 'Scooter elétrica Voe Titan branca e preta com baú, recorte sem fundo',
    specs: {
      ...VOE_AUTO,
      potencia: { valor: 1000, unidade: 'W' },
      autonomia: { valor: 65, unidade: 'km' },
      bateria: 'Lítio ferro fosfato 60V 30Ah, removível com alça',
      recarga: '5 h',
      freios: 'Hidráulico a disco dianteiro e traseiro',
      ocupantes: 'Até 180 kg',
    },
    equipamentos: [
      ...VOE_EQUIP_BASE, 'Marcha ré', 'Modo parking', 'Banco com espaço para garupa',
      'Baú de 27 litros', 'Chaves reserva', 'Roda dianteira de liga aro 12',
    ],
    cores: cores('vermelho', 'branco', 'preto', 'cinza'),
  }),
  voe('x-infinity', 'X-Infinity', {
    categoria: 'autopropelido',
    classificacao: 'autopropelido',
    alt: 'Scooter elétrica Voe X-Infinity preta de pneus largos, recorte sem fundo',
    specs: {
      ...VOE_AUTO,
      potencia: { valor: 1000, unidade: 'W' },
      autonomia: { valor: 65, unidade: 'km' },
      bateria: 'Lítio ferro fosfato 60V 25Ah, removível',
      recarga: '5 h',
      freios: 'Hidráulico a disco dianteiro e traseiro',
      ocupantes: 'Até 150 kg',
    },
    equipamentos: [
      ...VOE_EQUIP_BASE, 'Marcha ré', 'Modo parking', 'Banco com espaço para garupa',
      'Botão de alerta', 'Bloqueio na roda traseira', 'Roda dianteira de liga aro 10',
    ],
    cores: cores('branco', 'preto', 'cinza', 'vermelho', 'azul'),
  }),
  voe('x11-mini', 'X11 Mini', {
    categoria: 'autopropelido',
    classificacao: 'autopropelido',
    alt: 'Scooter elétrica Voe X11 Mini vermelha e preta de pneus largos, recorte sem fundo',
    specs: {
      ...VOE_AUTO,
      potencia: { valor: 1000, unidade: 'W' },
      autonomia: { valor: 50, unidade: 'km' },
      bateria: 'Lítio 60V 20Ah, removível',
      recarga: '6 h',
      ocupantes: 'Até 150 kg',
    },
    equipamentos: [
      'Carregador bivolt', 'Tecnologia NFC', 'Painel, faróis e setas em LED',
      'Quadro em aço de carbono', 'Bateria removível',
    ],
    cores: cores('branco', 'preto', 'cinza', 'vermelho', 'azul'),
  }),

  /* ── Voe · ciclomotores ────────────────────────────────────────────── */
  voe('x11', 'X11', {
    categoria: 'ciclomotor',
    classificacao: 'ciclomotor',
    descritivo: 'Ciclomotor elétrico',
    alt: 'Ciclomotor elétrico Voe X11 branco de pneus largos, recorte sem fundo',
    galeria: [
      { src: 'assets/img/models/voe-x11-1.webp', alt: 'Ciclomotor elétrico Voe X11 branco de pneus largos, recorte sem fundo' },
      { src: 'assets/img/models/voe-x11-2.webp', alt: 'Voe X11 preta e dourada, recorte sem fundo' },
      { src: 'assets/img/models/voe-x11-3.webp', alt: 'Voe X11 preta vista de frente, na rua', recorte: false },
      { src: 'assets/img/models/voe-x11-4.webp', alt: 'Chave na ignição da Voe X11', recorte: false },
      { src: 'assets/img/models/voe-x11-5.webp', alt: 'Banco e suspensão traseira da Voe X11', recorte: false },
    ],
    /* Ficha corrigida pelo cliente: o catálogo impresso listava duas versões de
       motor (2000 W e 3000 W) e 70 km/h. O modelo em loja é o de 2000 W, que na
       tabela do próprio fabricante vem com a bateria de 60V 20Ah. */
    specs: {
      classificacao: 'Ciclomotor · exige registro e habilitação',
      velocidade: { valor: 50, unidade: 'km/h' },
      potencia: { valor: 2000, unidade: 'W' },
      autonomia: { valor: 40, unidade: 'km' },
      bateria: 'Lítio 60V 20Ah',
      recarga: '6 h',
      protecao: 'IP65',
      ocupantes: 'Até 200 kg',
      fabricante: 'Voe',
    },
    equipamentos: [
      'Carregador bivolt', 'Tecnologia NFC', 'Alarme com bloqueio e trava',
      'Painel, faróis e setas em LED', 'Compartimento extra para bateria',
      'Roda de liga leve aro 10 ou 12', 'Buzina',
    ],
    /* Oito cores, cinco com foto propria. Branco, cinza e azul continuam na
       lista sem galeria: ao serem clicadas caem na galeria padrao do modelo,
       que e o comportamento de fotosDaCorAtiva no app.js.

       Preto e Grafite sao pinturas quase identicas na amostra (#383F47 contra
       #363C40); a diferenca visivel nas fotos e o banco, marrom num e preto no
       outro. Ficam separadas porque e assim que a loja vende, e o alt de cada
       uma diz qual banco, para a pessoa entender por que os dois swatches
       escuros existem. */
    cores: [
      COR.branco,
      { ...COR.preto, galeria: [
        { src: 'assets/img/models/voe-x11-cor-preto.webp', recorte: false,
          alt: 'Voe X11 preta de perfil, com banco marrom e apoio de costas' },
      ] },
      { ...COR.grafite, galeria: [
        { src: 'assets/img/models/voe-x11-cor-grafite.webp', recorte: false,
          alt: 'Voe X11 grafite de perfil, com banco preto e apoio de costas' },
      ] },
      COR.cinza,
      COR.azul,
      { ...COR.vermelho, galeria: [
        { src: 'assets/img/models/voe-x11-cor-vermelho.webp', recorte: false,
          alt: 'Voe X11 vermelha em tres quartos frontal, com para-lamas e chassi na cor' },
      ] },
      { ...COR.dourado, galeria: [
        { src: 'assets/img/models/voe-x11-cor-dourado.webp', recorte: false,
          alt: 'Voe X11 dourada em tres quartos frontal, com para-lamas em tom champanhe' },
      ] },
      { ...COR.reinounido, galeria: [
        { src: 'assets/img/models/voe-x11-cor-reinounido.webp', recorte: false,
          alt: 'Voe X11 azul marinho de perfil, com a bandeira do Reino Unido nos para-lamas' },
      ] },
    ],
  }),

  /* ── Voe · triciclo ────────────────────────────────────────────────── */
  voe('triciclo-x15', 'Triciclo X15', {
    // Forma de triciclo, enquadramento de ciclomotor: a etiqueta segue a lei,
    // o filtro segue o formato do veículo.
    categoria: 'triciclo',
    classificacao: 'ciclomotor',
    descritivo: 'Triciclo elétrico',
    alt: 'Triciclo elétrico Voe X15 branco e vermelho de três rodas largas, recorte sem fundo',
    galeria: [
      { src: 'assets/img/models/voe-triciclo-x15-1.webp', alt: 'Triciclo elétrico Voe X15 branco e vermelho de três rodas largas, recorte sem fundo' },
      { src: 'assets/img/models/voe-triciclo-x15-2.webp', alt: 'Guidão e farol do Voe X15 em detalhe', recorte: false },
      { src: 'assets/img/models/voe-triciclo-x15-3.webp', alt: 'Banco duplo e bagageiro traseiro do Voe X15', recorte: false },
      { src: 'assets/img/models/voe-triciclo-x15-4.webp', alt: 'Bagageiro em aço reforçado do Voe X15', recorte: false },
    ],
    specs: {
      classificacao: 'Ciclomotor · exige registro e habilitação',
      velocidade: { valor: 60, unidade: 'km/h' },
      potencia: { valor: 3000, unidade: 'W' },
      autonomia: { valor: 40, unidade: 'km' },
      bateria: 'Lítio 60V 25Ah, removível',
      recarga: '6 h',
      freios: 'A disco',
      suspensao: 'Amortecedor a gás',
      ocupantes: 'Até 180 kg',
      fabricante: 'Voe',
    },
    equipamentos: [
      'Carregador bivolt', 'Painel, faróis e setas em LED', '3 níveis de velocidade',
      'Alarme com bloqueio e trava', 'Botão start/stop', 'Banco duplo', 'Marcha ré',
      'Roda de liga leve aro 10', 'Compartimento de bateria extra',
      'Bagageiro em aço reforçado', 'Porta-objetos sob o assento',
    ],
    cores: cores('branco', 'preto', 'cinza', 'azul', 'vermelho', 'amarelo', 'prata'),
  }),

  /* ── Voe · bicicletas elétricas ────────────────────────────────────────
     PENDÊNCIA JURÍDICA: a Voe vende as duas como "bike elétrica", mas 1000 W e
     800 W ficam acima do limite de 350 W que equipara bicicleta elétrica a
     bicicleta comum. Pela potência elas caem na faixa de autopropelido.
     Enquanto o enquadramento não vier por escrito, `classificacao` fica null e
     o card NÃO exibe etiqueta: melhor sem etiqueta do que com a errada. */
  voe('eco', 'Eco', {
    categoria: 'ebike',
    classificacao: null,
    descritivo: 'Bicicleta elétrica',
    alt: 'Bicicleta elétrica Voe Eco preta de pneus largos, recorte sem fundo',
    specs: {
      velocidade: { valor: 32, unidade: 'km/h' },
      potencia: { valor: 1000, unidade: 'W' },
      autonomia: { valor: 60, unidade: 'km' },
      bateria: '1 ou 2 baterias de lítio 48V 15.6Ah, removível',
      recarga: '5 h',
      ocupantes: 'Até 150 kg',
      fabricante: 'Voe',
    },
    equipamentos: [
      'Carregador bivolt', 'Painel, faróis e setas em LED',
      'Display colorido com NFC', 'Banco com espaço para garupa',
      'Case e suporte para celular', 'Bateria removível',
    ],
    cores: cores('branco', 'preto'),
  }),
  voe('pop', 'Pop', {
    categoria: 'ebike',
    classificacao: null,
    descritivo: 'Bicicleta elétrica',
    alt: 'Bicicleta elétrica Voe Pop vermelha com cesta, recorte sem fundo',
    specs: {
      velocidade: { valor: 32, unidade: 'km/h' },
      potencia: { valor: 800, unidade: 'W' },
      autonomia: { valor: 40, unidade: 'km' },
      bateria: 'Lítio 48V 13Ah, removível',
      recarga: '6 h',
      ocupantes: 'Até 150 kg',
      fabricante: 'Voe',
    },
    equipamentos: [
      'Carregador bivolt', 'Painel, faróis e setas em LED',
      'Quadro em aço de carbono', 'Cesta embutida', 'Bateria removível',
    ],
    cores: cores('branco', 'preto', 'vermelho', 'azul'),
  }),

  /* ── Voe · patinetes e lazer ───────────────────────────────────────────
     Mesma regra das bicicletas: sem confirmação de enquadramento por escrito,
     nenhuma etiqueta legal é exibida. */
  voe('p8', 'P8', {
    categoria: 'patinete',
    classificacao: null,
    descritivo: 'Patinete elétrico',
    alt: 'Patinete elétrico Voe P8 cinza dobrável, recorte sem fundo',
    specs: {
      velocidade: { valor: 32, unidade: 'km/h' },
      potencia: { valor: 250, unidade: 'W' },
      bateria: 'Lítio 48V 10Ah',
      fabricante: 'Voe',
    },
    equipamentos: ['Carregador bivolt', 'Guidão regulável', 'Dobrável'],
    cores: cores('cinza'),
  }),
  voe('p10', 'P10', {
    categoria: 'patinete',
    classificacao: null,
    descritivo: 'Patinete elétrico',
    alt: 'Patinete elétrico Voe P10 preto com banco, recorte sem fundo',
    specs: {
      velocidade: { valor: 32, unidade: 'km/h' },
      potencia: { valor: 350, unidade: 'W' },
      bateria: 'Lítio 48V 10Ah',
      fabricante: 'Voe',
    },
    equipamentos: ['Carregador bivolt', 'Guidão regulável', 'Banco regulável', 'LED lateral'],
    cores: cores('preto'),
  }),
  voe('c5', 'C5', {
    categoria: 'patinete',
    classificacao: null,
    descritivo: 'Patinete elétrico',
    alt: 'Patinete elétrico Voe C5 preto com banco e bagageiro, recorte sem fundo',
    specs: {
      velocidade: { valor: 32, unidade: 'km/h' },
      potencia: { valor: 500, unidade: 'W' },
      autonomia: { valor: 20, unidade: 'km' },
      bateria: 'Lítio 48V 10.5Ah',
      freios: 'A disco',
      suspensao: 'Dianteira e traseira',
      ocupantes: 'Até 85 kg',
      fabricante: 'Voe',
    },
    equipamentos: [
      'Carregador bivolt', 'Banco e guidão dobráveis', 'Bagageiro traseiro',
      'Bolsa para pertences', 'Setas', 'Painel digital',
      'Farol de LED e iluminação completa', 'Chave reserva', 'Buzina',
    ],
    cores: cores('preto'),
  }),
  voe('drift', 'Drift', {
    categoria: 'patinete',
    classificacao: null,
    descritivo: 'Drift elétrico',
    alt: 'Drift elétrico Voe azul com estampa de galáxia, recorte sem fundo',
    galeria: [
      { src: 'assets/img/models/voe-drift-1.webp', alt: 'Drift elétrico Voe azul com estampa de galáxia, recorte sem fundo' },
      { src: 'assets/img/models/voe-drift-2.webp', alt: 'As duas estampas do Drift elétrico Voe lado a lado' },
    ],
    specs: {
      velocidade: { valor: 15, unidade: 'km/h' },
      potencia: { valor: 250, unidade: 'W' },
      bateria: 'Lítio 48V 10Ah',
      fabricante: 'Voe',
    },
    equipamentos: ['Carregador bivolt', 'Espaçamento do banco regulável', 'LED lateral'],
    cores: null, // catálogo escreve "VER DISPONIBILIDADE"
  }),
];

/* ── Fotos por cor ─────────────────────────────────────────────────────────
   Quando chegarem as fotos coloridas, basta dar galeria própria ao swatch:

   cores: [
     {
       nome: 'Vermelho',
       hex: '#E61C21',
       galeria: [{ src: 'assets/img/models/voe-raptor-vermelho-1.webp', alt: '...' }],
     },
   ]

   O modal troca a galeria inteira ao clicar no swatch. Cor sem `galeria`
   continua mostrando as fotos padrão do modelo, sem quebrar nada.
   ────────────────────────────────────────────────────────────────────────── */

window.URBANA_FAQ = [
  {
    q: 'Preciso de CNH para os modelos da Urbana?',
    a: 'Depende da classificação. Modelos enquadrados como autopropelidos, até 32 km/h e 1000 W de fábrica, não exigem CNH, registro ou emplacamento. Ciclomotores e motos elétricas exigem ACC ou CNH categoria A, além de placa e licenciamento. Na loja a gente confere o enquadramento do modelo antes de você fechar.',
  },
  {
    q: 'Quanto custa carregar por mês?',
    a: 'Uma recarga completa de um autopropelido fica entre R$ 0,80 e R$ 2,00, dependendo da tarifa da sua região. Na loja fazemos a conta com a sua rota real antes da compra.',
  },
  {
    q: 'A bateria é removível?',
    a: 'Em boa parte dos modelos, sim, o que permite carregar em apartamento ou no trabalho. A ficha técnica de cada modelo informa se a bateria é removível ou fixa.',
  },
  {
    q: 'Vocês têm assistência técnica própria?',
    a: 'Sim. A manutenção e as peças das marcas que trabalhamos passam pela nossa oficina, com equipe treinada e prazo de retorno informado na abertura do atendimento.',
  },
  {
    q: 'Dá para andar com garupa?',
    a: 'Depende do modelo e da classificação. Autopropelidos são de uso individual. Ciclomotores e motos elétricas homologados para dois ocupantes trazem essa informação na ficha técnica, e é um dos campos que conferimos junto com você.',
  },
  {
    q: 'Posso fazer um test ride antes de decidir?',
    a: 'Pode, e recomendamos. O agendamento reserva horário com um consultor, que explica o enquadramento legal do modelo e faz a simulação de custo por km da sua rota. É o jeito mais rápido de descobrir se você precisa de placa ou não.',
  },
  {
    q: 'Como funciona o pagamento?',
    a: 'Trabalhamos com cartão, PIX e as condições de parcelamento vigentes no mês. Como as condições mudam, elas são passadas pelo WhatsApp ou na loja, sempre por escrito antes de qualquer pagamento.',
  },
  {
    q: 'A moto elétrica pega chuva?',
    a: 'Os modelos têm índice de proteção à água informado na ficha técnica (IP65, IP67 e afins). Esse índice cobre uso normal na chuva. Nenhum deles é feito para submersão ou lavagem com jato de alta pressão.',
  },
];

window.URBANA_DEPOIMENTOS = [
  /* PENDENTE: depoimentos reais de clientes, com nome, modelo comprado e
     categoria. Regra do styleguide: nome real, sem emoji, sem foto de banco
     de imagens, no máximo 4 linhas. Enquanto a lista estiver vazia, o bloco
     inteiro não é renderizado. Melhor sem prova social do que com prova
     social inventada. */
];
