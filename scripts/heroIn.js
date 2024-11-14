document.addEventListener("DOMContentLoaded", () => {
  const h1 = document.querySelector("main > h1");

  // Wrap each word in a span for the hero animation
  h1.innerHTML = h1.textContent
    .split(" ")
    .map((word) => `<span>${word}</span>`)
    .join(" ");

  // Create a GSAP timeline for sequential animations
  const tl = gsap.timeline();

  // Step 1: Animate the hero text
  tl.fromTo(
    "main > h1 span",
    { y: "100%", opacity: 0 },
    {
      y: "0%",
      opacity: 1,
      stagger: 0.1,
      duration: 0.5,
      ease: "power2.out",
    }
  );

  // Step 2: Fade in other content after the hero text completes
  tl.to(
    "body > *:not(main), main > *:not(h1)",
    {
      opacity: 1,
      duration: 1,
      ease: "power2.out",
    },
    "+=0.5" // Wait 0.5 seconds after the hero animation finishes
  );
});
