const burger = document.querySelector(".nav__burger");
const menu = document.querySelector(".nav__list");
function setMenu(open) {
  menu.classList.toggle("nav__list--open", open);
  burger.classList.toggle("nav__burger--active", open);
  burger.setAttribute("aria-expanded", open);
}
burger.addEventListener("click", () =>
  setMenu(!menu.classList.contains("nav__list--open")),
);

menu
  .querySelectorAll(".nav__link")
  .forEach((link) => link.addEventListener("click", () => setMenu(false)));

AOS.init({
  once: true,
});
