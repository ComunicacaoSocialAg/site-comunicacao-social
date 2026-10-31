import { AGENCY_CONFIG } from './agency.js';

// A página inicial estática usa os mesmos dados do case interativo.
export function renderClientCaseHtml(story, escape) {
  const e = escape;
  const image = (src, alt, width, height, className = '') => `<img src="${e(src)}" alt="${e(alt)}" width="${width}" height="${height}" class="${className}" loading="lazy">`;
  const chapter = (item) => `<section id="${e(item.id)}" class="case-chapter case-content"><h2>${e(item.title).replace(/\n/g, '<br>')}</h2><div class="case-chapter-copy"><p class="case-lead">${e(item.lead)}</p><p>${e(item.body)}</p><ul class="case-deliverables">${item.deliverables.map(text => `<li>${e(text)}</li>`).join('')}</ul></div></section>`;
  const gallery = (items, label) => `<div class="case-gallery case-content" aria-label="${e(label)}">${items.map(item => `<figure${item.wide ? ' class="case-gallery-wide"' : ''}><div class="case-image-stage case-surface-${e(item.surface || 'natural')}">${image(item.src, item.alt, item.width, item.height)}</div><figcaption>${e(item.caption)}</figcaption></figure>`).join('')}</div>`;
  const video = (item) => `<video src="${e(item.src)}"${item.poster ? ` poster="${e(item.poster)}"` : ''} aria-label="${e(item.caption || item.title)}" controls playsinline preload="none"></video>`;
  return `<article class="client-case" style="--case-accent:${e(story.accent)}" aria-labelledby="case-title">
    <header class="case-header"><a href="/" class="case-back">Voltar ao início</a><a href="/" class="case-agency">${image('/assets/brand/logo-sem-fundo.png', 'Comunicação Social Ag', 65, 34)}</a><a href="${AGENCY_CONFIG.getWhatsAppUrl()}" class="case-contact-link">Vamos conversar</a></header>
    <section class="case-hero"><div class="case-hero-products"><img src="${e(story.hero.src)}" alt="${e(story.hero.alt)}" width="${story.hero.width}" height="${story.hero.height}" class="case-hero-lineup" fetchpriority="high"></div><div class="case-hero-copy"><h1 id="case-title">${e(story.client)}</h1><p class="case-hero-thesis">${e(story.title)}</p><p class="case-hero-description">${e(story.category)}.<br>Uma marca, muitos pontos de contato.</p></div><a href="#visao-geral" class="case-scroll">Conheça o projeto</a></section>
    <nav class="case-chapters" aria-label="Capítulos do case"><a href="#visao-geral">O projeto</a><a href="#branding">Branding</a><a href="#embalagens">Embalagens</a><a href="#digital">Digital</a><a href="#eventos">Eventos</a></nav>
    <section id="visao-geral" class="case-overview case-content"><p class="case-introduction">${e(story.description)}</p><div class="case-two-columns"><div><h2>O desafio.</h2><p>${e(story.challenge)}</p></div><div><h2>O pensamento.</h2><p>${e(story.thinking)}</p></div></div></section>
    ${chapter(story.chapters[0])}
    <section class="case-brand-board" aria-label="Identidade visual Dubola">${image(story.images.logo, 'Logo Dubola', 929, 650, 'case-board-logo')}${image(story.signature.src, story.signature.alt, story.signature.width, story.signature.height, 'case-board-signature')}</section>
    ${gallery(story.galleries.graphic, 'Conceitos gráficos Dubola')}
    ${chapter(story.chapters[1])}
    ${gallery(story.galleries.packaging, 'Embalagens e imagens de produto Dubola')}
    ${chapter(story.chapters[2])}
    <section class="case-digital-composition case-content"><p>Do primeiro olhar<br>à próxima conversa.</p><div><span>Catálogo</span><span>Apresentação digital</span><span>Landing page</span><span>Animações digitais</span></div></section>
    ${gallery(story.galleries.digital, 'Catálogo Dubola')}
    <section class="case-motion case-content"><h2>${e(story.motion.title)}</h2><figure><div class="case-event-frame">${video(story.motion)}</div><figcaption>${e(story.motion.caption)}</figcaption></figure></section>
    ${chapter(story.chapters[3])}
    ${gallery(story.galleries.presence, 'Uniformes, sinalização e materiais da marca Dubola')}
    <section id="eventos" class="case-events case-content"><div class="case-events-intro"><h2>Onde a marca<br>vira encontro.</h2><p>${e(story.eventIntroduction)}</p></div><div class="case-events-grid">${story.events.map(event => `<article class="case-event" id="${e(event.id)}"><div class="case-event-frame">${event.src ? video(event) : '<div class="case-event-pending"><span>Vídeo em breve</span></div>'}</div><div class="case-event-caption"><h3>${e(event.title)}</h3><p>${e(event.location)}</p><span>${e(event.participation)}</span></div></article>`).join('')}</div></section>
    <section class="case-closing case-content"><h2>Uma presença<br>que se conecta.</h2><p>${e(story.closing)}</p></section>
    <footer class="case-footer case-content"><h2>O próximo case<br>pode ser o seu.</h2><a class="case-primary-link" href="${AGENCY_CONFIG.getWhatsAppUrl('Olá! Conheci o case Dubola e quero conversar sobre a minha marca.')}">Vamos conversar sobre a sua marca</a><div class="case-footer-bottom"><a href="/">Comunicação Social Ag</a><a href="/contato">Outras formas de contato</a><span>Poços de Caldas, MG</span></div></footer>
  </article>`;
}
