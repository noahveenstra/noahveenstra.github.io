document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const chin = document.querySelector(".chin");

  // Calculate header and chin heights
  const headerHeight = header.offsetHeight;
  const chinHeight = chin.offsetHeight + 90;

  // Set CSS variables dynamically
  document.documentElement.style.setProperty(
    "--header-height",
    `${headerHeight}px`
  );
  document.documentElement.style.setProperty(
    "--chin-height",
    `${chinHeight}px`
  );

  console.log("Header height:", headerHeight, "Chin height:", chinHeight);
});
