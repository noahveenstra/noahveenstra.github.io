gsap.registerPlugin(ScrollTrigger);

const headings = document.querySelectorAll("header");
const subhead = document.querySelectorAll("h3");
const divider = document.querySelector("hr");
const articleTitle = document.querySelector("article h3");
const articleDot = document.querySelector("article .dot");
const articleWrapper = document.querySelector("article .container .wrapper");
const article = document.querySelector("article");
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
      scrollTrigger: {
        trigger: headings,
        start: "top center",
        end: "bottom center",
      },
    },
    "-=1"
  );
});
let articleTl = gsap.timeline({
  scrollTrigger: {
    trigger: subhead,
    start: "top center",
    end: "bottom center",
  },
});
tl.fromTo(
  articleTitle,
  {
    // x: -10,
    y: 100,
  },
  {
    y: 0,
    ease: "power4.out",
    duration: 1,
  },
  "+=1"
);
articleTl.fromTo(
  divider,
  { clipPath: `polygon(0 0, 0 0, 0 100%, 0% 100%)` },
  {
    clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
    duration: 2,
    ease: "power4.out",
  }
);
articleTl.fromTo(
  articleDot,
  { opacity: 0, x: -30 },
  {
    opacity: 1,
    x: 0,
    duration: 1,
    ease: "power4.out",
  },
  "<"
);
articleTl.to(
  articleTitle,
  { color: "black", y: 0, x: 15, duration: 1, ease: "power4.out" },
  "<"
);
