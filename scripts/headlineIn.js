document.addEventListener("DOMContentLoaded", () => {
  const headline = document.querySelector(".headline h1");

  if (!headline) {
    console.error("Headline element not found!");
    return;
  } else {
    console.log(headline.innerHTML);
  }

  // Wrap each word in a span for the hero animation
  headline.innerHTML = headline.textContent
    .split(" ")
    .map((word) => `<span>${word}</span>`)
    .join(" ");

  // Create a GSAP timeline for sequential animations
  const tl = gsap.timeline();
  const headlineWords = document.querySelectorAll(".headline h1 span"); // Select all word spans
  console.log(headlineWords);
  console.log("Headline inner HTML after span wrap:", headline.innerHTML);

  if (headlineWords.length === 0) {
    console.error("No spans found inside the headline!");
    return;
  }

  // Step 1: Animate the hero text within the .headline container
  tl.fromTo(
    headlineWords,
    { y: "100%", opacity: 0 },
    {
      y: "0%",
      opacity: 1,
      stagger: 0.1,
      duration: 0.5,
      ease: "power2.out",
    }
  );

  // Step 2: Fade in other content after the hero text animation
  tl.to(
    "body > *:not(main), main > *:not(.headline)",
    {
      opacity: 1,
      duration: 1,
      ease: "power2.out",
    },
    "+=0.5" // Wait 0.5 seconds after the hero animation finishes
  );

  console.log("GSAP timeline created:", tl);
});
