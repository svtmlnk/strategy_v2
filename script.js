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

// Отправка формы заявки
var form = document.getElementById("contact-form");
var formBox = document.getElementById("form-box");
var formStates = {
  form: form,
  loading: document.getElementById("form-loading"),
  success: document.getElementById("form-success"),
  failure: document.getElementById("form-failure"),
};

function showFormState(name) {
  Object.keys(formStates).forEach(function (key) {
    formStates[key].hidden = key !== name;
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Заполнено скрытое поле — это бот: делаем вид, что всё хорошо, ничего не шлём
  if (form.elements.website.value) {
    form.reset();
    showFormState("success");
    return;
  }

  // Данные формы -> обычный объект -> JSON
  var data = {};
  new FormData(form).forEach(function (value, key) {
    data[key] = value;
  });
  delete data.website;

  // Фиксируем высоту, чтобы блок не схлопывался при смене состояния
  formBox.style.setProperty("--form-h", form.offsetHeight + "px");
  showFormState("loading");

  fetch("https://submit-form.com/msRoBphP3", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      if (response.ok) {
        form.reset();
        showFormState("success");
      } else {
        showFormState("failure");
      }
    })
    .catch(function (error) {
      console.error("Ошибка:", error);
      showFormState("failure");
    });
});

// После ошибки возвращаем форму с уже введёнными данными
document.getElementById("form-retry").addEventListener("click", function () {
  showFormState("form");
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

// Плавное раскрытие и закрытие <details class="service">
var reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

document.querySelectorAll(".service").forEach(function (details) {
  var summary = details.querySelector(".service__head");
  var animation = null;

  function animateHeight(from, to, onFinish) {
    if (animation) animation.cancel();
    details.style.overflow = "hidden";
    animation = details.animate(
      { height: [from + "px", to + "px"] },
      { duration: reduceMotion ? 0 : 300, easing: "ease-in-out" },
    );
    animation.onfinish = function () {
      animation = null;
      details.style.overflow = "";
      onFinish();
    };
    animation.oncancel = function () {
      animation = null;
    };
  }

  function open() {
    details.classList.remove("service--closing");
    var from = details.offsetHeight;
    details.open = true;
    var to = details.offsetHeight; // естественная высота в раскрытом виде
    animateHeight(from, to, function () {});
  }

  function close() {
    var from = details.offsetHeight;
    var borders = details.offsetHeight - details.clientHeight;
    var to = summary.offsetHeight + borders;
    details.classList.add("service--closing");
    animateHeight(from, to, function () {
      details.open = false;
      details.classList.remove("service--closing");
    });
  }

  summary.addEventListener("click", function (event) {
    event.preventDefault();
    var isClosing = details.classList.contains("service--closing");
    if (!details.open || isClosing) {
      open();
    } else {
      close();
    }
  });
});

// Анимация счётчиков в блоке статистики
var counters = document.querySelectorAll("[data-count]");

function renderCounter(el, value) {
  var decimals = (el.dataset.count.split(".")[1] || "").length;
  el.textContent =
    value.toLocaleString("ru-RU", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) + (el.dataset.suffix || "");
}

function animateCounter(el, duration) {
  var target = Number(el.dataset.count);
  var startTime = performance.now();

  function frame(now) {
    var progress = Math.min((now - startTime) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3); // замедление к концу
    renderCounter(el, target * eased);
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

if (!reduceMotion && "IntersectionObserver" in window) {
  counters.forEach(function (el) {
    renderCounter(el, 0);
  });

  var counterObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target, 2000);
        observer.unobserve(entry.target); // запускаем один раз
      });
    },
    { threshold: 0.6 },
  );
  counters.forEach(function (el) {
    counterObserver.observe(el);
  });
}

// Автозапуск видео: если браузер заблокировал, пробуем после первого касания
var heroVideo = document.querySelector(".hero__video");
if (heroVideo) {
  heroVideo.play().catch(function () {
    document.addEventListener(
      "touchstart",
      function () {
        heroVideo.play().catch(function () {});
      },
      { once: true, passive: true },
    );
  });
}

// Год берётся из часов устройства посетителя. Значение 2026 в разметке осталось запасным, на случай если скрипт не сработает.
document.querySelector(".footer__year").textContent = new Date().getFullYear();

AOS.init({
  once: true,
});
