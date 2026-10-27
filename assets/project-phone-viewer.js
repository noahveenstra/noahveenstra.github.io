(() => {
  const candidates = document.querySelectorAll(".project__figure img, .decision-media img");
  let dialog;

  function getDialog() {
    if (dialog) return dialog;
    dialog = document.createElement("dialog");
    dialog.className = "project-image-viewer";
    dialog.setAttribute("aria-label", "Expanded project image");
    const close = document.createElement("button");
    close.type = "button";
    close.className = "project-image-viewer__close";
    close.setAttribute("aria-label", "Close expanded image");
    close.textContent = "×";
    const image = document.createElement("img");
    image.className = "project-image-viewer__image";
    const caption = document.createElement("p");
    caption.className = "project-image-viewer__caption";
    dialog.append(close, image, caption);
    close.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", event => {
      if (event.target === dialog) dialog.close();
    });
    document.body.append(dialog);
    return dialog;
  }

  function enable(img) {
    if (!img.naturalWidth || img.naturalHeight / img.naturalWidth < 1.12) return;
    const figure = img.closest("figure");
    if (!figure || figure.classList.contains("project-image--tall")) return;
    figure.classList.add("project-image--tall");
    const open = document.createElement("button");
    open.type = "button";
    open.className = "project-image-expand";
    open.textContent = "View larger";
    open.setAttribute("aria-label", "View full size: " + (img.alt || "project image"));
    open.addEventListener("click", () => {
      const viewer = getDialog();
      const viewerImage = viewer.querySelector(".project-image-viewer__image");
      const caption = viewer.querySelector(".project-image-viewer__caption");
      viewerImage.src = img.currentSrc || img.src;
      viewerImage.alt = img.alt || "";
      caption.textContent = img.alt || "";
      caption.hidden = !img.alt;
      viewer.showModal();
    });
    figure.append(open);
  }

  candidates.forEach(img => {
    if (img.complete) enable(img);
    else img.addEventListener("load", () => enable(img), { once: true });
  });
})();
