(() => {
  const home = document.querySelector("main.home");
  const button = document.querySelector(".projects-toggle");
  const panel = document.getElementById("work-list");
  const stage = home && home.querySelector(".stage");
  const pieces = home ? [...home.querySelectorAll(".piece")] : [];
  const openLabel = button && button.querySelector(".toggle__projects");
  const hideLabel = button && button.querySelector(".toggle__hide");
  if (!home || !button || !panel || !stage || !openLabel || !hideLabel || !window.gsap) return;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wideQuery = matchMedia("(min-width: 1180px)");
  let tl = null;
  let builtWide = wideQuery.matches;
  let dirty = false;

  gsap.defaults({ force3D: false });

  function widths() {
    return {
      closed: openLabel.offsetWidth,
      open: hideLabel.offsetWidth,
    };
  }

  function shiftAmount() {
    const intro = stage.querySelector(".intro");
    const col = intro.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(stage).columnGap) || 0;
    return (col + gap) / 2;
  }

  function park(hide) {
    panel.classList.toggle("is-parked", hide);
  }

  function setAria(open) {
    button.setAttribute("aria-expanded", open ? "true" : "false");
    button.setAttribute("aria-label", open ? "Hide Projects" : "Projects");
    if (open) {
      panel.removeAttribute("inert");
      panel.removeAttribute("aria-hidden");
    } else {
      panel.setAttribute("inert", "");
      panel.setAttribute("aria-hidden", "true");
    }
  }

  function settleOpen() {
    if (wideQuery.matches && home.classList.contains("is-open")) {
      gsap.set(stage, { clearProps: "x,transform" });
    }
  }

  function build(progress) {
    if (tl) tl.kill();
    builtWide = wideQuery.matches;
    const w = widths();

    gsap.set(openLabel, { autoAlpha: 1 });
    gsap.set(hideLabel, { autoAlpha: 0 });
    gsap.set(button, { width: w.closed });

    tl = gsap.timeline({
      paused: true,
      onComplete() {
        settleOpen();
        if (!dirty) return;
        dirty = false;
        requestAnimationFrame(() => build(1));
      },
      onReverseComplete() {
        if (!home.classList.contains("is-open")) park(true);
        if (!dirty) return;
        dirty = false;
        requestAnimationFrame(() => build(home.classList.contains("is-open") ? 1 : 0));
      },
    });

    if (builtWide) {
      gsap.set(stage, { x: shiftAmount() });
      gsap.set(pieces, { autoAlpha: 0, y: 16 });
      tl.to(stage, {
        x: 0,
        duration: 0.78,
        ease: "expo.out",
        easeReverse: "expo.out",
      }, 0);
      tl.to(pieces, {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.038,
        ease: "power3.out",
        easeReverse: "power3.out",
      }, 0.1);
    } else {
      gsap.set(stage, { clearProps: "x,transform" });
      gsap.set(pieces, { autoAlpha: 0, y: 12 });
      tl.to(pieces, {
        autoAlpha: 1,
        y: 0,
        duration: 0.46,
        stagger: 0.032,
        ease: "power3.out",
        easeReverse: "power3.out",
      }, 0.06);
    }

    tl.to(openLabel, {
      autoAlpha: 0,
      duration: 0.18,
      ease: "power2.in",
      easeReverse: "power2.out",
    }, 0.02);
    tl.to(hideLabel, {
      autoAlpha: 1,
      duration: 0.28,
      ease: "power2.out",
      easeReverse: "power2.in",
    }, 0.08);
    tl.to(button, {
      width: w.open,
      duration: 0.42,
      ease: "expo.out",
      easeReverse: "expo.out",
    }, 0);

    tl.progress(progress, true);
    if (progress === 1) settleOpen();
  }

  function go(open, animate) {
    if (open) {
      park(false);
      home.classList.add("is-open");
      setAria(true);
      if (!animate || reduce) {
        tl.progress(1, true);
        settleOpen();
      } else {
        tl.play();
      }
      return;
    }
    if (wideQuery.matches && !stage.style.transform) gsap.set(stage, { x: 0 });
    home.classList.remove("is-open");
    setAria(false);
    if (!animate || reduce) {
      tl.progress(0, true);
      if (wideQuery.matches) gsap.set(stage, { x: shiftAmount() });
      park(true);
    } else {
      tl.reverse();
    }
  }

  const openNow = location.hash === "#work";
  home.classList.toggle("is-open", openNow);
  if (openNow) park(false);
  setAria(openNow);
  build(openNow ? 1 : 0);
  if (!openNow) park(true);
  document.documentElement.classList.remove("projects-open");

  button.addEventListener("click", () => {
    const open = !home.classList.contains("is-open");
    go(open, true);
    const url = open ? "#work" : location.pathname + location.search;
    history.pushState({ projects: open }, "", url);
  });

  window.addEventListener("popstate", () => {
    go(location.hash === "#work", true);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !home.classList.contains("is-open")) return;
    go(false, true);
    history.pushState({ projects: false }, "", location.pathname + location.search);
    button.focus();
  });

  wideQuery.addEventListener("change", () => {
    if (tl && tl.isActive()) {
      dirty = true;
      return;
    }
    build(home.classList.contains("is-open") ? 1 : 0);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      if (tl && tl.isActive()) {
        dirty = true;
        return;
      }
      build(home.classList.contains("is-open") ? 1 : 0);
    });
  }
})();
