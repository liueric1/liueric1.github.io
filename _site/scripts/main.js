// Basic interactions: mobile nav toggle and active link highlighting

const navToggleButton = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");
if (navToggleButton && siteNav) {
  navToggleButton.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggleButton.setAttribute("aria-expanded", String(isOpen));
  });
}

// Active link on scroll
const sectionIds = ["about", "experience", "projects", "contact"];
const sections = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const navLinks = Array.from(document.querySelectorAll(".site-nav a"));

const setActiveLink = () => {
  let currentId = "about";
  const scrollPos = window.scrollY + 120; // header offset
  for (const section of sections) {
    if (section && section.offsetTop <= scrollPos) {
      currentId = section.id;
    }
  }
  for (const link of navLinks) {
    const isActive = link.getAttribute("href") === `#${currentId}`;
    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  }
};

window.addEventListener("scroll", setActiveLink, { passive: true });
window.addEventListener("load", () => {
  setActiveLink();
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  
  // Initialize ScrollReveal
  if (window.ScrollReveal) {
    window.sr = ScrollReveal({
      origin: 'top',
      distance: '20px',
      duration: 500,
      delay: 100,
      reset: true,
    });
    sr.reveal('.section', { delay: 100, origin: 'bottom' });
    sr.reveal('.project-card', { delay: 200, origin: 'bottom' });
  }
});

