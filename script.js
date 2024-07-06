const speedEl = document.querySelector("#speed");
const buttons = document.querySelectorAll("#buttons button");
let speedType = localStorage.getItem("speedType");
if (!speedType) {
  speedType = "mph";
  localStorage.setItem("speedType", "mph");
}

document.querySelector(`.${speedType}`).classList.add("selected");

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

const mpsToKph = (mps) => {
  const kps = mps / 1000;
  const kph = kps * 3600;

  return kph;
};

const mpsToMph = (mps) => {
  const conversionFactor = 0.621371;
  const kph = mpsToKph(mps);
  const mph = kph * conversionFactor;

  return mph;
};

/**
 * Converts speed
 * @param {Number} speed
 */
const convertSpeed = (speed) => {
  switch (speedType) {
    case "mph":
      return mpsToMph(speed);
    case "kph":
      return mpsToKph(speed);
    default:
      return speed;
  }
};

if ("geolocation" in navigator) {
  navigator.geolocation.watchPosition(
    (position) => {
      const speed = position.coords.speed; // Speed in meters per second
      if (speed !== null) {
        speedEl.innerHTML = speed;
        // console.log(`Current speed: ${speed} m/s`);
      } else {
        speedEl.innerHTML = "N/A";
        // console.log("Speed information is not available.");
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
