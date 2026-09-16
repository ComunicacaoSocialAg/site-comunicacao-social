// ─── ANALYTICS & BUSINESS CONVERSION TRACKING ─────────────────────────────────

export function trackEvent(eventName, params = {}) {
  try {
    if (typeof window === 'undefined') return;

    // Microsoft Clarity custom event
    if (typeof window.clarity === 'function') {
      window.clarity('event', eventName, params);
    }

    // Google Analytics 4 (if configured)
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }

    // Console debug in dev mode
    if (import.meta.env && import.meta.env.DEV) {
      console.log(`[Analytics] ${eventName}:`, params);
    }
  } catch (err) {
    // Non-blocking telemetry failure
  }
}

export function trackCaseView(caseId, caseTitle, isConceptual = false) {
  trackEvent('view_case_study', {
    case_id: caseId,
    case_title: caseTitle,
    case_type: isConceptual ? 'conceptual' : 'verified_client',
  });
}

export function trackWhatsAppClick(sourceLocation, customLabel = '') {
  trackEvent('click_whatsapp_cta', {
    source: sourceLocation,
    label: customLabel,
    timestamp: new Date().toISOString(),
  });
}

export function trackProposalRequest(caseId, formatName) {
  trackEvent('request_proposal', {
    case_id: caseId,
    format: formatName,
  });
}

export function trackContactStep(stepNumber, stepTitle) {
  trackEvent('contact_flow_step', {
    step: stepNumber,
    title: stepTitle,
  });
}

export function trackCategoryFilter(categoryId) {
  trackEvent('filter_category', {
    category: categoryId,
  });
}
