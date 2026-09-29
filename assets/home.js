(() => {
  const home = document.querySelector(".home");
  const button = document.querySelector(".projects-toggle");
  const panel = document.getElementById("work");
  const openLabel = button.querySelector(".toggle__projects");
  const hideLabel = button.querySelector(".toggle__hide");
  if (!home || !button || !panel) return;

  const duration = 1050;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function measure() {
    button.style.setProperty("--label-a", openLabel.offsetWidth + "px");
    button.style.setProperty("--label-b", hideLabel.offsetWidth + "px");
  }

  measure();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  window.addEventListener("resize", measure);

  function parked(hide) {
    panel.classList.toggle("is-parked", hide);
  }

  function apply(open) {
    home.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", open ? "true" : "false");
    button.setAttribute("aria-label", open ? "Hide Projects" : "Projects");
    if (open) {
      parked(false);
      panel.removeAttribute("inert");
      panel.removeAttribute("aria-hidden");
    } else {
      panel.setAttribute("inert", "");
      panel.setAttribute("aria-hidden", "true");
    }
  }

  function settleClosed() {
    if (home.classList.contains("is-open")) return;
    parked(true);
  }

  let settleTimer = 0;
  function queueSettle() {
    window.clearTimeout(settleTimer);
    if (reduce) {
      settleClosed();
      return;
    }
    settleTimer = window.setTimeout(settleClosed, duration + 80);
  }

  const openNow = location.hash === "#work";
  if (openNow) {
    home.classList.add("is-open");
    parked(false);
  }
  document.documentElement.classList.remove("projects-open");
  apply(openNow);

  button.addEventListener("click", () => {
    const open = !home.classList.contains("is-open");
    if (open) parked(false);
    apply(open);
    if (!open) queueSettle();
    else window.clearTimeout(settleTimer);
    const url = open ? "#work" : location.pathname + location.search;
    history.pushState({ projects: open }, "", url);
  });

  window.addEventListener("popstate", () => {
    const open = location.hash === "#work";
    if (open) parked(false);
    apply(open);
    if (!open) queueSettle();
    else window.clearTimeout(settleTimer);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !home.classList.contains("is-open")) return;
    apply(false);
    queueSettle();
    history.pushState({ projects: false }, "", location.pathname + location.search);
    button.focus();
  });
})();
