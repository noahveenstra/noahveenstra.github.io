const divider = document.querySelector("hr");
const articleTitle = document.querySelector("article h3");
const articleDot = document.querySelector("article .dot");
const articleWrapper = document.querySelector("article .container .wrapper");
const article = document.querySelector("article");
let articleTl = gsap.timeline({
  scrollTrigger: {
    trigger: subhead,
    start: "top center",
    end: "+=500",
  },
});
var tl = gsap.timeline();
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
    delay: 2,
  }
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
