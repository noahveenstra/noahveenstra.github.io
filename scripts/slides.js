let slides = [];
let one = {
  asset: "/assets/disney.jpg",
  link: "/projects/disney.html",
  title: "Reimagining My Disney Experience",
  short: "Disney",
  subtitle: "Creating a More User-Centric Experience for Disney World Guests",
  date: "November 7, 2023",
  skills: "Low-Fi Wireframes, High-Fi Wireframes, Prototypes, User Flows",
};
let two = {
  asset: "/assets/apple.jpg",
  link: "/projects/apple.html",
  title: "I Wish I Could Use Apple Music, So I Redesigned It",
  short: "Apple",
  subtitle: "n/a",
  date: "March 31, 2022",
  skills: "n/a",
};
let three = {
  asset: "/assets/nike.jpg",
  link: "/projects/nike.html",
  title: "The Unique User Experience of Nike",
  short: "Nike",
  subtitle:
    "How Nike went from shoe distributor to the largest sports company in the world, a case study.",
  date: "June 30, 2022",
  skills: "n/a",
};
slides.push(one, two, three);

function createCarousel() {
  let main = document.querySelector("main");
  main.classList.add("carousel");
  slides.forEach((slide) => {
    let slideContainer = document.createElement("div");
    let textContainer = document.createElement("div");
    let slideTitle = document.createElement("header");
    let slideSubtitle = document.createElement("h2");
    let date = document.createElement("h3");
    let skills = document.createElement("h3");
    let a = document.createElement("a");
    let short = document.createElement("h3");
    slideContainer.classList.add("slide");
    textContainer.classList.add("text-container");
    main.appendChild(slideContainer);
    slideContainer.appendChild(textContainer);
    slideTitle.classList.add("title");
    textContainer.appendChild(slideTitle);
    textContainer.appendChild(short);
    short.classList.add("short");
    slideSubtitle.classList.add("subtitle");
    textContainer.appendChild(slideSubtitle);
    date.classList.add("date");
    textContainer.appendChild(date);
    skills.classList.add("skills");
    textContainer.appendChild(skills);
    slideTitle.innerHTML = slide.title;
    short.innerHTML = slide.short;
    slideSubtitle.innerHTML = slide.subtitle;
    date.innerHTML = slide.date;
    skills.innerHTML = slide.skills;
    a.href = slide.link;
    slideContainer.style.backgroundImage = `url(${slide.asset})`;
    if (slide == one) {
      slideContainer.setAttribute("data-active", "");
    }
    slideContainer.addEventListener("mouseover", function () {
      // Find the current active slide
      let currentActiveSlide = document.querySelector(".slide[data-active]");

      // If there is an active slide, remove the 'data-active' attribute
      if (currentActiveSlide) {
        currentActiveSlide.removeAttribute("data-active");
      }

      // Set the 'data-active' attribute on the hovered slide
      this.setAttribute("data-active", "");
    });
  });
}
