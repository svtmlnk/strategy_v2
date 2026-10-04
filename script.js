// Шапка: фон при прокрутке и мобильное меню
var header = document.querySelector(".header");
var burger = document.querySelector(".burger");

function updateHeader() {
  header.classList.toggle("header--scrolled", window.scrollY > 40);
}
function setMenu(isOpen) {
  header.classList.toggle("header--open", isOpen);
  burger.setAttribute("aria-expanded", String(isOpen));
  burger.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
}

// Подсветка ссылки текущей секции
var navLinks = Array.prototype.slice.call(
  document.querySelectorAll(".nav__link"),
);
var isClickScrolling = false;
var unlockTimer;

function setActiveLink(activeLink) {
  navLinks.forEach(function (link) {
    var isActive = link === activeLink;
    link.classList.toggle("nav__link--active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function updateActiveLink() {
  var probeLine = 120; // линия на 120px от верха окна
  var current = null;
  var isPageBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 4;

  navLinks.forEach(function (link) {
    var section = document.querySelector(link.getAttribute("href"));
    if (section && section.getBoundingClientRect().top <= probeLine) {
      current = link;
    }
  });
  if (isPageBottom) {
    current = navLinks[navLinks.length - 1];
  }
  setActiveLink(current);
}

// После клика не мигаем промежуточными секциями, пока идёт плавная прокрутка
function lockUntilScrollEnds() {
  isClickScrolling = true;
  clearTimeout(unlockTimer);
  unlockTimer = setTimeout(function () {
    isClickScrolling = false;
    updateActiveLink();
  }, 300);
}

window.addEventListener(
  "scroll",
  function () {
    updateHeader();
    if (isClickScrolling) {
      lockUntilScrollEnds();
    } else {
      updateActiveLink();
    }
  },
  { passive: true },
);
updateHeader();
updateActiveLink();

burger.addEventListener("click", function () {
  setMenu(!header.classList.contains("header--open"));
});
navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    setActiveLink(link);
    lockUntilScrollEnds();
    setMenu(false);
  });
});

// Заглушка отправки формы: подключите здесь свой backend
var form = document.getElementById("contact-form");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  document.getElementById("form-status").textContent =
    "Спасибо! Заявка отправлена, менеджер свяжется с вами.";
  form.reset();
});

// Заглушка отправки формы: подключите здесь свой backend
var form = document.getElementById("contact-form");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  document.getElementById("form-status").textContent =
    "Спасибо! Заявка отправлена, менеджер свяжется с вами.";
  form.reset();
});

// Якорные ссылки: плавный переход без #hash в адресной строке
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  var targetId = link.getAttribute("href");
  if (targetId === "#") {
    return;
  } // пустые заглушки не трогаем

  link.addEventListener("click", function (event) {
    var target = document.querySelector(targetId);
    if (!target) {
      return;
    }

    event.preventDefault(); // отменяем стандартный переход, URL не меняется
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Год берётся из часов устройства посетителя. Значение 2026 в разметке осталось запасным, на случай если скрипт не сработает.
document.querySelector('.footer__year').textContent = new Date().getFullYear();

AOS.init({
  once: true,
});
