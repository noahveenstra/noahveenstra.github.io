document.addEventListener("DOMContentLoaded", () => {
  const targetWords = ["crafting"]; // Words to attach doodles
  const headline = document.querySelector(".headline h1");

  if (headline) {
    targetWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi"); // Match the word
      headline.innerHTML = headline.innerHTML.replace(
        regex,
        `<span class="doodle-word">${word}<img src="/assets/centered-circle.svg" alt="doodle" class="doodle"></span>`
      );
    });
  }
});
