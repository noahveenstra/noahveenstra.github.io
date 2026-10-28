(() => {
  const root = document.documentElement;
  const key = "noah-theme";
  const systemKey = "noah-theme-system";
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const systemColor = () => systemTheme.matches ? "dark" : "light";
  const readOverride = () => {
    try {
      const saved = localStorage.getItem(key);
      // A manual choice only applies while the device theme stays the same.
      return (saved === "light" || saved === "dark") && localStorage.getItem(systemKey) === systemColor() ? saved : null;
    } catch { return null; }
  };
  let override = readOverride();
  const button = document.createElement("button");
  button.className = "theme-toggle";
  button.type = "button";
  button.innerHTML = '<span aria-hidden="true">◐</span>';

  function sync() {
    const theme = override || systemColor();
    root.dataset.theme = theme;
    document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
      meta.content = theme === "dark" ? "#181818" : "#f8f8f7";
    });
    const isDark = theme === "dark";
    button.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    button.setAttribute("aria-pressed", String(isDark));
    button.firstElementChild.textContent = isDark ? "☼" : "◐";
  }

  button.addEventListener("click", () => {
    override = root.dataset.theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(systemKey, systemColor());
      localStorage.setItem(key, override);
    } catch { /* The button still works without browser storage. */ }
    sync();
  });

  function followSystem() {
    override = null;
    try {
      localStorage.removeItem(key);
      localStorage.removeItem(systemKey);
    } catch {}
    sync();
  }

  // Resolve colors before rendering and follow device changes automatically.
  sync();
  if (systemTheme.addEventListener) systemTheme.addEventListener("change", followSystem);
  else systemTheme.addListener(followSystem);

  window.addEventListener("storage", event => {
    if (event.key !== key && event.key !== systemKey && event.key !== null) return;
    override = readOverride();
    sync();
  });
  window.addEventListener("pageshow", event => {
    if (event.persisted) override = readOverride();
    sync();
  });
  document.addEventListener("DOMContentLoaded", () => document.body.append(button), { once: true });
})();
