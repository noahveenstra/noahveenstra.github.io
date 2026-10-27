(() => {
  const TERMS = window.TERM_DEFS;
  const KEY = window.TERM_KEY || "known-terms";
  if (!TERMS || !document.querySelector(".term-bank")) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  let known = new Set();
  try {
    known = new Set(JSON.parse(localStorage.getItem(KEY) || "[]"));
  } catch (error) {
    known = new Set();
  }

  const tip = document.createElement("div");
  tip.className = "def-tip";
  tip.id = "def-tip";
  tip.setAttribute("role", "dialog");
  tip.setAttribute("aria-labelledby", "def-tip-title");
  tip.hidden = true;
  const title = document.createElement("strong");
  title.id = "def-tip-title";
  const body = document.createElement("div");
  body.className = "def-tip__body";
  const know = document.createElement("button");
  know.type = "button";
  know.className = "def-tip__know";
  know.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" stroke-width="1.25"/><path d="M5 8.2 7.1 10.2 11 6" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg><span></span>';
  const knowLabel = know.querySelector("span");
  tip.append(title, body, know);
  document.body.appendChild(tip);

  let current = null;
  let pinned = false;
  let hideTimer = 0;
  let hideToken = 0;
  let dismissGen = 0;
  let settling = false;

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify([...known]));
    } catch (error) {}
  }

  function markKnown(btn) {
    btn.classList.add("is-known");
    btn.tabIndex = -1;
    btn.classList.remove("is-on");
    btn.removeAttribute("aria-describedby");
    btn.setAttribute("aria-expanded", "false");
  }

  function unmark(btn) {
    btn.classList.remove("is-known", "is-on");
    btn.removeAttribute("tabindex");
    btn.removeAttribute("aria-describedby");
    btn.setAttribute("aria-expanded", "false");
  }

  const bank = document.querySelector(".term-bank");
  const bankBody = document.getElementById("term-bank-body");
  const bankList = bank.querySelector("ul");
  const bankAll = bank.querySelector(".term-bank__all");
  const bankToggle = bank.querySelector(".term-bank__toggle");

  function setOpen(open) {
    if (bank.hidden) open = false;
    bank.classList.toggle("is-open", open);
    bankToggle.setAttribute("aria-expanded", open ? "true" : "false");
    bankBody.inert = !open;
  }

  function renderBank() {
    const stay = bank.classList.contains("is-open");
    bankList.replaceChildren();
    const ids = [...known].filter((id) => TERMS[id]);
    bank.hidden = ids.length === 0;
    bankAll.hidden = ids.length < 2;
    for (const id of ids) {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = TERMS[id][0];
      button.setAttribute("aria-label", "Bring “" + TERMS[id][0] + "” tips back");
      button.addEventListener("click", () => restore(id));
      li.append(button);
      bankList.append(li);
    }
    if (bank.hidden) setOpen(false);
    else if (stay) setOpen(true);
  }

  function restore(id) {
    dismissGen += 1;
    settling = false;
    if (current && current.getAttribute("data-term") === id) hide(true);
    known.delete(id);
    save();
    document.querySelectorAll('.def[data-term="' + id + '"]').forEach(unmark);
    renderBank();
    if (!bank.hidden && bank.classList.contains("is-open")) {
      const next = bankList.querySelector("button") || bankToggle;
      next.focus({ preventScroll: true });
    }
  }

  function place(btn) {
    tip.classList.remove("is-above");
    const r = btn.getBoundingClientRect();
    const w = tip.offsetWidth;
    const h = tip.offsetHeight;
    let left = r.left + r.width / 2 - w / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - w - 12));
    const box = bank.hidden ? null : bank.getBoundingClientRect();
    const hits = (t) => box && left < box.right && left + w > box.left && t < box.bottom && t + h > box.top;
    let top = r.bottom + 8;
    if (top + h > window.innerHeight - 10 || hits(top)) {
      top = Math.max(10, r.top - h - 8);
      tip.classList.add("is-above");
    }
    tip.style.left = left + "px";
    tip.style.top = top + "px";
  }

  function release() {
    if (!current) return;
    current.classList.remove("is-on");
    current.removeAttribute("aria-describedby");
    current.setAttribute("aria-expanded", "false");
    current = null;
  }

  function show(btn, pin) {
    if (!btn || btn.classList.contains("is-known")) return;
    const id = btn.getAttribute("data-term");
    const term = TERMS[id];
    if (!term || known.has(id)) return;
    window.clearTimeout(hideTimer);
    const showToken = ++hideToken;
    dismissGen += 1;
    settling = false;
    know.classList.remove("is-done");
    if (current && current !== btn) {
      current.classList.remove("is-on");
      current.setAttribute("aria-expanded", "false");
    }
    current = btn;
    pinned = !!pin;
    title.textContent = term[0];
    body.textContent = term[1];
    knowLabel.textContent = "Hide the other “" + term[0] + "” tips";
    btn.classList.add("is-on");
    btn.setAttribute("aria-describedby", "def-tip");
    btn.setAttribute("aria-expanded", "true");
    const wasOpen = tip.classList.contains("is-in") && !tip.hidden;
    tip.hidden = false;
    place(btn);
    if (wasOpen || reduce) {
      tip.classList.add("is-in");
      return;
    }
    tip.classList.remove("is-in");
    void tip.offsetWidth;
    requestAnimationFrame(() => {
      if (showToken !== hideToken) return;
      tip.classList.add("is-in");
    });
  }

  function hide(force) {
    if (settling) return;
    if (pinned && !force) return;
    window.clearTimeout(hideTimer);
    pinned = false;
    const token = ++hideToken;
    tip.classList.remove("is-in");
    release();
    const finish = () => {
      if (token !== hideToken) return;
      tip.hidden = true;
      know.classList.remove("is-done");
    };
    if (reduce || tip.hidden) {
      finish();
      return;
    }
    tip.addEventListener("transitionend", (event) => {
      if (event.target !== tip || event.propertyName !== "opacity") return;
      finish();
    }, { once: true });
    window.setTimeout(finish, 240);
  }

  document.querySelectorAll(".def").forEach((btn) => {
    const id = btn.getAttribute("data-term");
    btn.setAttribute("aria-expanded", "false");
    if (known.has(id)) markKnown(btn);
    if (fine) {
      btn.addEventListener("pointerenter", () => show(btn, false));
      btn.addEventListener("pointerleave", () => {
        if (settling) return;
        hideTimer = window.setTimeout(() => hide(false), 140);
      });
    }
    btn.addEventListener("focus", () => show(btn, false));
    btn.addEventListener("focusout", (event) => {
      if (tip.contains(event.relatedTarget)) return;
      if (!pinned) hide(false);
    });
    btn.addEventListener("keydown", (event) => {
      if (event.key !== "Tab" || event.shiftKey || tip.hidden || current !== btn) return;
      event.preventDefault();
      know.focus();
    });
    btn.addEventListener("click", (event) => {
      if (fine || btn.classList.contains("is-known")) return;
      event.preventDefault();
      if (current === btn && pinned) hide(true);
      else show(btn, true);
    });
  });

  know.addEventListener("click", () => {
    if (!current || settling) return;
    const id = current.getAttribute("data-term");
    const word = current;
    known.add(id);
    save();
    renderBank();
    settling = true;
    window.clearTimeout(hideTimer);
    const gen = ++dismissGen;
    know.classList.add("is-done");
    knowLabel.textContent = "Hidden";
    document.querySelectorAll('.def[data-term="' + id + '"]').forEach(markKnown);
    window.setTimeout(() => {
      if (gen !== dismissGen) return;
      settling = false;
      pinned = false;
      hide(true);
      if (document.activeElement === know) word.focus({ preventScroll: true });
    }, reduce ? 0 : 280);
  });
  know.addEventListener("focusout", (event) => {
    if (settling || event.relatedTarget === current) return;
    if (!pinned) hide(false);
  });
  know.addEventListener("keydown", (event) => {
    if (event.key === "Tab" && event.shiftKey && current) {
      event.preventDefault();
      current.focus({ preventScroll: true });
    }
  });

  tip.addEventListener("pointerenter", () => window.clearTimeout(hideTimer));
  tip.addEventListener("pointerleave", () => {
    if (pinned || settling) return;
    hideTimer = window.setTimeout(() => hide(false), 140);
  });
  document.addEventListener("pointerdown", (event) => {
    if (tip.hidden || settling) return;
    const t = event.target;
    if (t.closest && (t.closest(".def") || t.closest(".def-tip"))) return;
    hide(true);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    hide(true);
    if (!bank.classList.contains("is-open")) return;
    setOpen(false);
    if (bank.contains(document.activeElement)) bankToggle.focus({ preventScroll: true });
  });
  window.addEventListener("scroll", () => {
    if (!settling) hide(true);
  }, { passive: true });

  bankAll.addEventListener("click", () => {
    dismissGen += 1;
    settling = false;
    if (current) hide(true);
    known.clear();
    save();
    document.querySelectorAll(".def.is-known").forEach(unmark);
    renderBank();
  });
  if (fine) {
    bank.addEventListener("pointerenter", () => setOpen(true));
    bank.addEventListener("pointerleave", () => {
      if (bankBody.contains(document.activeElement)) return;
      setOpen(false);
    });
    bankToggle.addEventListener("click", () => {
      setOpen(true);
      const first = bankList.querySelector("button");
      if (first) first.focus({ preventScroll: true });
    });
  } else {
    bankToggle.addEventListener("click", () => setOpen(!bank.classList.contains("is-open")));
    document.addEventListener("pointerdown", (event) => {
      if (!bank.contains(event.target)) setOpen(false);
    });
  }
  bank.addEventListener("focusout", (event) => {
    if (bank.contains(event.relatedTarget)) return;
    if (fine && bank.matches(":hover")) return;
    setOpen(false);
  });
  setOpen(false);
  renderBank();
})();
