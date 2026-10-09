(function () {
  "use strict";

  const config = window.PORTFOLIO_CONFIG || {};

  function buildContactLinks() {
    const email = config.email || "gustavocmservicossolucoes@gmail.com";
    const whatsapp = config.whatsapp || "5515991276630";
    const instagram = config.instagram || "ghas_1004";

    const urls = {
      email: "mailto:" + email,
      whatsapp: "https://wa.me/" + whatsapp,
      instagram: "https://instagram.com/" + instagram,
    };

    document.querySelectorAll("[data-link]").forEach(function (link) {
      const key = link.getAttribute("data-link");
      if (urls[key]) {
        link.setAttribute("href", urls[key]);
      }
    });
  }

  function setupHeader() {
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");

    const onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (!toggle || !nav) return;

    const closeMenu = function () {
      toggle.classList.remove("is-open");
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
    };

    toggle.addEventListener("click", function () {
      const open = toggle.classList.toggle("is-open");
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });

    nav.querySelectorAll("a").forEach(function (anchor) {
      anchor.addEventListener("click", closeMenu);
    });
  }

  function setupCarousel() {
    const root = document.querySelector("[data-carousel]");
    if (!root) return;

    const ring = root.querySelector("[data-carousel-ring]");
    const dotsWrap = root.querySelector("[data-carousel-dots]");
    const prev = root.querySelector("[data-carousel-prev]");
    const next = root.querySelector("[data-carousel-next]");
    const slides = config.carouselSlides && config.carouselSlides.length
      ? config.carouselSlides
      : [{ name: config.photo || "Foto1", alt: config.photoAlt || "Fotografia", caption: "" }];

    const count = slides.length;
    let index = 0;
    let timer = null;
    let paused = false;
    const spacing = window.matchMedia("(max-width: 720px)").matches ? 118 : 158;

    const folder = config.photosFolder || "images/";
    const extensions = config.photoExtensions && config.photoExtensions.length
      ? config.photoExtensions
      : ["jpg", "jpeg", "png", "webp"];

    // Gera os caminhos possíveis (ex.: Foto1.jpg, foto1.jpg, Foto1.png...)
    function buildCandidates(slide) {
      if (slide.image) return [slide.image];
      const base = String(slide.name || "");
      const names = [base, base.toLowerCase(), base.charAt(0).toUpperCase() + base.slice(1).toLowerCase()]
        .filter(function (n, idx, arr) { return n && arr.indexOf(n) === idx; });
      const list = [];
      extensions.forEach(function (ext) {
        names.forEach(function (n) {
          list.push(folder + n + "." + ext);
        });
      });
      return list;
    }

    // Tenta carregar cada caminho até um funcionar
    function loadImage(img, candidates) {
      let attempt = 0;
      img.addEventListener("error", function () {
        attempt += 1;
        if (attempt < candidates.length) {
          img.src = candidates[attempt];
        } else {
          console.warn("Foto não encontrada. Caminhos testados:", candidates);
        }
      });
      img.src = candidates[0];
    }

    slides.forEach(function (slide, i) {
      const figure = document.createElement("figure");
      figure.className = "carousel-card";

      const img = document.createElement("img");
      img.alt = slide.alt || "Fotografia";
      img.loading = "eager";
      loadImage(img, buildCandidates(slide));

      figure.appendChild(img);

      if (slide.caption) {
        const caption = document.createElement("figcaption");
        caption.textContent = slide.caption;
        figure.appendChild(caption);
      }
      ring.appendChild(figure);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Ir para o slide " + (i + 1));
      dot.addEventListener("click", function () {
        goTo(i);
      });
      dotsWrap.appendChild(dot);
    });

    const cards = ring.querySelectorAll(".carousel-card");

    function wrappedOffset(i) {
      let offset = i - index;
      if (offset > count / 2) offset -= count;
      if (offset < -count / 2) offset += count;
      return offset;
    }

    function render() {
      cards.forEach(function (card, i) {
        const offset = wrappedOffset(i);
        const x = offset * spacing;
        const z = -Math.abs(offset) * 130;
        const rot = offset * -32;
        card.style.transform = "translateX(" + x + "px) translateZ(" + z + "px) rotateY(" + rot + "deg)";
        card.style.zIndex = String(20 - Math.abs(offset));
        card.style.opacity = Math.abs(offset) > 1 ? 0.2 : 1;
      });
      dotsWrap.querySelectorAll("button").forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function goTo(nextIndex) {
      index = (nextIndex + count) % count;
      render();
    }

    function start() {
      stop();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      timer = window.setInterval(function () {
        if (!paused) goTo(index + 1);
      }, 4200);
    }

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    prev.addEventListener("click", function () {
      goTo(index - 1);
    });
    next.addEventListener("click", function () {
      goTo(index + 1);
    });

    root.addEventListener("mouseenter", function () {
      paused = true;
    });
    root.addEventListener("mouseleave", function () {
      paused = false;
    });
    root.addEventListener("focusin", function () {
      paused = true;
    });
    root.addEventListener("focusout", function () {
      paused = false;
    });

    window.addEventListener("resize", render);

    document.addEventListener("keydown", function (event) {
      if (!root.contains(document.activeElement) && !root.matches(":hover")) return;
      if (event.key === "ArrowLeft") goTo(index - 1);
      if (event.key === "ArrowRight") goTo(index + 1);
    });

    render();
    start();
  }

  function setupReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -24px 0px" }
    );

    items.forEach(function (item) {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        item.classList.add("is-visible");
      } else {
        observer.observe(item);
      }
    });
  }

  function setupContactButtons() {
    const whatsappBtn = document.querySelector('[data-link="whatsapp"]');
    const emailBtn = document.querySelector('[data-link="email"]');

    if (whatsappBtn && whatsappBtn.tagName === "A") {
      whatsappBtn.addEventListener("click", function () {
        if (config.whatsapp) {
          const defaultText = encodeURIComponent(
            "Olá Gustavo, vim pelo seu portfólio e gostaria de conversar."
          );
          whatsappBtn.setAttribute(
            "href",
            "https://wa.me/" + config.whatsapp + "?text=" + defaultText
          );
        }
      });
    }

    if (emailBtn && emailBtn.tagName === "A") {
      emailBtn.addEventListener("click", function () {
        if (config.email) {
          emailBtn.setAttribute("href", "mailto:" + config.email);
        }
      });
    }
  }

  buildContactLinks();
  setupContactButtons();
  setupHeader();
  setupCarousel();
  setupReveal();
})();