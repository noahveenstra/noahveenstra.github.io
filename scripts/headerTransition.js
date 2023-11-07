gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", function () {
  const headings = document.querySelectorAll("header");
  console.log(headings);
  headings.forEach((head) => {
    const splitText = new SplitType(head, { type: "words,chars" });
    const wordElements = gsap.utils.toArray(splitText.words);
    gsap.to(wordElements, {
      y: 0,
      opacity: 1,
      stagger: 0.15,
      duration: 0.25,
      scrollTrigger: {
        trigger: head,
        start: "top center",
        end: "bottom center",
      },
    });

    gsap.to(wordElements, {
      y: -100,
      stagger: 0.15,
      delay: 5,
      duration: 0.25,
      scrollTrigger: {
        trigger: head,
        start: "top center",
        end: "bottom center",
      },
      onComplete: function () {
        setTimeout(function () {
          head.innerHTML = "";
          head.opacity = 0;
        }, 2000);
      },
    });
  });
});
