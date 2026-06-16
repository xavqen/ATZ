const menuBtn = document.querySelector(".menu-btn");
const navWrap = document.querySelector(".nav-wrap");

if (menuBtn && navWrap) {
  menuBtn.addEventListener("click", () => {
    const isOpen = navWrap.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });

  navWrap.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navWrap.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}