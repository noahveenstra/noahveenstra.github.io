// Replace with your OpenWeatherMap API key
const apiKey = "2dc6ef22aff977c5e531d8432d80ace6";
const latitude = "42.3314"; // Replace with your latitude
const longitude = "-83.0458"; // Replace with your longitude
const units = "imperial"; // Use "metric" for Celsius, "imperial" for Fahrenheit

// Function to update the time every second
function updateTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");

  // Determine AM/PM and convert hours to 12-hour format
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12; // Convert 0 (midnight) to 12

  document.getElementById("time").innerHTML = `${hours}:${minutes}${ampm}`;

  // Update the color of the sun dot based on time of day
  const sunDot = document.getElementById("sun-dot");

  function updateSunDotColor() {
    const currentHour = new Date().getHours();
    let color, borderColor;

    // Determine color and border color based on time of day
    if (currentHour >= 5 && currentHour < 8) {
      color = "#FF4500"; // Dawn
      borderColor = "#FF6347"; // Lighter red border
    } else if (currentHour >= 8 && currentHour < 12) {
      color = "#FFD700"; // Morning
      borderColor = "#FFA500"; // Orange border
    } else if (currentHour >= 12 && currentHour < 15) {
      color = "#FFEE58"; // Noon
      borderColor = "#FFD700"; // Yellow border
    } else if (currentHour >= 15 && currentHour < 18) {
      color = "#FF8C00"; // Afternoon
      borderColor = "#FFA07A"; // Light salmon border
    } else if (currentHour >= 18 && currentHour < 20) {
      color = "#FF6347"; // Sunset
      borderColor = "#FF4500"; // Darker red border
    } else {
      color = "#1C1C1C"; // Night
      borderColor = "#333333"; // Darker gray border for night
    }

    // Apply the background color and border color
    sunDot.style.backgroundColor = color;
    sunDot.style.setProperty("--sun-dot-border-color", borderColor);
  }

  // Call the function initially and set intervals to update the color
  updateSunDotColor();
  setInterval(updateSunDotColor, 60000); // Update every minute
}

// Fetch weather data from OpenWeatherMap
async function getWeather() {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`
    );
    const data = await response.json();

    if (response.ok) {
      const temperature = Math.round(data.main.temp); // Round temperature
      const description = data.weather[0].description;
      const iconCode = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      // Update the weather element with rounded temperature, description, and icon
      document.getElementById("weather").innerHTML = `${temperature}°f`;
    } else {
      console.error("Error fetching weather data:", data.message);
      document.getElementById("weather").innerHTML =
        "Unable to load weather data.";
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    document.getElementById("weather").innerHTML =
      "Unable to load weather data.";
  }
}

// Initialize time and weather updates
updateTime();
getWeather();

// Update time every second
setInterval(updateTime, 1000);

// Refresh weather every hour (3600000 ms)
setInterval(getWeather, 3600000);
