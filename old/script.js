// Демо-обработка формы: проверка полей и сообщение. Подключите свой backend.
const form = document.getElementById("contact-form");
const status = form.querySelector(".form__status");

const loadingEl = document.getElementById("form-loading");
const successEl = document.getElementById("form-success");
const failureEl = document.getElementById("form-failure");
const retryBtn = document.getElementById("form-retry");

const FORM_URL = "https://submit-form.com/msRoBphP3";

// Показываем только одно состояние: form | loading | success | failure
function showState(state) {
  form.hidden = state !== "form";
  loadingEl.hidden = state !== "loading";
  successEl.hidden = state !== "success";
  failureEl.hidden = state !== "failure";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    status.textContent =
      "Заполните ФИО, телефон, почту и подтвердите согласие.";
    return;
  }
  status.textContent = "";

  // Преобразуем данные формы в обычный объект
  const data = Object.fromEntries(new FormData(form));

  showState("loading");

  try {
    const response = await fetch(FORM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      form.reset();
      showState("success");
    } else {
      showState("failure");
    }
  } catch (error) {
    console.error("Ошибка отправки:", error);
    showState("failure");
  }
});

// Вернуться к форме (введённые данные сохраняются)
retryBtn.addEventListener("click", () => showState("form"));

// Навигация по якорям через JS: адресная строка остаётся без #hash
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault(); // отключаем стандартный переход, URL не меняется

    const hash = link.getAttribute("href");
    if (hash === "#") return; // заглушки вроде «Политика конфиденциальности»

    const target = document.querySelector(hash);
    if (!target) return;

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  });

  const navLinks = document.querySelectorAll('a[href^="#"]');

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const hash = link.getAttribute("href");

    if (hash === "#") return;

    const target = document.querySelector(hash);

    if (!target) return;

    // Удаляем класс у всех ссылок
    navLinks.forEach((item) => {
      item.classList.remove("header__link--active");
    });

    // Добавляем класс текущей ссылке
    link.classList.add("header__link--active");

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  });
});
});

AOS.init({
  once: true,
});
