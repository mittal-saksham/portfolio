/* Vanilla behaviour for the static portfolio — no framework.
   Replaces the old dc-runtime logic class. Every page loads this with `defer`;
   each feature is guarded so pages that lack an element simply skip it. */
(function () {
  "use strict";

  var root = document.documentElement; // theme lives on <html>
  var SUN = '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M5 5l1.5 1.5M17.5 17.5 19 19M2 12h2M20 12h2M5 19l1.5-1.5M17.5 6.5 19 5"></path>';
  var MOON = '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"></path>';

  function setIcon(which) {
    var svg = which === "moon" ? MOON : SUN;
    var icons = document.querySelectorAll(".sm-themeicon");
    for (var i = 0; i < icons.length; i++) icons[i].innerHTML = svg;
  }

  // Reflect whatever the pre-paint script already applied.
  setIcon(root.getAttribute("data-theme") === "light" ? "moon" : "sun");

  function toggleTheme() {
    var light = root.getAttribute("data-theme") === "light";
    if (light) root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", "light");
    setIcon(light ? "sun" : "moon");
    try { localStorage.setItem("sm-theme", light ? "dark" : "light"); } catch (e) {}
    if (updateGlow) updateGlow(window.scrollY || 0);
  }

  // ---- mobile nav ---------------------------------------------------------
  var navmenu = document.getElementById("sm-navmenu");
  var navtoggle = document.getElementById("sm-navtoggle");
  function setMenu(open) {
    if (!navmenu) return;
    navmenu.dataset.open = open ? "1" : "0";
    if (navtoggle) navtoggle.setAttribute("aria-expanded", open ? "true" : "false");
  }
  function toggleMenu() { setMenu(navmenu && navmenu.dataset.open !== "1"); }
  function closeMenu() { setMenu(false); }

  // ---- copy email ---------------------------------------------------------
  var EMAIL = "sakshammital@gmail.com";
  var toastTimer;
  function showToast(msg) {
    var el = document.getElementById("sm-toast");
    if (!el) return;
    el.textContent = msg;
    el.style.opacity = "1";
    el.style.transform = "translateX(-50%) translateY(0)";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.style.opacity = "0";
      el.style.transform = "translateX(-50%) translateY(12px)";
    }, 2000);
  }
  function copyFallback() {
    try {
      var t = document.createElement("textarea");
      t.value = EMAIL; t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.select();
      document.execCommand("copy"); document.body.removeChild(t);
      showToast("Email copied to clipboard");
    } catch (err) { showToast("Copy failed — email me at " + EMAIL); }
  }
  function copyEmail(e) {
    if (e) e.preventDefault();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL)
        .then(function () { showToast("Email copied to clipboard"); })
        .catch(copyFallback);
    } else copyFallback();
  }

  function toTop() { window.scrollTo({ top: 0, behavior: "smooth" }); }

  // ---- delegated actions --------------------------------------------------
  var ACTIONS = { themeToggle: toggleTheme, menuToggle: toggleMenu, closeMenu: closeMenu, copyEmail: copyEmail, toTopClick: toTop };
  document.addEventListener("click", function (e) {
    var el = e.target.closest ? e.target.closest("[data-action]") : null;
    if (!el) {
      // click outside an open menu closes it
      if (navmenu && navmenu.dataset.open === "1" &&
          !navmenu.contains(e.target) && !(navtoggle && navtoggle.contains(e.target))) closeMenu();
      return;
    }
    var fn = ACTIONS[el.getAttribute("data-action")];
    if (fn) fn(e);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  // ---- current year -------------------------------------------------------
  var yr = document.getElementById("sm-yr");
  if (yr) yr.textContent = new Date().getFullYear();

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- reveal on scroll ---------------------------------------------------
  var reveals = document.querySelectorAll("[data-reveal]");
  if (reveals.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      for (var i = 0; i < reveals.length; i++) reveals[i].classList.add("sm-revealed");
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var sibs = [].slice.call(en.target.parentElement.querySelectorAll("[data-reveal]"));
          en.target.style.transitionDelay = (Math.max(0, sibs.indexOf(en.target)) % 6) * 0.08 + "s";
          en.target.classList.add("sm-revealed");
          io.unobserve(en.target);
        });
      }, { threshold: 0.15 });
      for (var j = 0; j < reveals.length; j++) io.observe(reveals[j]);
    }
  }

  // ---- ambient glows (index only) ----------------------------------------
  var glows = null, updateGlow = null;
  (function setupGlows() {
    var ids = ["sm-g-tl", "sm-g-tr", "sm-g-bl", "sm-g-br"];
    var cfg = [
      { p: 0.0, f: 0.83, f2: 0.37, min: 0.02, max: 0.50, drift: 26 },
      { p: 1.7, f: 1.27, f2: 0.51, min: 0.02, max: 0.42, drift: -32 },
      { p: 3.4, f: 0.61, f2: 0.43, min: 0.02, max: 0.38, drift: 30 },
      { p: 5.0, f: 1.09, f2: 0.29, min: 0.02, max: 0.46, drift: -24 }
    ];
    glows = ids.map(function (id, i) {
      var el = document.getElementById(id);
      return el ? Object.assign({ el: el }, cfg[i]) : null;
    }).filter(Boolean);
    if (!glows.length) { glows = null; return; }
    updateGlow = function (y) {
      var s = (y || 0) / 520;
      glows.forEach(function (g) {
        var v = 0.5 + 0.5 * Math.sin(s * g.f + g.p);
        v = v * 0.7 + (0.5 + 0.5 * Math.sin(s * g.f2 + g.p * 1.7)) * 0.3;
        var lit = Math.pow(v, 2.6);
        g.el.style.opacity = (g.min + lit * (g.max - g.min)).toFixed(3);
        g.el.style.transform = "translate(" + ((lit - 0.4) * g.drift).toFixed(1) + "px," +
          ((lit - 0.4) * g.drift * 0.5).toFixed(1) + "px) scale(" + (0.85 + lit * 0.3).toFixed(3) + ")";
      });
    };
    updateGlow(window.scrollY || 0);
  })();

  // ---- scroll spy / header / back-to-top / timeline (index only) ---------
  (function setupScroll() {
    var header = document.getElementById("sm-header");
    var totop = document.getElementById("sm-totop");
    var navpill = document.getElementById("sm-navpill");
    var links = [].slice.call(document.querySelectorAll("[data-nav]"));
    var secs = links.map(function (l) { return document.getElementById(l.getAttribute("data-nav")); });
    var tlWrap = document.getElementById("sm-timeline-wrap");
    var tlFill = document.getElementById("sm-tl-fill");
    var tlNodes = [].slice.call(document.querySelectorAll(".sm-tl-node"));
    if (!header && !totop && !links.length && !glows) return;
    var ticking = false;
    function onScroll() {
      var y = window.scrollY;
      if (header) header.style.borderBottomColor = y > 10 ? "var(--border)" : "transparent";
      if (totop) {
        var show = y > 600;
        totop.style.opacity = show ? "1" : "0";
        totop.style.pointerEvents = show ? "auto" : "none";
        totop.style.transform = show ? "translateY(0)" : "translateY(12px)";
      }
      var cur = 0;
      secs.forEach(function (s, i) { if (s && s.offsetTop - 120 <= y) cur = i; });
      links.forEach(function (l, i) {
        var a = i === cur;
        l.style.color = a ? "var(--on-orange)" : "var(--fg-body)";
        if (a && navpill && l.offsetWidth) {
          navpill.style.opacity = "1";
          navpill.style.transform = "translateX(" + l.offsetLeft + "px)";
          navpill.style.width = l.offsetWidth + "px";
        }
      });
      var vh = window.innerHeight;
      if (tlWrap && tlFill) {
        var rc = tlWrap.getBoundingClientRect();
        var total = rc.height || 1;
        var passed = Math.max(0, Math.min(total, vh * 0.55 - rc.top));
        tlFill.style.height = (passed / total * 100) + "%";
      }
      tlNodes.forEach(function (n) {
        var nr = n.getBoundingClientRect();
        var on = nr.top < vh * 0.6;
        n.style.borderColor = on ? "var(--orange)" : "var(--border-strong)";
        n.style.boxShadow = on ? "0 0 0 5px color-mix(in srgb,var(--orange) 18%,transparent)" : "none";
      });
      if (updateGlow && !ticking) {
        ticking = true;
        requestAnimationFrame(function () { updateGlow(y); ticking = false; });
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    setTimeout(onScroll, 60);
  })();

  // ---- infinite-drag carousels -------------------------------------------
  function setupCarousel(trackId, viewportId, speed) {
    var track = document.getElementById(trackId);
    var viewport = document.getElementById(viewportId);
    if (!track || !viewport || track.dataset.carousel) return;
    track.dataset.carousel = "1";
    var originals = [].slice.call(track.children);
    function addClones() {
      originals.forEach(function (n) {
        var c = n.cloneNode(true);
        c.setAttribute("aria-hidden", "true");
        [].slice.call(c.querySelectorAll("a,button,[tabindex]")).forEach(function (el) { el.setAttribute("tabindex", "-1"); });
        track.appendChild(c);
      });
    }
    addClones(); addClones();
    var setWidth = 0;
    function measure() { setWidth = track.scrollWidth / 3; }
    measure();
    window.addEventListener("resize", measure);
    var BASE = speed || 0.45, FRICTION = 0.06;
    var offset = setWidth, velocity = BASE;
    var hovering = false, dragging = false;
    var lastX = 0, lastT = 0, dragVel = 0, movedDist = 0;
    function tick() {
      if (!dragging && !hovering) { offset += velocity; velocity += (BASE - velocity) * FRICTION; }
      if (offset >= setWidth * 2) offset -= setWidth;
      if (offset < 0) offset += setWidth;
      track.style.transform = "translateX(" + (-offset) + "px)";
      requestAnimationFrame(tick);
    }
    if (!reduce) requestAnimationFrame(tick);
    viewport.addEventListener("pointerenter", function () { hovering = true; });
    viewport.addEventListener("pointerleave", function () { hovering = false; });
    viewport.addEventListener("pointerdown", function (e) {
      dragging = true; viewport.style.cursor = "grabbing";
      viewport.setPointerCapture(e.pointerId);
      lastX = e.clientX; lastT = performance.now(); dragVel = 0; movedDist = 0;
    });
    viewport.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX;
      var now = performance.now(), dt = Math.max(now - lastT, 1);
      offset -= dx; movedDist += Math.abs(dx);
      dragVel = -dx / dt * 16; lastX = e.clientX; lastT = now;
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false; viewport.style.cursor = "grab";
      velocity = Math.abs(dragVel) > BASE ? dragVel : BASE;
    }
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    track.addEventListener("click", function (e) {
      if (movedDist > 6) { e.preventDefault(); e.stopPropagation(); }
    }, true);
  }
  setupCarousel("sm-proj-track", "sm-proj-viewport", 0.45);
  setupCarousel("sm-course-track", "sm-course-viewport", 0.35);

  // Hide the back-from-bfcache transition (kept for parity; overlay removed).
  window.addEventListener("pageshow", function () { closeMenu(); });
})();
