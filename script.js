const header = document.querySelector(".site-header");
const scrollButtons = document.querySelectorAll(".cta-scroll");
const signupSection = document.querySelector("#signup");
const signupForm = document.querySelector("#signup-form");

function handleHeaderState() {
  if (window.scrollY > 24) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

function scrollToSignup() {
  signupSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

scrollButtons.forEach((button) => {
  button.addEventListener("click", scrollToSignup);
});

window.addEventListener("scroll", handleHeaderState);
handleHeaderState();

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
    setError(interestInput, "관심 영농 분야를 입력해주세요.");
    isValid = false;
  } else {
    clearError(interestInput);
  }

  if (!isValid) {
    return;
  }

  alert("감사합니다. Farm-tner에 신청이 완료되었습니다!");
  signupForm.reset();
});

signupForm.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", () => clearError(input));
});
