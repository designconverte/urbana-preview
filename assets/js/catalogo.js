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
     alarme antes de publicar.
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
    nota: 'Ciclomotores: mais desempenho, exigem ACC ou CNH categoria A, registro e emplacamento.',
  },
  {
    id: 'ebike',
    nome: 'E-bikes',
    nota: 'Até 32 km/h e 1000 W de fábrica. Sem CNH, sem emplacamento, sem IPVA. O argumento vem antes do modelo.',
  },
  {
    id: 'triciclo',
    nome: 'Triciclos',
    nota: 'Maior estabilidade, pode ser autopropelido ou ciclomotor, consulte nossos modelos.',
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

  /* Pintura de DOIS tons: chassi escuro e para-lamas dourados. O swatch usa
     `bicolor`, com divisao dura a 50%, porque e assim que a lataria sai da
     fabrica; degrade suave mentiria sobre o produto. Os dois hex foram
     amostrados na propria foto, cada um na regiao dele. */
  pretodourado: { nome: 'Preto e dourado', bicolor: ['#24272A', '#A3947F'] },

  /* Cor de arte, nao de pintura chapada: o swatch e a bandeira. O `hex` fica
     como reserva, para o caso do SVG nao carregar. */
  reinounido: {
    nome: 'Reino Unido',
    hex: '#1B3053',
    imagem: 'assets/img/swatches/reino-unido.svg',
  },

  /* Entraram com as fotos novas da Lux, com hex amostrado na propria foto:
     o bege na lataria, e o preto e o vermelho cada um na sua regiao. */
  bege: { nome: 'Bege', hex: '#D5CBAF' },
  pretovermelho: { nome: 'Preto e vermelho', bicolor: ['#171A1A', '#C72422'] },

  /* Susan, amostrados nas fotos. O vinho vem da lataria ILUMINADA: na sombra
     ele cai para quase preto e a bolinha se confundiria com a do preto. O bege
     dos dois tons e o bege puro sao a mesma pintura, com o mesmo hex. */
  vinhobege: { nome: 'Vinho e bege', bicolor: ['#58222C', '#DBD6C7'] },
  pretobege: { nome: 'Preto e bege', bicolor: ['#101011', '#DBD6C7'] },

  /* Pintura com trama de fibra de carbono (X-Infinity). A bolinha é um
     recorte da trama tirado da própria foto: em hex chapado ela seria um
     cinza escuro quase igual à bolinha do preto ao lado. */
  carbono: { nome: 'Carbono', hex: '#3A3A3A', imagem: 'assets/img/swatches/carbono.webp' },
};

const cores = (...chaves) => chaves.map((k) => COR[k]);

// A Evon imprime os próprios swatches, com hex um pouco diferente da Voe.
const CORES_EVON = [
  { nome: 'Branco', hex: '#FFFFFF' },
  { nome: 'Prata', hex: '#BEC5CA' },
  { nome: 'Preto', hex: '#100E0D' },
  { nome: 'Vermelho', hex: '#EC1B24' },
];

/* Linha Evon com foto por cor, nas cinco cores. Cada cor abre numa foto de
   estúdio do mesmo ângulo, então trocar de cor não muda o enquadramento.
   A cor das fotos antigas (recortes) vem primeiro e leva junto as vistas
   que só existem nela; o recorte do mesmo ângulo da foto de estúdio fica de
   fora. O card segue com o recorte, que é dessa mesma cor.
   Os cinzas saíram da foto de cada pintura. Só a ficha do Bravus dá nome ao
   dele (Zenith); nas outras duas fica "Cinza". */
const evon = (nome) => CORES_EVON.find((c) => c.nome === nome);

// Bravus: as fotos antigas são da branca.
const CORES_BRAVUS = [
  { ...evon('Branco'), galeria: [
    { src: 'assets/img/models/evon-bravus-cor-branco.webp', alt: 'Evon Bravus branca em três quartos frontal, com encosto do garupa', recorte: false, inteira: true, fundo: '#FCFCFC' },
    { src: 'assets/img/models/bravus-2.webp', alt: 'Evon Bravus branca de perfil' },
    { src: 'assets/img/models/bravus-3.webp', alt: 'Evon Bravus branca em três quartos traseiro, com baú' },
    { src: 'assets/img/models/bravus-4.webp', alt: 'Evon Bravus branca vista de frente' },
  ] },
  { ...evon('Prata'), galeria: [
    { src: 'assets/img/models/evon-bravus-cor-prata.webp', alt: 'Evon Bravus prata em três quartos frontal, com encosto do garupa', recorte: false, inteira: true, fundo: '#FBFBFB' },
  ] },
  { ...evon('Preto'), galeria: [
    { src: 'assets/img/models/evon-bravus-cor-preto.webp', alt: 'Evon Bravus preta em três quartos frontal, com encosto do garupa', recorte: false, inteira: true, fundo: '#FBFCFC' },
  ] },
  { ...evon('Vermelho'), galeria: [
    { src: 'assets/img/models/evon-bravus-cor-vermelho.webp', alt: 'Evon Bravus vermelha em três quartos frontal, com encosto do garupa', recorte: false, inteira: true, fundo: '#F7F9F9' },
  ] },
  { nome: 'Cinza Zenith', hex: '#5C5F66', galeria: [
    { src: 'assets/img/models/evon-bravus-cor-cinza.webp', alt: 'Evon Bravus cinza Zenith em três quartos frontal, com encosto do garupa', recorte: false, inteira: true, fundo: '#FEFEFE' },
  ] },
];

/* Nimbus: as fotos antigas são da cinza. Os arquivos vieram com cinza e
   prata TROCADOS: o "cinza" é prata clara metálica e o "prata" é cinza
   escuro com filete dourado. Aqui vale a pintura, como na Bravus e na Pulse. */
const CORES_NIMBUS = [
  { nome: 'Cinza', hex: '#6A6B6D', galeria: [
    { src: 'assets/img/models/evon-nimbus-cor-cinza.webp', alt: 'Evon Nimbus cinza escura com filetes dourados, em três quartos frontal', recorte: false, inteira: true },
    { src: 'assets/img/models/nimbus-2.webp', alt: 'Evon Nimbus cinza em três quartos traseiro, com baú' },
    { src: 'assets/img/models/nimbus-3.webp', alt: 'Evon Nimbus cinza vista de frente' },
  ] },
  { ...evon('Branco'), galeria: [
    { src: 'assets/img/models/evon-nimbus-cor-branco.webp', alt: 'Evon Nimbus branca em três quartos frontal, com encosto do garupa', recorte: false, inteira: true },
  ] },
  { ...evon('Prata'), galeria: [
    { src: 'assets/img/models/evon-nimbus-cor-prata.webp', alt: 'Evon Nimbus prata em três quartos frontal, com encosto do garupa', recorte: false, inteira: true },
  ] },
  { ...evon('Preto'), galeria: [
    { src: 'assets/img/models/evon-nimbus-cor-preto.webp', alt: 'Evon Nimbus preta em três quartos frontal, com encosto do garupa', recorte: false, inteira: true },
  ] },
  { ...evon('Vermelho'), galeria: [
    { src: 'assets/img/models/evon-nimbus-cor-vermelho.webp', alt: 'Evon Nimbus vermelha em três quartos frontal, com encosto do garupa', recorte: false, inteira: true },
  ] },
];

// Pulse: as fotos antigas são da prata.
const CORES_PULSE = [
  { ...evon('Prata'), galeria: [
    { src: 'assets/img/models/evon-pulse-cor-prata.webp', alt: 'Evon Pulse prata em três quartos frontal, com encosto do garupa', recorte: false, inteira: true },
    { src: 'assets/img/models/pulse-2.webp', alt: 'Evon Pulse prata em três quartos frontal direito' },
    { src: 'assets/img/models/pulse-3.webp', alt: 'Evon Pulse prata em três quartos traseiro' },
    { src: 'assets/img/models/pulse-4.webp', alt: 'Evon Pulse prata vista de frente' },
  ] },
  { ...evon('Branco'), galeria: [
    { src: 'assets/img/models/evon-pulse-cor-branco.webp', alt: 'Evon Pulse branca vista de frente, com encosto do garupa', recorte: false, inteira: true },
  ] },
  { ...evon('Preto'), galeria: [
    { src: 'assets/img/models/evon-pulse-cor-preto.webp', alt: 'Evon Pulse preta em três quartos frontal, com encosto do garupa', recorte: false, inteira: true, fundo: '#FDFDFD' },
  ] },
  { ...evon('Vermelho'), galeria: [
    { src: 'assets/img/models/evon-pulse-cor-vermelho.webp', alt: 'Evon Pulse vermelha em três quartos frontal, com encosto do garupa', recorte: false, inteira: true, fundo: '#FEFEFE' },
  ] },
  { nome: 'Cinza', hex: '#62676A', galeria: [
    { src: 'assets/img/models/evon-pulse-cor-cinza.webp', alt: 'Evon Pulse cinza escura com filetes dourados, em três quartos frontal', recorte: false, inteira: true },
  ] },
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
    /* `foto` própria quando a principal vem das fotos por cor: o card usa o
       mesmo arquivo da galeria, e o modal abre com a imagem já em cache. */
    foto: dados.foto || `assets/img/models/voe-${slug}-card.webp`,
    recorte: true,
    alt: dados.alt,
    // Um slide só por padrão (o catálogo traz uma foto). Modelos com material
    // extra do cliente passam `galeria` própria e sobrescrevem isso.
    galeria: dados.galeria || [{ src: dados.foto || `assets/img/models/voe-${slug}-1.webp`, alt: dados.alt }],
    specs: dados.specs,
    equipamentos: dados.equipamentos,
    cores: dados.cores || null,
    preco: null,
  };
}

/* Ordem da vitrine, definida pela loja: os campeões de venda primeiro.
   É uma lista de PRIORIDADE, não a lista completa. Quem não estiver aqui
   aparece depois, na ordem em que está no catálogo, então esquecer um modelo
   novo nesta lista não o some do site: só não o promove.

   Mexer aqui é a forma certa de reordenar a vitrine. Reordenar os blocos de
   modelo abaixo funcionaria igual, mas transforma qualquer troca de posição
   num diff de centenas de linhas. */
window.URBANA_ORDEM = [
  'voe-raptor', 'voe-titan', 'voe-x11-mini', 'voe-eco',
  'voe-susan', 'evon-bravus', 'evon-nimbus', 'evon-pulse',
  'voe-dot', 'voe-lux', 'voe-fantom', 'voe-calebito',
  'voe-x-infinity', 'voe-x11',
];

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
      // 55 km confirmado pela loja; substitui a autonomia media da ficha.
      return {
        ...base,
        autonomia: { valor: 55, unidade: 'km' },
        recarga: '4 h',
      };
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
      { src: 'assets/img/models/nimbus-4.webp', alt: 'Lanterna traseira em LED da Evon Nimbus', recorte: false, detalhe: true },
    ],
    specs: { ...EVON_COMUM, autonomia: { valor: 50, unidade: 'km' }, bateria: 'Lítio 72V 20Ah' },
    equipamentos: EVON_EQUIPAMENTOS,
    cores: CORES_NIMBUS,
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
    specs: { ...EVON_COMUM, autonomia: { valor: 45, unidade: 'km' }, bateria: 'Lítio 60V 20Ah' },
    equipamentos: EVON_EQUIPAMENTOS,
    cores: CORES_PULSE,
    preco: null,
  },

  /* ── Voe · autopropelidos ──────────────────────────────────────────── */
  voe('calebito', 'Calebito', {
    categoria: 'autopropelido',
    classificacao: 'autopropelido',
    descritivo: 'Bicicleta elétrica',
    foto: 'assets/img/models/voe-calebito-capa.webp',
    alt: 'Bicicleta elétrica Voe Calebito branca e preta com cesta, recorte sem fundo',
    specs: {
      ...VOE_AUTO,
      potencia: { valor: 500, unidade: 'W' },
      autonomia: { valor: 45, unidade: 'km' },
      bateria: 'Fosfato de ferro-lítio 48V 15Ah',
      freios: 'Hidráulico a disco dianteiro · tambor traseiro',
      ocupantes: 'Até 130 kg',
    },
    equipamentos: [...VOE_EQUIP_BASE, 'Travamento de roda traseira', 'Cesta frontal'],
    /* Capa: a foto branca com o fundo removido (BiRefNet, via rembg; original
       em MIDIAS/recortes/). Branco primeiro para o modal abrir nessa mesma foto.
       A loja mandou foto só de branca e preta; o cinza do catálogo antigo saiu,
       porque sem foto própria o swatch cinza mostraria a moto branca. */
    cores: [
      { ...COR.branco, galeria: [
        { src: 'assets/img/models/voe-calebito-cor-branco.webp', alt: 'Voe Calebito branca e preta com cesta frontal, de perfil', recorte: false, inteira: true, fundo: '#FCFCFC' },
      ] },
      { ...COR.preto, galeria: [
        { src: 'assets/img/models/voe-calebito-cor-preto.webp', alt: 'Voe Calebito preta com cesta frontal, de perfil', recorte: false, inteira: true, fundo: '#FDFDFD' },
      ] },
    ],
  }),
  voe('dot', 'Dot', {
    categoria: 'autopropelido',
    classificacao: 'autopropelido',
    foto: 'assets/img/models/voe-dot-capa.webp',
    alt: 'Scooter elétrica Voe Dot preta com faixa laranja, recorte sem fundo',
    specs: {
      ...VOE_AUTO,
      potencia: { valor: 1000, unidade: 'W' },
      autonomia: { valor: 45, unidade: 'km' },
      bateria: 'Lítio 60V 20Ah',
      freios: 'Hidráulico a disco dianteiro · tambor traseiro',
      ocupantes: 'Até 150 kg',
    },
    equipamentos: [...VOE_EQUIP_BASE, 'Travamento de roda traseira', 'Retrovisores'],
    /* Cores confirmadas pela loja: preta, branca e prata. A capa é a foto
       preta com o fundo removido (BiRefNet, via rembg; original do recorte em
       MIDIAS/recortes/): é a que mais vende, segundo a loja. A preta vem
       primeiro para o modal abrir nessa mesma foto. O "cinza" do catálogo
       antigo era a prata azulada. O COR.prata da paleta puxa para o rosado
       (#A7A1A6); o hex aqui saiu da lataria. */
    cores: [
      { ...COR.preto, galeria: [
        { src: 'assets/img/models/voe-dot-cor-preto.webp', alt: 'Voe Dot preta com faixa laranja, em três quartos frontal', recorte: false, inteira: true, fundo: '#FBFBFB' },
      ] },
      { ...COR.prata, hex: '#CFD0D4', galeria: [
        { src: 'assets/img/models/voe-dot-cor-prata.webp', alt: 'Voe Dot prata com faixa laranja, em três quartos frontal', recorte: false, inteira: true, fundo: '#F9FAFA' },
      ] },
      { ...COR.branco, galeria: [
        { src: 'assets/img/models/voe-dot-cor-branco.webp', alt: 'Voe Dot branca com faixa laranja, em três quartos frontal', recorte: false, inteira: true, fundo: '#F8F9F9' },
      ] },
    ],
  }),
  voe('fantom', 'Fantom', {
    categoria: 'autopropelido',
    classificacao: 'autopropelido',
    foto: 'assets/img/models/voe-fantom-capa.webp',
    alt: 'Scooter elétrica Voe Fantom branca e preta com baú, recorte sem fundo',
    specs: {
      ...VOE_AUTO,
      potencia: { valor: 1000, unidade: 'W' },
      autonomia: { valor: 45, unidade: 'km' },
      bateria: 'Lítio 60V 20Ah',
      freios: 'Hidráulico a disco dianteiro · tambor traseiro',
      ocupantes: 'Até 150 kg',
    },
    equipamentos: [...VOE_EQUIP_BASE, 'Travamento de roda traseira', 'Retrovisores'],
    /* Capa: a foto branca com o fundo removido (BiRefNet, via rembg; original
       em MIDIAS/recortes/). Branco primeiro para o modal abrir nessa mesma
       foto. O cinza saiu da lataria: o COR.cinza (#575757) é bem mais escuro. */
    cores: [
      { ...COR.branco, galeria: [
        { src: 'assets/img/models/voe-fantom-cor-branco.webp', alt: 'Voe Fantom branca e preta com baú, de perfil em três quartos', recorte: false, inteira: true, fundo: '#FEFEFE' },
      ] },
      { ...COR.cinza, hex: '#919BA3', galeria: [
        { src: 'assets/img/models/voe-fantom-cor-cinza.webp', alt: 'Voe Fantom cinza e preta com baú, de perfil em três quartos', recorte: false, inteira: true, fundo: '#FEFEFE' },
      ] },
      { ...COR.preto, galeria: [
        { src: 'assets/img/models/voe-fantom-cor-preto.webp', alt: 'Voe Fantom preta com baú, de perfil em três quartos', recorte: false, inteira: true, fundo: '#FEFEFE' },
      ] },
    ],
  }),
  voe('lux', 'Lux', {
    categoria: 'autopropelido',
    classificacao: 'autopropelido',
    foto: 'assets/img/models/voe-lux-cor-pretovermelho.webp',
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
    // Cores confirmadas pela loja. Preto e vermelho primeiro: é a foto principal.
    cores: [
      { ...COR.pretovermelho, galeria: [
        { src: 'assets/img/models/voe-lux-cor-pretovermelho.webp', alt: 'Voe Lux preta com detalhes vermelhos e baú, de perfil' },
      ] },
      { ...COR.branco, galeria: [
        { src: 'assets/img/models/voe-lux-cor-branco.webp', alt: 'Voe Lux branca com base preta e baú, de perfil' },
      ] },
      { ...COR.bege, galeria: [
        { src: 'assets/img/models/voe-lux-cor-bege.webp', alt: 'Voe Lux bege com base preta e baú, de perfil' },
      ] },
      { ...COR.preto, galeria: [
        { src: 'assets/img/models/voe-lux-cor-preto.webp', alt: 'Voe Lux preta com baú, de perfil' },
      ] },
    ],
  }),
  voe('raptor', 'Raptor', {
    categoria: 'autopropelido',
    classificacao: 'autopropelido',
    foto: 'assets/img/models/voe-raptor-cor-branco.webp',
    alt: 'Scooter elétrica Voe Raptor branca com baú, recorte sem fundo',
    specs: {
      ...VOE_AUTO,
      potencia: { valor: 1000, unidade: 'W' },
      autonomia: { valor: 60, unidade: 'km' },
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
    /* A primeira cor é a da foto principal: o modal abre nela, e card e modal
       precisam mostrar a mesma moto. */
    cores: [
      { ...COR.branco, galeria: [
        { src: 'assets/img/models/voe-raptor-cor-branco.webp', alt: 'Voe Raptor branca com grafismo preto e baú, em três quartos frontal' },
      ] },
      { ...COR.vermelho, galeria: [
        { src: 'assets/img/models/voe-raptor-cor-vermelho.webp', alt: 'Voe Raptor vermelha com baú, em três quartos frontal' },
      ] },
      { ...COR.preto, galeria: [
        { src: 'assets/img/models/voe-raptor-cor-preto.webp', alt: 'Voe Raptor preta com grafismo branco e baú, em três quartos frontal' },
      ] },
      // COR.cinza é escuro (#575757); esta lataria é prata azulada, amostrada na foto.
      { ...COR.cinza, hex: '#B1B4BD', galeria: [
        { src: 'assets/img/models/voe-raptor-cor-cinza.webp', alt: 'Voe Raptor cinza clara com grafismo branco e baú, em três quartos frontal' },
      ] },
    ],
  }),
  voe('sol', 'Sol', {
    categoria: 'autopropelido',
    classificacao: 'autopropelido',
    descritivo: 'Bicicleta elétrica',
    foto: 'assets/img/models/voe-sol-capa.webp',
    alt: 'Bicicleta elétrica Voe Sol preta com cesta frontal e baú, recorte sem fundo',
    specs: {
      ...VOE_AUTO,
      potencia: { valor: 1000, unidade: 'W' },
      autonomia: { valor: 45, unidade: 'km' },
      bateria: 'Lítio 60V 20Ah',
      freios: 'Hidráulico a disco dianteiro · tambor traseiro',
      ocupantes: 'Até 150 kg',
    },
    equipamentos: [...VOE_EQUIP_BASE, 'Baú de 27 litros', 'Retrovisores', 'Cesta frontal'],
    /* Cores confirmadas pela loja: preta, branca e prata (o "cinza" do
       catálogo antigo). A capa é a foto preta com o fundo removido (BiRefNet,
       via rembg; original em MIDIAS/recortes/), e a preta vem primeiro para o
       modal abrir nessa mesma foto. A prata usa o tom da lataria: o COR.prata
       da paleta puxa para o rosado. */
    cores: [
      { ...COR.preto, galeria: [
        { src: 'assets/img/models/voe-sol-cor-preto.webp', alt: 'Voe Sol preta com cesta frontal e baú, em três quartos frontal', recorte: false, inteira: true, fundo: '#FAFAFC' },
      ] },
      { ...COR.branco, galeria: [
        { src: 'assets/img/models/voe-sol-cor-branco.webp', alt: 'Voe Sol branca com cesta frontal e baú, em três quartos frontal', recorte: false, inteira: true, fundo: '#FDFDFD' },
      ] },
      { ...COR.prata, hex: '#CDCED0', galeria: [
        { src: 'assets/img/models/voe-sol-cor-prata.webp', alt: 'Voe Sol prata com cesta frontal e baú, em três quartos frontal', recorte: false, inteira: true, fundo: '#FEFEFE' },
      ] },
    ],
  }),
  voe('susan', 'Susan', {
    categoria: 'autopropelido',
    classificacao: 'autopropelido',
    foto: 'assets/img/models/voe-susan-capa.webp',
    alt: 'Scooter elétrica Voe Susan vinho e bege, desenho retrô, com baú, recorte sem fundo',
    specs: {
      ...VOE_AUTO,
      potencia: { valor: 1000, unidade: 'W' },
      autonomia: { valor: 65, unidade: 'km' },
      bateria: 'Fosfato de ferro-lítio 60V 20Ah',
      freios: 'Hidráulico a disco dianteiro · tambor traseiro',
      ocupantes: 'Até 180 kg',
    },
    equipamentos: [...VOE_EQUIP_BASE, 'Baú', 'Retrovisores'],
    /* Cores confirmadas pela loja. As fotos são de estúdio, com fundo cinza:
       no modal cabem inteiras, e a área vazia leva o cinza da própria foto.
       A capa é a MESMA foto vinho e bege, com o fundo removido (BiRefNet, via
       rembg; original do recorte em MIDIAS/recortes/). Com fundo, ela viraria
       um retângulo cinza numa vitrine de recortes. Vinho e bege vem primeiro
       para o modal abrir na foto da capa. */
    cores: [
      { ...COR.vinhobege, galeria: [
        { src: 'assets/img/models/voe-susan-cor-vinhobege.webp', alt: 'Voe Susan vinho e bege, retrô, com baú vinho, em três quartos frontal', recorte: false, inteira: true, fundo: '#E5E7EA' },
      ] },
      { ...COR.pretobege, galeria: [
        { src: 'assets/img/models/voe-susan-cor-pretobege.webp', alt: 'Voe Susan preta e bege, retrô, com baú preto, em três quartos frontal', recorte: false, inteira: true, fundo: '#E0E2E3' },
      ] },
      { ...COR.bege, hex: '#DBD6C7', galeria: [
        { src: 'assets/img/models/voe-susan-cor-bege.webp', alt: 'Voe Susan toda bege, retrô, com baú preto e bege, em três quartos frontal', recorte: false, inteira: true, fundo: '#DDDDDD' },
      ] },
    ],
  }),
  voe('titan', 'Titan', {
    categoria: 'autopropelido',
    classificacao: 'autopropelido',
    foto: 'assets/img/models/voe-titan-cor-branco.webp',
    alt: 'Scooter elétrica Voe Titan branca com farol duplo e baú, recorte sem fundo',
    specs: {
      ...VOE_AUTO,
      potencia: { valor: 1000, unidade: 'W' },
      autonomia: { valor: 70, unidade: 'km' },
      bateria: 'Lítio ferro fosfato 60V 30Ah, removível com alça',
      recarga: '5 h',
      freios: 'Hidráulico a disco dianteiro e traseiro',
      ocupantes: 'Até 180 kg',
    },
    equipamentos: [
      ...VOE_EQUIP_BASE, 'Marcha ré', 'Modo parking', 'Banco com espaço para garupa',
      'Baú de 27 litros', 'Chaves reserva', 'Roda dianteira de liga aro 12',
    ],
    // Sem vermelha: a loja não trabalha com essa cor da Titan.
    cores: [
      { ...COR.branco, galeria: [
        { src: 'assets/img/models/voe-titan-cor-branco.webp', alt: 'Voe Titan branca com farol duplo e baú, em três quartos frontal' },
      ] },
      // COR.cinza é escuro (#575757); esta lataria é cinza clara, amostrada na foto.
      { ...COR.cinza, hex: '#9A9FA6', galeria: [
        { src: 'assets/img/models/voe-titan-cor-cinza.webp', alt: 'Voe Titan cinza com farol duplo e baú, em três quartos frontal' },
      ] },
      { ...COR.preto, galeria: [
        { src: 'assets/img/models/voe-titan-cor-preto.webp', alt: 'Voe Titan preta com farol duplo e baú, em três quartos frontal' },
      ] },
    ],
  }),
  voe('x-infinity', 'X-Infinity', {
    categoria: 'autopropelido',
    classificacao: 'autopropelido',
    foto: 'assets/img/models/voe-x-infinity-capa.webp',
    alt: 'Scooter elétrica Voe X-Infinity preta com banco caramelo e pneus largos, recorte sem fundo',
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
    /* Capa: a foto preta com o fundo removido (BiRefNet, via rembg; original
       em MIDIAS/recortes/). Preta primeiro para o modal abrir nessa mesma
       foto. Carbono entra no lugar do cinza do catálogo antigo. Vermelho e
       azul usam o tom da lataria iluminada: os da paleta são um vermelho
       vivo e um ciano, e esta pintura é vermelho escuro e azul royal. */
    cores: [
      { ...COR.preto, galeria: [
        { src: 'assets/img/models/voe-x-infinity-cor-preto.webp', alt: 'Voe X-Infinity preta com banco caramelo, em três quartos frontal', recorte: false, inteira: true, fundo: '#FDFDFD' },
      ] },
      { ...COR.branco, galeria: [
        { src: 'assets/img/models/voe-x-infinity-cor-branco.webp', alt: 'Voe X-Infinity branca com banco caramelo, em três quartos frontal', recorte: false, inteira: true, fundo: '#FDFDFD' },
      ] },
      { ...COR.carbono, galeria: [
        { src: 'assets/img/models/voe-x-infinity-cor-carbono.webp', alt: 'Voe X-Infinity com acabamento em fibra de carbono e banco preto, em três quartos frontal', recorte: false, inteira: true, fundo: '#FCFCFC' },
      ] },
      { ...COR.vermelho, hex: '#A1040B', galeria: [
        { src: 'assets/img/models/voe-x-infinity-cor-vermelho.webp', alt: 'Voe X-Infinity vermelha com banco preto, em três quartos frontal', recorte: false, inteira: true, fundo: '#FCFCFC' },
      ] },
      { ...COR.azul, hex: '#003AB7', galeria: [
        { src: 'assets/img/models/voe-x-infinity-cor-azul.webp', alt: 'Voe X-Infinity azul com banco preto, em três quartos frontal', recorte: false, inteira: true, fundo: '#FDFDFD' },
      ] },
    ],
  }),
  voe('x11-mini', 'X11 Mini', {
    categoria: 'autopropelido',
    classificacao: 'autopropelido',
    foto: 'assets/img/models/voe-x11-mini-cor-preto.webp',
    alt: 'Scooter elétrica Voe X11 Mini preta com banco caramelo e pneus largos, recorte sem fundo',
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
    /* Preta primeiro: é a capa, a pedido da loja, e o modal abre nela. O que
       muda de cor são os para-lamas, e o hex de azul e grafite foi amostrado
       neles: o COR.azul é ciano claro, e o grafite desta pintura é mais quente
       e mais claro que o do X11. Grafite entrou no lugar do cinza. */
    cores: [
      { ...COR.preto, galeria: [
        { src: 'assets/img/models/voe-x11-mini-cor-preto.webp', alt: 'Voe X11 Mini preta com banco caramelo, em três quartos frontal' },
      ] },
      { ...COR.vermelho, galeria: [
        { src: 'assets/img/models/voe-x11-mini-cor-vermelho.webp', alt: 'Voe X11 Mini com para-lamas vermelhos e banco preto, em três quartos frontal' },
      ] },
      { ...COR.branco, galeria: [
        { src: 'assets/img/models/voe-x11-mini-cor-branco.webp', alt: 'Voe X11 Mini com para-lamas brancos e banco caramelo, em três quartos frontal' },
      ] },
      { ...COR.grafite, hex: '#6C6162', galeria: [
        { src: 'assets/img/models/voe-x11-mini-cor-grafite.webp', alt: 'Voe X11 Mini com para-lamas grafite e banco caramelo, em três quartos frontal' },
      ] },
      { ...COR.azul, hex: '#0022F3', galeria: [
        { src: 'assets/img/models/voe-x11-mini-cor-azul.webp', alt: 'Voe X11 Mini com para-lamas azuis e banco caramelo, em três quartos frontal' },
      ] },
    ],
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
      /* `detalhe: true` = a foto sobrevive a troca de cor. Vale para
         acabamento e componente, nao para o veiculo inteiro: as tres de cima
         mostram a moto branca, preta e preta-dourada, e mante-las ao lado de
         uma vermelha selecionada confundiria em vez de informar.

         Estas tres substituem as duas antigas (voe-x11-4 e -5): sao do mesmo
         acabamento, feitas na rua e em resolucao melhor. */
      { src: 'assets/img/models/voe-x11-detalhe-1.webp', alt: 'Farol dianteiro da Voe X11, com a moto estacionada na orla', recorte: false, detalhe: true },
      { src: 'assets/img/models/voe-x11-detalhe-2.webp', alt: 'Chave na ignição da Voe X11', recorte: false, detalhe: true },
      { src: 'assets/img/models/voe-x11-detalhe-3.webp', alt: 'Bateria e suspensão traseira da Voe X11', recorte: false, detalhe: true },
    ],
    /* O catálogo impresso lista duas versões de motor (2000 W e 3000 W) e
       70 km/h. O cliente confirmou 3000 W como a versão padrão da loja.

       ⚠ A BATERIA SAIU DA FICHA por causa dessa troca. O 'Lítio 60V 20Ah' que
         estava aqui vinha da linha de 2000 W na tabela do fabricante, e não
         vale mais para a de 3000 W (o X15, também 3000 W, usa 60V 25Ah).
         Confirmar com a loja e devolver o campo.

       ⚠ A VELOCIDADE de 50 km/h foi informada pelo cliente quando a potência
         era 2000 W. O catálogo impresso traz 70 km/h para a versão maior.
         Confirmar se 50 continua valendo. */
    specs: {
      classificacao: 'Ciclomotor · exige registro e habilitação',
      velocidade: { valor: 50, unidade: 'km/h' },
      potencia: { valor: 3000, unidade: 'W' },
      // O cliente corrigiu para 45 km MAXIMOS: e numero de melhor caso, e a
      // ficha diz isso em vez de deixar parecer comparavel com uma media.
      autonomia: { valor: 45, unidade: 'km', nota: 'Autonomia máxima; varia com peso, relevo e modo de condução.' },
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
    /* Seis cores, cinco com foto propria. Cinza e azul sairam da lista: a loja
       deixou de trabalhar com elas. So o branco continua sem galeria propria,
       e ao ser clicado cai na galeria padrao do modelo, que e o comportamento
       de fotosDaCorAtiva no app.js.

       Preto e Grafite sao pinturas quase identicas na amostra (#383F47 contra
       #363C40); a diferenca visivel nas fotos e o banco, marrom num e preto no
       outro. Ficam separadas porque e assim que a loja vende, e o alt de cada
       uma diz qual banco, para a pessoa entender por que os dois swatches
       escuros existem. */
    cores: [
      COR.branco,
      { ...COR.preto, galeria: [
        { src: 'assets/img/models/voe-x11-cor-preto.webp', recorte: false, inteira: true,
          alt: 'Voe X11 preta de perfil, com banco marrom e apoio de costas' },
      ] },
      { ...COR.grafite, galeria: [
        { src: 'assets/img/models/voe-x11-cor-grafite.webp', recorte: false, inteira: true,
          alt: 'Voe X11 grafite de perfil, com banco preto e apoio de costas' },
      ] },
      { ...COR.vermelho, galeria: [
        { src: 'assets/img/models/voe-x11-cor-vermelho.webp', recorte: false, inteira: true,
          alt: 'Voe X11 vermelha em tres quartos frontal, com para-lamas e chassi na cor' },
      ] },
      /* Era "Dourado" com hex chapado. A foto mostra que a pintura tem DOIS
         tons: chassi escuro e para-lamas dourados. Virou COR.pretodourado,
         com swatch `bicolor`, que e o caso para o qual ele foi feito. */
      { ...COR.pretodourado, galeria: [
        { src: 'assets/img/models/voe-x11-cor-pretodourado.webp', recorte: false, inteira: true,
          alt: 'Voe X11 preta com para-lamas dourados, em tres quartos frontal' },
      ] },
      { ...COR.reinounido, galeria: [
        { src: 'assets/img/models/voe-x11-cor-reinounido.webp', recorte: false, inteira: true,
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
      autonomia: { valor: 100, unidade: 'km', nota: 'Com 2 baterias.' },
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
    cores: cores('preto'), // a loja não trabalha a branca
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
    galeria: [
      { src: 'assets/img/models/voe-pop-1.webp', alt: 'Bicicleta elétrica Voe Pop vermelha, recorte sem fundo' },
      { src: 'assets/img/models/voe-pop-detalhe-1.webp', alt: 'Guidão do Voe Pop com suporte de celular e painel digital', recorte: false, detalhe: true },
      { src: 'assets/img/models/voe-pop-detalhe-2.webp', alt: 'Painel digital do Voe Pop em detalhe', recorte: false, detalhe: true },
      { src: 'assets/img/models/voe-pop-detalhe-3.webp', alt: 'Roda traseira e motor do Voe Pop em detalhe', recorte: false, detalhe: true },
    ],
    cores: [
      { ...COR.branco, galeria: [
        { src: 'assets/img/models/voe-pop-cor-branco.webp', alt: 'Voe Pop branca de perfil, com cesta dianteira e bagageiro', recorte: false, inteira: true },
      ] },
      /* ⚠ A foto que a loja nomeou "preto" mostra um quadro CINZA: amostrada,
         a lataria dá #79828B, contra #43484C da grafite do X11. O swatch preto
         ao lado dela vai parecer errado. Confirmar como a loja vende essa
         pintura antes de publicar. */
      { ...COR.preto, galeria: [
        { src: 'assets/img/models/voe-pop-cor-preto.webp', alt: 'Voe Pop cinza de perfil, com cesta dianteira e bagageiro', recorte: false, inteira: true },
      ] },
      { ...COR.vermelho, galeria: [
        { src: 'assets/img/models/voe-pop-cor-vermelho.webp', alt: 'Voe Pop vermelha de perfil, com cesta dianteira e bagageiro', recorte: false, inteira: true },
      ] },
      /* Azul PROPRIO da Pop, e nao o COR.azul da paleta. O compartilhado e um
         ciano claro (#5CE1E6) que nao existe em moto nenhuma; aqui ele ficava
         ao lado de uma bicicleta azul forte e parecia erro. Os outros quatro
         modelos que usam COR.azul seguem com o ciano ate termos foto deles. */
      { ...COR.azul, hex: '#004CB6', galeria: [
        { src: 'assets/img/models/voe-pop-cor-azul.webp', alt: 'Voe Pop azul de perfil, com cesta dianteira e bagageiro', recorte: false, inteira: true },
      ] },
    ],
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
  voe('g5', 'G5', {
    categoria: 'patinete',
    classificacao: null,
    descritivo: 'Patinete elétrico',
    alt: 'Patinete elétrico Voe G5 preto com banco e bagageiro, recorte sem fundo',
    galeria: [
      { src: 'assets/img/models/voe-g5-1.webp', alt: 'Patinete elétrico Voe G5 preto com banco e bagageiro, recorte sem fundo' },
      /* Nomeadas como detalhe pela loja. A primeira mostra o veículo inteiro, o
         que normalmente não deveria sobreviver à troca de cor; aqui pode,
         porque o G5 tem uma cor só e não há outra pintura para conflitar. */
      { src: 'assets/img/models/voe-g5-detalhe-1.webp', alt: 'Voe G5 visto de frente, com guidão e faróis', recorte: false, inteira: true, detalhe: true },
      { src: 'assets/img/models/voe-g5-detalhe-2.webp', alt: 'Painel digital do Voe G5 com a chave na ignição', recorte: false, inteira: true, detalhe: true },
      { src: 'assets/img/models/voe-g5-detalhe-3.webp', alt: 'Punho do acelerador e painel do Voe G5 em detalhe', recorte: false, inteira: true, detalhe: true },
      { src: 'assets/img/models/voe-g5-detalhe-4.webp', alt: 'Roda traseira e motor do Voe G5 em detalhe', recorte: false, inteira: true, detalhe: true },
    ],
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
    cores: [
      { ...COR.preto, galeria: [
        { src: 'assets/img/models/voe-g5-cor-preto.webp', alt: 'Patinete Voe G5 preto em três quartos, com banco e bolsa no guidão' },
        { src: 'assets/img/models/voe-g5-cor-preto-2.webp', alt: 'Voe G5 preto de perfil, com banco e bagageiro traseiro', recorte: false, inteira: true },
      ] },
    ],
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
    q: 'A moto elétrica sobe ladeira?',
    a: 'Sim, a performance de subida pode variar de acordo com a potência do motor e o peso suportado pelo modelo.',
  },
  {
    q: 'A bateria é removível?',
    a: 'Sim, o que permite carregar em apartamento ou no trabalho. A ficha técnica de cada modelo traz a especificação da bateria.',
  },
  {
    q: 'Vocês têm assistência técnica própria?',
    a: 'Sim. A manutenção e as peças das marcas que trabalhamos passam pela nossa oficina, com equipe treinada e prazo de retorno informado na abertura do atendimento.',
  },
  {
    q: 'Dá para andar com garupa?',
    a: 'Pode levar até 1 passageiro desde que o modelo tenha estrutura para isso. A ficha técnica traz a carga máxima suportada, e é um dos campos que conferimos junto com você.',
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
