document.addEventListener("DOMContentLoaded", () => {
  const projectsContainer = document.querySelector(".projects-container");
  const header = document.querySelector("header");
  const chin = document.querySelector(".chin");

  if (!projectsContainer) {
    console.error("Projects container not found!");
    return;
  }

  // Ensure snap happens only once
  let hasSnapped = false;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;

    // Add or remove scrolled class based on scroll position
    if (scrollY > 60) {
      header.classList.add("scrolled");
      chin.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
      chin.classList.remove("scrolled");
    }

    // Snap to the projects container
    // if (!hasSnapped && scrollY > viewportHeight / 2) {
    //   hasSnapped = true; // Prevent repeated snapping
    //   projectsContainer.scrollIntoView({
    //     behavior: "smooth",
    //   });
    // }
  });
});
