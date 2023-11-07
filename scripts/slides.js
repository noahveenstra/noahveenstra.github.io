let slides = [];
let one = {
  asset: "/assets/disney.jpg",
  link: "/projects/disney.html",
  title: "Reimagining My Disney Experience",
  subtitle: "Creating a More User-Centric Experience for Disney World Guests",
  date: "November 7, 2023",
  skills: "Low-Fi Wireframes, High-Fi Wireframes, Prototypes, User Flows",
};
let two = {
  asset: "/assets/apple.jpg",
  link: "/projects/apple.html",
  title: "I Wish I Could Use Apple Music, So I Redesigned It",
  subtitle: "n/a",
  date: "March 31, 2022",
  skills: "n/a",
};
let three = {
  asset: "/assets/nike.jpg",
  link: "/projects/nike.html",
  title: "The Unique User Experience of Nike",
  subtitle:
    "How Nike went from shoe distributor to the largest sports company in the world, a case study.",
  date: "June 30, 2022",
  skills: "n/a",
};
slides.push("one", "two", "three");
let currentSlide = 0;
const head = document.querySelector("header");
function slidesInit() {
  head.innerHTML = `slides[currentSlide].title`;
}
