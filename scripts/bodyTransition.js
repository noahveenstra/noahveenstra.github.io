// const subhead = new SplitType("h3");
// gsap.to(".line", {
//   y: 0,
//   ease: "power1.inOut",
//   stagger: 0.15,
//   delay: 0.35,
//   duration: 0.2,
//   opacity: 1,
// });

// gsap.registerPlugin(ScrollTrigger);

// document.addEventListener("DOMContentLoaded", function () {
//   const subhead = document.querySelectorAll("h3");
//   subhead.forEach((line) => {
//     const splitText = new SplitType(line, { type: "line" });
//     const wordElements = gsap.utils.toArray(splitText.line);
//     console.log(wordElements);
//     gsap.to(wordElements, {
//       y: 0,
//       opacity: 1,
//       stagger: 0.25,
//       duration: 0.1,
//       scrollTrigger: {
//         trigger: line,
//         start: "top center",
//         end: "bottom center",
//       },
//     });
//   });
// });
