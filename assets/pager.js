(() => {
  const title = document.querySelector("h1.project__title");
  const pager = document.querySelector("header.pager");
  const mark = pager && pager.querySelector(":scope > a.mark");
  if (!title || !mark) return;

  const name = title.textContent.replace(/\s+/g, " ").trim();
  if (!name) return;

  const row = document.createElement("div");
  row.className = "mark-row";
  mark.replaceWith(row);
  row.append(mark);

  const story = document.createElement("span");
  story.className = "mark__story";
  story.setAttribute("aria-hidden", "true");

  const clip = document.createElement("span");
  clip.className = "mark__clip";

  const sep = document.createElement("span");
  sep.className = "mark__sep";
  sep.textContent = "/";

  const label = document.createElement("span");
  label.className = "mark__title";
  label.textContent = name;
  label.title = name;

  clip.append(sep, label);
  story.append(clip);
  row.append(story);

  let shown = false;
  let frame = 0;

  const update = () => {
    frame = 0;
    const line = pager.getBoundingClientRect().bottom;
    const titleBottom = title.getBoundingClientRect().bottom;
    const next = shown ? titleBottom < line + 12 : titleBottom < line - 8;
    if (next === shown) return;
    shown = next;
    pager.classList.toggle("is-titled", shown);
  };

  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(update);
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  update();
})();
