(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wideQuery = matchMedia("(min-width: 1180px)");
  const shots = [...document.querySelectorAll(".project__shot")];
  const marks = shots.map((shot) => {
    const mark = document.createElement("div");
    mark.className = "project__mark";
    shot.before(mark);
    return mark;
  });

  function bindReveals() {
    if (reduce) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
      return;
    }
    document.querySelectorAll(".reveal").forEach((el) => {
      if (el.dataset.watched === "1") return;
      if (wideQuery.matches && el.classList.contains("project__shot")) return;
      el.dataset.watched = "1";
      const io = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        io.disconnect();
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("is-in")));
      }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });
      io.observe(el);
    });
  }

  let current = -1;
  function updateCurrent() {
    if (!wideQuery.matches || shots.length === 0) return;
    const line = window.innerHeight * 0.4;
    let active = 0;
    for (let i = 0; i < marks.length; i++) {
      if (marks[i].getBoundingClientRect().top <= line) active = i;
    }
    if (active === current) return;
    current = active;
    shots.forEach((shot, i) => shot.classList.toggle("is-current", i === active));
  }

  function spaceRuns() {
    marks.forEach((mark) => {
      mark.style.minHeight = "";
    });
    if (!wideQuery.matches) return;
    for (let i = 0; i < marks.length - 1; i++) {
      const gap = marks[i + 1].getBoundingClientRect().top - marks[i].getBoundingClientRect().bottom;
      if (gap < 36) marks[i].style.minHeight = "68vh";
    }
  }

  wideQuery.addEventListener("change", () => {
    current = -1;
    spaceRuns();
    bindReveals();
    updateCurrent();
  });
  window.addEventListener("scroll", updateCurrent, { passive: true });
  window.addEventListener("resize", () => {
    spaceRuns();
    current = -1;
    updateCurrent();
  });

  bindReveals();
  spaceRuns();
  if (reduce) updateCurrent();
  else requestAnimationFrame(() => requestAnimationFrame(updateCurrent));
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      spaceRuns();
      current = -1;
      updateCurrent();
    });
  }
})();
