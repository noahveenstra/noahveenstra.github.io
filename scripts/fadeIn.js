const head = document.querySelectorAll("section h3");
console.log(head);
const paragraphs = document.querySelectorAll("section p");

paragraphs.forEach((element) => {
  gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 20,
      duration: 0.75,
      ease: "power1.inOut",
    },
    {
      opacity: 1,
      duration: 0.75,
      y: 0,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
      },
    }
  );
});
head.forEach((element) => {
  gsap.to(element, {
    color: "#000",
    duration: 1,
    ease: "power1.inOut",
    scrollTrigger: {
      trigger: element,
      start: "top 75%",
    },
  });
});
