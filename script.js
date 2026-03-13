const analyticsConfig = {
  ga4MeasurementId: "G-46PFKJ6VC0",
  behaviorAnalyticsScriptUrl: "https://t.contentsquare.net/uxa/7bb3c51d7d1e7.js",
  formspreeEndpoint: "https://formspree.io/f/xgonyqov",
};

const header = document.querySelector(".site-header");
const scrollButtons = document.querySelectorAll(".cta-scroll");
const ctaLinks = document.querySelectorAll("[data-cta-source]");
const signupSection = document.querySelector("#signup");
const forms = document.querySelectorAll(".lead-form");
const modal = document.querySelector("#lead-modal");
const modalCloseButton = document.querySelector("#modal-close");
const modalTitle = document.querySelector("#lead-modal-title");
const modalDescription = document.querySelector("#lead-modal-description");

const ctaMessageMap = {
  hero_primary: {
    title: "무료 창농 가이드를 먼저 받아보세요",
    description: "막막한 창농 준비를 시작할 수 있도록 핵심 가이드와 사전 신청을 함께 받습니다.",
  },
  dashboard_section: {
    title: "대시보드 기반 준비 경험을 먼저 받아보세요",
    description: "준비 상태를 한눈에 파악하는 흐름이 어떻게 동작하는지 먼저 안내해드립니다.",
  },
  checklist_section: {
    title: "체크리스트 기반 창농 준비를 시작해보세요",
    description: "무엇을 끝냈고 무엇이 남았는지 단계별로 관리하는 경험을 먼저 받아볼 수 있습니다.",
  },
  final_cta: {
    title: "지금 바로 사전 신청하고 먼저 만나보세요",
    description: "Farm-tner의 초기 사용자로 가장 먼저 창농 준비 경험을 받아볼 수 있습니다.",
  },
  nav_cta: {
    title: "무료 가이드와 얼리 액세스를 신청하세요",
    description: "상단 CTA에서 바로 신청해 창농 준비 자료와 초기 초대 소식을 받아보세요.",
  },
};

function hasRealValue(value, placeholder) {
  return Boolean(value) && value !== placeholder;
}

function loadScript(src) {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function initGA4() {
  if (!hasRealValue(analyticsConfig.ga4MeasurementId, "G-XXXXXXXXXX")) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  loadScript(
    `https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.ga4MeasurementId}`
  );

  window.gtag("js", new Date());
  window.gtag("config", analyticsConfig.ga4MeasurementId, {
    anonymize_ip: true,
  });
}

function initBehaviorAnalytics() {
  if (
    !hasRealValue(
      analyticsConfig.behaviorAnalyticsScriptUrl,
      "https://example.com/behavior-analytics.js"
    )
  ) {
    return;
  }

  loadScript(analyticsConfig.behaviorAnalyticsScriptUrl);
}

function trackEvent(eventName, params = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);

  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || "",
  };
}

function applyContextToForm(form, source, offerType = "early_access") {
  const utmParams = getUtmParams();
  const interestValue =
    form.querySelector('input[name="interest"]')?.value.trim() || "";

  form.querySelector('[name="cta_source"]').value = source || "unknown_cta";
  form.querySelector('[name="offer_type"]').value = offerType;
  form.querySelector('[name="landing_page_url"]').value = window.location.href;
  form.querySelector('[name="landing_page_title"]').value = document.title;
  form.querySelector('[name="submitted_at"]').value = new Date().toISOString();
  form.querySelector('[name="referrer"]').value = document.referrer || "";

  Object.entries(utmParams).forEach(([key, value]) => {
    const input = form.querySelector(`[name="${key}"]`);
    if (input) {
      input.value = value;
    }
  });

  const subject = `[Farm-tner Lead] ${source || "unknown_cta"} | ${window.location.pathname}`;
  const summaryLines = [
    `Page URL: ${window.location.href}`,
    `CTA Source: ${source || "unknown_cta"}`,
    `Offer Type: ${offerType}`,
    `Page Title: ${document.title}`,
    `Interest: ${interestValue || "not_provided"}`,
    `Referrer: ${document.referrer || "direct"}`,
    `UTM Source: ${utmParams.utm_source || "-"}`,
    `UTM Medium: ${utmParams.utm_medium || "-"}`,
    `UTM Campaign: ${utmParams.utm_campaign || "-"}`,
    `UTM Content: ${utmParams.utm_content || "-"}`,
    `UTM Term: ${utmParams.utm_term || "-"}`,
  ];

  form.querySelector('[name="_subject"]').value = subject;
  form.querySelector('[name="message"]').value = summaryLines.join("\n");
}

function openLeadModal(source, offerType) {
  const content = ctaMessageMap[source] || ctaMessageMap.hero_primary;
  const modalForm = document.querySelector("#modal-signup-form");

  modalTitle.textContent = content.title;
  modalDescription.textContent = content.description;
  applyContextToForm(modalForm, source, offerType);

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const firstInput = modalForm.querySelector('input[name="name"]');
  if (firstInput) {
    firstInput.focus();
  }

  trackEvent("lead_form_open", {
    cta_source: source,
    form_location: "modal",
    offer_type: offerType,
  });
}

function closeLeadModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function handleHeaderState() {
  if (window.scrollY > 24) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

function scrollToSignup(event) {
  const sourceLabel = event?.currentTarget?.textContent?.trim() || "unknown_cta";
  const source = event?.currentTarget?.dataset?.ctaSource || "unknown_cta";
  const offerType = event?.currentTarget?.dataset?.offerType || "early_access";

  signupSection.scrollIntoView({ behavior: "smooth", block: "start" });
  applyContextToForm(document.querySelector("#signup-form"), source, offerType);
  trackEvent("cta_click", {
    cta_label: sourceLabel,
    destination: "signup",
    cta_source: source,
  });
}

function setError(input, message) {
  const formGroup = input.closest(".form-group");
  const errorMessage = formGroup.querySelector(".error-message");

  input.classList.add("invalid");
  errorMessage.textContent = message;
}

function clearError(input) {
  const formGroup = input.closest(".form-group");
  const errorMessage = formGroup.querySelector(".error-message");

  input.classList.remove("invalid");
  errorMessage.textContent = "";
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

scrollButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const source = event.currentTarget.dataset.ctaSource || "unknown_cta";
    const offerType = event.currentTarget.dataset.offerType || "early_access";

    if (source === "nav_cta" || source === "hero_primary" || source === "final_cta") {
      event.preventDefault();
      openLeadModal(source, offerType);
      trackEvent("cta_click", {
        cta_label: event.currentTarget.textContent.trim(),
        destination: "modal",
        cta_source: source,
      });
      return;
    }

    scrollToSignup(event);
  });
});

window.addEventListener("scroll", handleHeaderState);
handleHeaderState();

async function submitLeadForm(form) {
  const nameInput = form.querySelector('input[name="name"]');
  const emailInput = form.querySelector('input[name="email"]');
  const interestInput = form.querySelector('input[name="interest"]');
  const submitButton = form.querySelector(".submit-button");
  const status = form.querySelector(".form-status");

  const nameValue = nameInput.value.trim();
  const emailValue = emailInput.value.trim();
  const interestValue = interestInput.value.trim();
  const ctaSource = form.querySelector('[name="cta_source"]').value;
  const offerType = form.querySelector('[name="offer_type"]').value;

  let isValid = true;

  if (!nameValue) {
    setError(nameInput, "이름을 입력해주세요.");
    isValid = false;
  } else {
    clearError(nameInput);
  }

  if (!emailValue) {
    setError(emailInput, "이메일을 입력해주세요.");
    isValid = false;
  } else if (!isValidEmail(emailValue)) {
    setError(emailInput, "올바른 이메일 형식을 입력해주세요.");
    isValid = false;
  } else {
    clearError(emailInput);
  }

  if (!interestValue) {
    setError(interestInput, "관심 분야를 입력해주세요.");
    isValid = false;
  } else {
    clearError(interestInput);
  }

  if (!isValid) {
    status.textContent = "입력 내용을 다시 확인해주세요.";
    status.classList.add("error");
    trackEvent("lead_form_error", {
      cta_source: ctaSource,
      error_type: "validation",
    });
    return;
  }

  applyContextToForm(form, ctaSource, offerType);

  submitButton.disabled = true;
  submitButton.textContent = "제출 중...";
  status.textContent = "";
  status.classList.remove("error", "success");

  trackEvent("lead_form_submit", {
    cta_source: ctaSource,
    form_location: form.id === "modal-signup-form" ? "modal" : "inline",
    offer_type: offerType,
  });

  try {
    const response = await fetch(analyticsConfig.formspreeEndpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: new FormData(form),
    });

    if (response.ok) {
      status.textContent = "신청이 완료되었습니다. 곧 안내 메일을 보내드릴게요.";
      status.classList.add("success");
      form.reset();
      applyContextToForm(form, ctaSource, offerType);

      trackEvent("generate_lead", {
        cta_source: ctaSource,
        offer_type: offerType,
        interest: interestValue,
      });

      if (form.id === "modal-signup-form") {
        setTimeout(closeLeadModal, 900);
      }
      return;
    }

    if (response.status === 429) {
      throw new Error("잠시 후 다시 시도해주세요.");
    }

    const data = await response.json().catch(() => null);
    const message =
      data?.errors?.[0]?.message || "제출 중 문제가 발생했습니다. 다시 시도해주세요.";
    throw new Error(message);
  } catch (error) {
    status.textContent = error.message;
    status.classList.add("error");
    trackEvent("lead_form_error", {
      cta_source: ctaSource,
      error_type: "request",
    });
  } finally {
    submitButton.disabled = false;
    submitButton.textContent =
      form.id === "modal-signup-form" ? "무료 가이드 받고 신청하기" : "사전 신청하기";
  }
}

forms.forEach((form) => {
  const initialSource = form.querySelector('[name="cta_source"]').value;
  const initialOffer = form.querySelector('[name="offer_type"]').value;

  applyContextToForm(form, initialSource, initialOffer);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitLeadForm(form);
  });

  form.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      clearError(input);
      const status = form.querySelector(".form-status");
      status.textContent = "";
      status.classList.remove("error");
    });
  });
});

modalCloseButton.addEventListener("click", closeLeadModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeLeadModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) {
    closeLeadModal();
  }
});

initGA4();
initBehaviorAnalytics();
