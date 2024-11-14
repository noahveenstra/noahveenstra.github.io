document.querySelectorAll("a").forEach((link) => {
  // Store the original text and clear the link's content
  const originalText = link.textContent;
  link.textContent = "";

  // Create containers for the original and replacement text
  const originalTextDiv = document.createElement("div");
  originalTextDiv.classList.add("text", "original-text");
  originalTextDiv.textContent = originalText;

  const replacementTextDiv = document.createElement("div");
  replacementTextDiv.classList.add("text", "replacement-text");
  replacementTextDiv.textContent = originalText;

  // Append both text divs to the link
  link.appendChild(originalTextDiv);
  link.appendChild(replacementTextDiv);

  // Create the GSAP timeline for hover animation
  const hoverInTimeline = gsap.timeline({ paused: true });

  // Animate the original text up and out of view
  hoverInTimeline.to(originalTextDiv, {
    y: -30, // Move up out of view
    opacity: 0,
    duration: 0.2,
    ease: "power1.in",
  });

  // Animate the replacement text into the exact position
  hoverInTimeline.to(
    replacementTextDiv,
    {
      y: 0, // Move to the original position
      opacity: 1, // Full opacity for the replacement text
      duration: 0.2,
      ease: "power1.out",
    },
    "-=0.2"
  );

  // Play on hover, reverse on hover out
  link.addEventListener("mouseenter", () => hoverInTimeline.play());
  link.addEventListener("mouseleave", () => hoverInTimeline.reverse());
});
