(() => {
  const root = document.documentElement;
  const key = "noah-theme";
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const normalize = value => value === "light" || value === "dark" ? value : "system";
  const readPreference = () => {
    try { return normalize(localStorage.getItem(key)); }
    catch { return "system"; }
  };
  let preference = readPreference();
  let control;

  function sync() {
    const theme = preference === "system" ? (systemTheme.matches ? "dark" : "light") : preference;
    root.dataset.theme = theme;
    document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
      meta.content = theme === "dark" ? "#181818" : "#f8f8f7";
    });
    if (control) {
      control.value = preference;
      control.title = preference === "system" ? `Following your system’s ${theme} theme` : `Using ${theme} theme`;
    }
  }

  // Apply before the body renders, then keep listening while the page is open.
  sync();
  if (systemTheme.addEventListener) systemTheme.addEventListener("change", sync);
  else systemTheme.addListener(sync);

  window.addEventListener("storage", event => {
    if (event.storageArea !== localStorage || (event.key !== key && event.key !== null)) return;
    preference = event.key === null ? "system" : normalize(event.newValue);
    sync();
  });
  window.addEventListener("pageshow", event => {
    if (event.persisted) preference = readPreference();
    sync();
  });

  document.addEventListener("DOMContentLoaded", () => {
    control = document.createElement("select");
    control.className = "theme-select";
    control.setAttribute("aria-label", "Color theme");
    for (const [value, label] of [["system", "System"], ["light", "Light"], ["dark", "Dark"]]) {
      control.add(new Option(label, value));
    }
    control.addEventListener("change", () => {
      preference = normalize(control.value);
      try {
        if (preference === "system") localStorage.removeItem(key);
        else localStorage.setItem(key, preference);
      } catch { /* The selected theme still works when storage is unavailable. */ }
      sync();
    });
    sync();
    document.body.append(control);
  }, { once: true });
})();
