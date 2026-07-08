window.addEventListener("load", () => {
  const loader = document.getElementById("pageLoader");
  if (loader) {
    loader.classList.add("is-hidden");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".glass-nav");
  const backToTop = document.getElementById("backToTop");
  const heroBg = document.querySelector(".hero-bg");

  if (window.AOS) {
    AOS.init({
      duration: 720,
      easing: "ease-out-cubic",
      once: true,
      offset: 80
    });
  }

  const updateChrome = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    nav?.classList.toggle("is-scrolled", y > 16);
    backToTop?.classList.toggle("is-visible", y > 520);

    if (heroBg && window.matchMedia("(min-width: 992px)").matches) {
      heroBg.style.transform = `scale(1.04) translateY(${y * 0.06}px)`;
    }
  };

  updateChrome();
  window.addEventListener("scroll", updateChrome, { passive: true });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.querySelectorAll(".navbar-collapse .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      const menu = document.getElementById("navbarContent");
      if (menu?.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.counter || 0);
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased).toString();
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const counters = document.querySelectorAll("[data-counter]");
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((counter) => counterObserver.observe(counter));

  const form = document.getElementById("contactForm");
  if (form) {
    const fields = form.querySelectorAll("input, select, textarea");
    fields.forEach((field) => {
      field.addEventListener("input", () => {
        field.classList.toggle("is-valid", field.checkValidity());
        field.classList.toggle("is-invalid", !field.checkValidity() && field.value.length > 0);
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      form.classList.add("was-validated");

      if (!form.checkValidity()) {
        return;
      }

      const data = new FormData(form);
      const message = [
        "Hola, deseo agendar una consulta medica.",
        `Nombre: ${data.get("name")}`,
        `Correo: ${data.get("email")}`,
        `Telefono: ${data.get("phone")}`,
        `Tipo de consulta: ${data.get("service")}`,
        `Mensaje: ${data.get("message")}`
      ].join("\n");

      window.open(`https://wa.me/56920409701?text=${encodeURIComponent(message)}`, "_blank", "noopener");
    });
  }
});
