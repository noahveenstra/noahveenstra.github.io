document.addEventListener("DOMContentLoaded", () => {
  // Select all cells
  const cells = document.querySelectorAll(".cell");

  // Add hover event listeners to each cell
  cells.forEach((cell) => {
    const desc = cell.querySelector(".desc");
    const title = cell.querySelector(".title");
    if (desc) {
      // Hide the .desc initially
      desc.style.opacity = "0";
      desc.style.transition = "opacity 0.3s ease";

      // Show the .desc on hover
      cell.addEventListener("mouseenter", () => {
        cell.style.background = "#121212";
        desc.style.opacity = "1";
        title.style.color = "#f9f6ee";
        title.style.color = "#f9f6ee";
      });

      // Hide the .desc when hover ends
      cell.addEventListener("mouseleave", () => {
        cell.style.background = "#f9f6ee";
        desc.style.opacity = "0";
        title.style.color = "f9f6ee";
      });
    }
  });
});
