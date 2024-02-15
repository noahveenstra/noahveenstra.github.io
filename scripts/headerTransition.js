gsap.registerPlugin(ScrollTrigger);

const headings = document.querySelectorAll("header");
const subhead = document.querySelectorAll("h3");

var tl = gsap.timeline();
headings.forEach((head) => {
  const splitText = new SplitType(head, { type: "words,chars" });
  const wordElements = gsap.utils.toArray(splitText.words);
  tl.to(wordElements, {
    y: 0,
    opacity: 1,
    stagger: 0.25,
    duration: 0.1,
  });
});
subhead.forEach((sub) => {
  const splitText = new SplitType(sub, { type: "lines,words,chars" });
  const wordElements = gsap.utils.toArray(splitText.lines);
  wordElements.forEach((line) => {
    const container = document.createElement("div");
    container.style.clipPath = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";
    line.parentNode.insertBefore(container, line);
    container.appendChild(line);
  });
  tl.to(
    wordElements,
    {
      y: 0,
      opacity: 1,
      stagger: 0.1,
      duration: 0.3,
      // scrollTrigger: {
      //   trigger: headings,
      //   start: "top center",
      //   end: "bottom center",
      //   markers: true,
      // },
    },
    // "<"
    "+=.1"
  );
});
