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

  let groups = [];
  let current = -1;

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

  function measureGroups() {
    groups = [];
    if (!marks.length) return;
    let start = 0;
    for (let i = 0; i < marks.length; i++) {
      const split = i === marks.length - 1
        || marks[i + 1].getBoundingClientRect().top - marks[i].getBoundingClientRect().bottom >= 24;
      if (!split) continue;
      const group = [];
      for (let j = start; j <= i; j++) group.push(j);
      groups.push(group);
      start = i + 1;
    }
  }

  function clearPlacement() {
    shots.forEach((shot) => {
      shot.style.top = "";
      shot.style.height = "";
      shot.style.bottom = "";
    });
  }

  function placeGroup(indices) {
    const n = indices.length;
    if (n <= 1) {
      indices.forEach((i) => {
        shots[i].style.top = "";
        shots[i].style.height = "";
        shots[i].style.bottom = "";
      });
      return;
    }
    const top0 = 108;
    const avail = window.innerHeight - top0 - 36;
    const gap = 16;
    const slice = (avail - gap * (n - 1)) / n;
    indices.forEach((i, k) => {
      const shot = shots[i];
      shot.style.top = `${top0 + k * (slice + gap)}px`;
      shot.style.height = `${slice}px`;
      shot.style.bottom = "auto";
    });
  }

  function updateCurrent() {
    if (!wideQuery.matches || groups.length === 0) {
      if (!wideQuery.matches) {
        clearPlacement();
        shots.forEach((shot) => shot.classList.remove("is-current"));
        current = -1;
      }
      return;
    }
    const line = window.innerHeight * 0.4;
    let active = 0;
    for (let g = 0; g < groups.length; g++) {
      if (marks[groups[g][0]].getBoundingClientRect().top <= line) active = g;
    }
    if (active === current) return;
    current = active;
    const on = new Set(groups[active]);
    placeGroup(groups[active]);
    shots.forEach((shot, i) => shot.classList.toggle("is-current", on.has(i)));
  }

  function relayout() {
    current = -1;
    if (wideQuery.matches) measureGroups();
    else groups = marks.map((_, i) => [i]);
    updateCurrent();
  }

  wideQuery.addEventListener("change", () => {
    bindReveals();
    relayout();
  });
  window.addEventListener("scroll", updateCurrent, { passive: true });
  window.addEventListener("resize", () => {
    if (!wideQuery.matches) {
      relayout();
      return;
    }
    measureGroups();
    if (current >= 0 && current < groups.length) placeGroup(groups[current]);
    else updateCurrent();
  });

  bindReveals();
  if (wideQuery.matches) measureGroups();
  if (reduce) updateCurrent();
  else requestAnimationFrame(() => requestAnimationFrame(updateCurrent));
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(relayout);
  }
})();
