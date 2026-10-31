// ─── CONFIGURAÇÃO OFICIAL DA COMUNICAÇÃO SOCIAL AG ───────────────────────────

export const AGENCY_CONFIG = {
  name: 'Comunicação Social Ag',
  shortName: 'CS Ag',
  location: 'Poços de Caldas, MG, Brasil',
  city: 'Poços de Caldas, MG',
  phoneDisplay: '+55 (35) 98476-9017',
  phoneRaw: '5535984769017',
  whatsappNumber: '5535984769017',
  email: 'contato@comunicacaosocialag.com.br',
  clientPortalUrl: 'https://cliente.comunicacaosocialag.com.br',
  defaultWhatsAppMsg: 'Olá! Conheci o site da Comunicação Social Ag e gostaria de conversar com um estrategista.',
  getWhatsAppUrl(msg) {
    const text = encodeURIComponent(msg || this.defaultWhatsAppMsg);
    return `https://wa.me/${this.whatsappNumber}?text=${text}`;
  }
};
