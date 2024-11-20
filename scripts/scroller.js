document.addEventListener("DOMContentLoaded", () => {
  const projectsContainer = document.querySelector(".projects-container");

  if (!projectsContainer) {
    console.error("Projects container not found!");
    return;
  }

  // Ensure snap happens only once
  let hasSnapped = false;

  window.addEventListener("scroll", () => {
    if (hasSnapped) return; // Prevent repeated snapping

    hasSnapped = true; // Set the flag immediately

    // Snap to the projects container
    projectsContainer.scrollIntoView({
      behavior: "smooth",
    });
  });
});
