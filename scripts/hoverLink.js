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
// document.querySelectorAll("a").forEach((link) => {
//   // Store the original text and clear the link's content
//   const originalText = link.textContent;
//   link.textContent = "";

//   // Create containers for the original and replacement text
//   const originalTextDiv = document.createElement("div");
//   originalTextDiv.classList.add("text", "original-text");

//   const replacementTextDiv = document.createElement("div");
//   replacementTextDiv.classList.add("text", "replacement-text");

//   // Split text into individual characters and append to each container
//   originalText.split("").forEach((char) => {
//     const originalSpan = document.createElement("span");
//     originalSpan.textContent = char;
//     originalTextDiv.appendChild(originalSpan);

//     const replacementSpan = document.createElement("span");
//     replacementSpan.textContent = char;
//     replacementTextDiv.appendChild(replacementSpan);
//   });

//   // Append both text divs to the link
//   link.appendChild(originalTextDiv);
//   link.appendChild(replacementTextDiv);

//   // Create the GSAP timeline for hover animation with stagger
//   const hoverInTimeline = gsap.timeline({ paused: true });

//   // Animate each original character up and out of view
//   hoverInTimeline.to(originalTextDiv.children, {
//     y: -30, // Move each letter up out of view
//     opacity: 0,
//     stagger: 0.05, // Stagger animation for each letter
//     duration: 0.2,
//     ease: "power1.in",
//   });

//   // Animate each replacement character into view
//   hoverInTimeline.to(
//     replacementTextDiv.children,
//     {
//       y: 0, // Move each letter to the original position
//       opacity: 1, // Full opacity for the replacement text
//       stagger: 0.05, // Match stagger for a smooth sequence
//       duration: 0.2,
//       ease: "power1.out",
//     },
//     "-=0.2"
//   );

//   // Play on hover, reverse on hover out
//   link.addEventListener("mouseenter", () => hoverInTimeline.play());
//   link.addEventListener("mouseleave", () => hoverInTimeline.reverse());
// });
