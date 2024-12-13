const person1 = document.getElementById("person1");
const person2 = document.getElementById("person2");
const info = document.getElementById("info");
const container = document.querySelector(".container");
const person1Img = person1.querySelector("img");
const person2Img = person2.querySelector("img");
info.classList.add("active");

const decadeSteps = [
  {
    maxDistance: 200,
    text: "1920s",
    person1Img: "assets/man1920.png",
    person2Img: "assets/woman1920.png",
  },
  {
    maxDistance: 400,
    text: "1930s",
    person1Img: "assets/man1930.png",
    person2Img: "assets/woman1930.png",
  },
  {
    maxDistance: 700,
    text: "1950s",
    person1Img: "assets/man1950.png",
    person2Img: "assets/woman1950.png",
  },
  {
    maxDistance: 1000,
    text: "1980s",
    person1Img: "assets/man1980.png",
    person2Img: "assets/woman1980.png",
  },
  {
    maxDistance: 1200,
    text: "2000s",
    person1Img: "assets/man2000.png",
    person2Img: "assets/woman2000.png",
  },
  {
    maxDistance: 1500,
    text: "2020s",
    person1Img: "assets/man2020.png",
    person2Img: "assets/woman2020.png",
  },
];

const updateInfo = (distance) => {
  for (const step of decadeSteps) {
    if (distance < step.maxDistance) {
      if (info.textContent !== step.text) {
        info.classList.remove("active");
        setTimeout(() => {
          info.textContent = step.text;
          info.classList.add("active");
        }, 500);
      }
      person1Img.src = step.person1Img;
      person2Img.src = step.person2Img;

      // Dynamically update floating information based on the era
      updateEraContent(step.text);

      break;
    }
  }
};

const updatePositions = () => {
  const rect1 = person1.getBoundingClientRect();
  const rect2 = person2.getBoundingClientRect();
  const distance = Math.abs(rect2.left - rect1.right);
  updateInfo(distance);
};

const moveElementEquidistant = (draggedElement, otherElement, event) => {
  const containerRect = container.getBoundingClientRect();
  const centerX = containerRect.width / 2;
  const centerY = containerRect.height / 2;

  // Calculate the dragged element's position relative to the center
  const draggedX = event.clientX - containerRect.left;
  const draggedY = event.clientY - containerRect.top;
  const distanceFromCenterX = draggedX - centerX;
  const distanceFromCenterY = draggedY - centerY;

  // Update the dragged element's position
  draggedElement.style.left = `${draggedX - draggedElement.offsetWidth / 2}px`;
  draggedElement.style.top = `${draggedY - draggedElement.offsetHeight / 2}px`;

  // Position the other element equidistant from the center
  otherElement.style.left = `${
    centerX - distanceFromCenterX - otherElement.offsetWidth / 2
  }px`;
  otherElement.style.top = `${
    centerY - distanceFromCenterY - otherElement.offsetHeight / 2
  }px`;

  updatePositions(); // Dynamically update positions and info
};

const startDrag = (event, draggedElement, otherElement) => {
  event.preventDefault();
  const moveElement = (moveEvent) => {
    moveElementEquidistant(draggedElement, otherElement, moveEvent);
  };

  const stopDrag = () => {
    document.removeEventListener("mousemove", moveElement);
    document.removeEventListener("mouseup", stopDrag);
  };

  document.addEventListener("mousemove", moveElement);
  document.addEventListener("mouseup", stopDrag);
};

// Add custom drag-and-drop behavior
person1.addEventListener("mousedown", (event) =>
  startDrag(event, person1, person2)
);
person2.addEventListener("mousedown", (event) =>
  startDrag(event, person2, person1)
);

//floaters
const eraData = [
  {
    era: "1920s",
    dayInTheLife:
      "Families gathered around radios for news and entertainment, while flappers challenged social norms at vibrant jazz dance halls. The streets were bustling with Ford Model T cars, symbolizing the new age of mobility.",
    tech: {
      title: "Radio",
      description:
        "The radio altimeter revolutionized aviation by providing accurate altitude measurements, enhancing flight safety.",
    },
  },
  {
    era: "1930s",
    dayInTheLife:
      "The Great Depression defined daily life, with breadlines and work programs shaping survival. Families found solace in radio broadcasts and occasional trips to the movies.",
    tech: {
      title: "Electric Refrigerator",
      description:
        "The refrigerator changed how people stored and consumed food, making preservation easier and reducing waste.",
    },
  },
  {
    era: "1950s",
    dayInTheLife:
      "Suburban families enjoyed television evenings, with shows like I Love Lucy bringing laughter into living rooms. Drive-ins were popular for movie nights and social gatherings.",
    tech: {
      title: "Television",
      description:
        "Television became a household staple, altering entertainment and bringing families together around the screen.",
    },
  },
];

const populateEraData = () => {
  const ditl = document.getElementById("ditl");
  const tech = document.querySelector(".tech");

  // Randomly choose an era
  const randomEra = eraData[Math.floor(Math.random() * eraData.length)];

  // Populate "Day In The Life"
  ditl.querySelector(
    ".title"
  ).textContent = `Day In The Life: ${randomEra.era}`;
  ditl.querySelector(".content").textContent = randomEra.dayInTheLife;

  // Populate "Tech"
  tech.querySelector(".title").textContent = `Tech: ${randomEra.tech.title}`;
  tech.querySelector(".content").textContent = randomEra.tech.description;

  // Random positioning
  const container = document.body; // Assume the floating items are placed relative to the body
  const maxWidth = container.clientWidth - 300; // Ensure space for hover expansion
  const maxHeight = container.clientHeight - 300;

  ditl.style.left = `${Math.random() * maxWidth}px`;
  ditl.style.top = `${Math.random() * maxHeight}px`;

  tech.style.left = `${Math.random() * maxWidth}px`;
  tech.style.top = `${Math.random() * maxHeight}px`;
};

// Call the function on page load
populateEraData();
const updateEraContent = (era) => {
  const eraData = {
    "1920s": {
      dayInTheLife:
        "Families gathered around radios for news and entertainment, while flappers challenged social norms at vibrant jazz dance halls. The streets were bustling with Ford Model T cars, symbolizing the new age of mobility.",
      tech: {
        title: "Radio",
        description:
          "The invention of the radio revolutionized communication and entertainment by connecting people to news, music, and broadcasts.",
      },
    },
    "1930s": {
      dayInTheLife:
        "The Great Depression defined daily life, with breadlines and work programs shaping survival. Families found solace in radio broadcasts and occasional trips to the movies.",
      tech: {
        title: "Telephone Networks",
        description:
          "Advancements in telephone networks during the 1930s made long-distance communication more reliable and accessible, bringing people closer despite physical distances.",
      },
    },
    "1950s": {
      dayInTheLife:
        "Suburban families enjoyed television evenings, with shows like I Love Lucy bringing laughter into living rooms. Drive-ins were popular for movie nights and social gatherings.",
      tech: {
        title: "Television",
        description:
          "Television became a household staple, altering entertainment and bringing families together around the screen.",
      },
    },
    "1980s": {
      dayInTheLife:
        "Video games, arcades, and MTV dominated youth culture, while families used home computers like the Commodore 64 for work and play. The Walkman revolutionized music listening on the go.",
      tech: {
        title: "Personal Computers",
        description:
          "The personal computer boom, led by companies like IBM and Apple, transformed workplaces and households.",
      },
    },
    "2000s": {
      dayInTheLife:
        "The dawn of the digital age brought smartphones and social media, changing how people communicated and consumed information. Email replaced traditional mail for most correspondence.",
      tech: {
        title: "Smartphones",
        description:
          "The introduction of the smartphone, led by the iPhone, reshaped social interactions and gave people instant access to the internet on the go.",
      },
    },
    "2020s": {
      dayInTheLife:
        "Remote work and virtual meetings became a norm due to the pandemic. Social interactions shifted heavily online, with platforms like Zoom and Discord enabling connection.",
      tech: {
        title: "Artificial Intelligence",
        description:
          "AI-powered technologies, from voice assistants to generative models, have fundamentally altered industries and personal lives, creating new ways to work, play, and connect.",
      },
    },
  };

  const data = eraData[era];

  if (data) {
    // Update "Day In The Life" content
    const ditl = document.getElementById("ditl");
    ditl.querySelector(".title").textContent = `Day In The Life: ${era}`;
    ditl.querySelector(".content").innerHTML = `
            <h2>${era}</h2>
            <p>${data.dayInTheLife}</p>
        `;

    // Update "Tech" content
    const tech = document.querySelector(".tech");
    tech.querySelector(".title").textContent = `Tech: ${data.tech.title}`;
    tech.querySelector(".content").innerHTML = `
            <h2>${data.tech.title}</h2>
            <p>${data.tech.description}</p>
        `;
  }
};

// Example: Call the function to update the content to the 1920s
updateEraContent("1920s");
