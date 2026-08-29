/* ==========================================================================
   URBANA · configuração da loja
   Único lugar onde dados de negócio moram. O HTML e o app.js leem daqui.
   ========================================================================== */

window.URBANA_CONFIG = {
  marca: {
    nome: 'Urbana Mobilidade Elétrica',
    razaoSocial: 'URBANA MULTIMARCAS EM MOBILIDADE ELETRICA LTDA',
    cnpj: '60.831.776/0001-85',
  },

  /* WhatsApp: vendas e assistência usam o mesmo número.
     `numero` é só para exibição; `e164` é o que entra no link wa.me. */
  whatsapp: {
    numero: '(19) 99947-8226',
    e164: '5519999478226',
  },

  endereco: {
    logradouro: 'Av. Carlos Botelho, 472',
    bairro: 'São Dimas',
    cidade: 'Piracicaba',
    uf: 'SP',
    cep: '13416-145',
    get completo() {
      return `${this.logradouro} · ${this.bairro} · ${this.cidade}/${this.uf} · ${this.cep}`;
    },
    // Usado no link "traçar rota" e no iframe do mapa.
    get busca() {
      return `${this.logradouro}, ${this.bairro}, ${this.cidade} - ${this.uf}, ${this.cep}`;
    },
  },

  /* ⚠ CONFIRMAR COM A LOJA antes de publicar, porque o horário não foi informado.
     Enquanto `confirmado` for false, o rodapé mostra "consulte pelo WhatsApp"
     em vez de um horário que pode estar errado. */
  horarios: {
    confirmado: false,
    semana: 'Segunda a sexta · 9h às 18h',
    sabado: 'Sábado · 9h às 13h',
  },

  redes: {
    instagram: 'https://www.instagram.com/urbana.piracicaba',
  },

  /* Mensagens pré-preenchidas. `{modelo}` e `{cor}` são trocados em tempo de clique. */
  mensagens: {
    geral: 'Olá! Vim pelo site da Urbana e quero falar com um consultor sobre mobilidade elétrica.',
    modelo: 'Olá! Vim pelo site da Urbana e tenho interesse no modelo {modelo}. Pode me passar ficha técnica e condições?',
    modeloCor: 'Olá! Vim pelo site da Urbana e tenho interesse no {modelo} na cor {cor}. Pode me passar ficha técnica e condições?',
    testRide: 'Olá! Quero agendar um test ride na Urbana.\n\nNome: {nome}\nInteresse: {interesse}',
    assistencia: 'Olá! Preciso de assistência técnica para o meu veículo elétrico.',
    categoria: 'Olá! Vim pelo site da Urbana e quero ver as opções de {categoria}.',
  },
};
