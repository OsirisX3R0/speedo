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
const mpsToKph = (mps) => mps * 3.6;

/**
 * Convert meters per second `(mps)` to miles per hour `(mph)`
 * @param {Number} mps
 */
const mpsToMph = (mps) => mps * 2.237;

/**
 * Converts speed
 * @param {Number} speedinMps Speed in meters per second (mps)
 */
const convertSpeed = (speedinMps) => {
  let convertedSpeed = 0;

  switch (speedType) {
    case "mph":
      convertedSpeed = mpsToMph(speedinMps);
      break;
    case "kph":
      convertedSpeed = mpsToKph(speedinMps);
      break;
    default:
      convertedSpeed = speedinMps;
  }

  return convertedSpeed.toFixed(2);
};

/**
 *
 * @param {GeolocationPosition} position
 * @returns
 */
const calculateSpeed = (position) => {
  if (position.coords.accuracy > 20) return;

  const speed = position.coords.speed; // Speed in meters per second
  // Convert the speed, or display N/A if none
  if (speed !== null) {
    speedEl.innerHTML = convertSpeed(speed);
  } else {
    speedEl.innerHTML = "N/A";
  }
};

if ("geolocation" in navigator) {
  navigator.geolocation.watchPosition(
    calculateSpeed,
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
//   calculateSpeed({
//     coords: {
//       accuracy: 0,
//       speed: Math.random() * 0.25,
//     },
//   });
// }, 1000);
