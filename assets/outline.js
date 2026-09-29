(() => {
  const nav = document.querySelector(".page-nav");
  if (!nav) return;
  const marks = [...nav.querySelectorAll("a")].map((link) => ({
    link,
    heading: document.getElementById(link.hash.slice(1))
  })).filter((item) => item.heading);

  const sync = () => {
    const line = 128;
    let active = null;
    for (const item of marks) {
      if (item.heading.getBoundingClientRect().top <= line) active = item;
    }
    if (!active && marks.length) active = marks[0];
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40) {
      active = marks[marks.length - 1];
    }
    const id = active ? active.heading.id : "";
    for (const item of marks) {
      if (item.heading.id === id) item.link.setAttribute("aria-current", "location");
      else item.link.removeAttribute("aria-current");
      delete item.link.dataset.section;
    }
    nav.querySelectorAll("li").forEach((li) => li.classList.remove("is-open"));
    clearTimeout(sync.hold);
    if (!active) return;
    const li = active.link.parentElement;
    const parent = li.parentElement.closest("li");
    li.classList.add("is-open");
    if (parent) {
      parent.classList.add("is-open");
      const parentLink = parent.querySelector(":scope > a");
      if (parentLink && parentLink !== active.link) parentLink.dataset.section = "true";
    }
    const keepInView = () => {
      const linkRect = active.link.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      if (linkRect.top < navRect.top + 4) nav.scrollTop -= navRect.top + 4 - linkRect.top;
      else if (linkRect.bottom > navRect.bottom - 4) nav.scrollTop += linkRect.bottom - (navRect.bottom - 4);
    };
    keepInView();
    if (parent) sync.hold = setTimeout(keepInView, 340);
  };

  let frame = 0;
  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      sync();
    });
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("hashchange", schedule);
  for (const { link } of marks) {
    link.addEventListener("click", () => {
      const heading = document.getElementById(link.hash.slice(1));
      heading?.closest(".reveal")?.classList.add("is-in");
    });
  }
  sync();
})();
