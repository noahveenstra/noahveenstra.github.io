// Select all .cell elements
const cells = document.querySelectorAll(".cell");

// Function to handle mousemove event
function handleMove(e) {
  // Calculate the position of the mouse relative to the center of the element
  const xTilt = (e.offsetY - this.offsetHeight / 2) / 30;
  const yTilt = (e.offsetX - this.offsetWidth / 2) / 30;

  // Select the img element inside this .cell
  const img = this.querySelector("img");

  // Set the transform style to create a tilt effect
  img.style.transform = `rotateX(${xTilt}deg) rotateY(${yTilt}deg)`;
  // Set the box-shadow to enhance the 3D effect
  img.style.boxShadow = `${yTilt}px ${xTilt}px 15px rgba(0, 0, 0, 0.5)`;
}

// Add the event listener to each .cell
cells.forEach((cell) => {
  cell.addEventListener("mousemove", handleMove);
});

// Function to handle mouseout event
function handleOut() {
  const img = this.querySelector("img");
  img.style.transform = "";
  img.style.boxShadow = "";
}

// Add the event listener to each .cell
cells.forEach((cell) => {
  cell.addEventListener("mouseout", handleOut);
});
