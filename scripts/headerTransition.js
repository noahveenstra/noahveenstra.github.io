gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", function () {
  const headings = document.querySelectorAll("h1");

  headings.forEach((head) => {
    const splitText = new SplitType(head, { type: "words,chars" });
    const wordElements = gsap.utils.toArray(splitText.words);

    gsap.to(wordElements, {
      y: 0,
      opacity: 1,
      stagger: 0.25,
      delay: 0.2,
      duration: 0.2,
      scrollTrigger: {
        trigger: head,
        start: "top center",
        end: "bottom center",
        // markers: true,
      },
    });
  });
});
