// Get element references to speed indicator and buttons
const speedEl = document.querySelector("#speed");
const buttons = document.querySelectorAll("#buttons button");

// Grab speed type from local storage
let speedType = localStorage.getItem("speedType");

// If no speed type is found, default to mph
if (!speedType) {
  speedType = "mph";
  localStorage.setItem("speedType", "mph");
}

// Select default speed type
document.querySelector(`.${speedType}`).classList.add("selected");

// When a button is clicked, mark it selected and set the speed type
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!button.className.includes("selected")) {
      const selected = document.querySelector("#buttons button.selected");
      selected.classList.remove("selected");
      speedType = button.className;
      localStorage.setItem("speedType", speedType);
      button.classList.add("selected");
    }
  });
});

/**
 * Convert meters per second `(mps)` to kilometers per hour `(kph)`
 * @param {Number} mps
 */
const mpsToKph = (mps) => {
  const kps = mps / 1000;
  const kph = kps * 3600;

  return kph;
};

/**
 * Convert meters per second `(mps)` to miles per hour `(mph)`
 * @param {Number} mps
 */
const mpsToMph = (mps) => {
  const conversionFactor = 0.621371;
  const kph = mpsToKph(mps);
  const mph = kph * conversionFactor;

  return mph;
};

/**
 * Converts speed
 * @param {Number} speedinMps Speed in meters per second (mps)
 */
const convertSpeed = (speedinMps) => {
  let convertedSpeed = 0;

  switch (speedType) {
    case "mph":
      convertedSpeed = mpsToMph(speedinMps);
    case "kph":
      convertedSpeed = mpsToKph(speedinMps);
    default:
      convertedSpeed = speedinMps;

      return convertedSpeed.toFixed(2);
  }
};

if ("geolocation" in navigator) {
  navigator.geolocation.watchPosition(
    (position) => {
      const speed = position.coords.speed; // Speed in meters per second
      // Convert the speed, or display N/A if none
      if (speed !== null) {
        speedEl.innerHTML = convertSpeed(speed);
      } else {
        speedEl.innerHTML = "N/A";
      }
    },
    (error) => {
      console.error(`Error occurred: ${error.message}`);
    },
    {
      enableHighAccuracy: true, // Use high accuracy mode
      maximumAge: 0, // No cached position data
      timeout: Infinity, // No timeout
    }
  );
} else {
  console.log("Geolocation is not supported by this browser.");
}

// For testing purposes
// setInterval(() => {
//   speedEl.innerHTML = (Math.random() * 10).toFixed(2);
// }, 1000);
