document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const chin = document.querySelector(".chin");

  // Ensure the elements exist before applying the scroll logic
  if (!header || !chin) {
    console.error("Header or .chin not found in the DOM!");
    return;
  }

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    // Add fixed positioning to header when scrolling
    if (scrollY > 0) {
      header.classList.add("scrolled");
      chin.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
      chin.classList.remove("scrolled");
    }
  });
});
