const analyticsConfig = {
  ga4MeasurementId: "G-46PFKJ6VC0",
  behaviorAnalyticsScriptUrl: "https://t.contentsquare.net/uxa/7bb3c51d7d1e7.js",
};

const header = document.querySelector(".site-header");
const scrollButtons = document.querySelectorAll(".cta-scroll");
const signupSection = document.querySelector("#signup");
const signupForm = document.querySelector("#signup-form");

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

function handleHeaderState() {
  if (window.scrollY > 24) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

function scrollToSignup(event) {
  const sourceLabel = event?.currentTarget?.textContent?.trim() || "unknown_cta";

  signupSection.scrollIntoView({ behavior: "smooth", block: "start" });
  trackEvent("cta_click", {
    cta_label: sourceLabel,
    destination: "signup",
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
  button.addEventListener("click", scrollToSignup);
});

window.addEventListener("scroll", handleHeaderState);
handleHeaderState();

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nameInput = signupForm.querySelector("#name");
  const emailInput = signupForm.querySelector("#email");
  const interestInput = signupForm.querySelector("#interest");

  const nameValue = nameInput.value.trim();
  const emailValue = emailInput.value.trim();
  const interestValue = interestInput.value.trim();

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
    trackEvent("signup_validation_failed", {
      form_name: "early_access_signup",
    });
    return;
  }

  trackEvent("signup_submit", {
    form_name: "early_access_signup",
    farming_interest: interestValue,
  });

  alert("감사합니다. Farm-tner 사전 신청이 완료되었습니다!");
  signupForm.reset();
});

signupForm.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", () => clearError(input));
});

initGA4();
initBehaviorAnalytics();
