const pounds = "lbs";
const kg = "kg";
const unitStorageKey = "wll-units";
const fiberClass1Percent = 0.5;
const fiberClass2Percent = 0.3;

let units = localStorage.getItem(unitStorageKey) || pounds;
let fiberClass = 1;
let deratePercent = fiberClass1Percent;
let mbs = 0.0;
let load = 0.0;
let safetyFactor = 10;
let cords = [];

document.getElementById("input-units-imperial").addEventListener("change", (event) => {
  setUnits(event.target.dataset.units);
});

document.getElementById("input-units-metric").addEventListener("change", (event) => {
  setUnits(event.target.dataset.units);
});

document.getElementById("input-fiber-class").addEventListener("input", (event) => {
  setFiberClass(event.target.value);
});

document.getElementById("input-cord-mbs").addEventListener("input", (event) => {
  setMBS(event.target.value);
});

document.getElementById("input-load").addEventListener("input", (event) => {
  setLoad(event.target.value);
});

document.getElementById("input-safety-factor").addEventListener("input", (event) => {
  setSafetyFactor(event.target.value);
});

document.getElementById("input-cord-select").addEventListener("change", (event) => {
  const selectedId = event.target.value;
  const cord = cords.find((c) => {
    return c.id === selectedId;
  });
  if (cord) {
    setFiberClass(cord.fc);
    setMBS(cord.mbs);
  }
});

function setUnits(value) {
  console.log(`Set units: ${value}`);
  units = value === kg ? kg : pounds;
  localStorage.setItem(unitStorageKey, units);

  let isLbs = units === pounds;
  document.getElementById("input-units-metric").checked = !isLbs;
  document.getElementById("input-units-imperial").checked = isLbs;

  document.getElementById("label-mbs").textContent = `${units}`;
  document.getElementById("label-load").textContent = `${units}`;

  document.getElementById("label-derated-mbs").textContent = `${units}`;
  document.getElementById("label-per-line").textContent = `${units}`;
  document.getElementById("label-per-basket").textContent = `${units}`;
}

function setFiberClass(value) {
  console.log(`Set fiber class: ${value}`);
  fiberClass = parseInt(value);
  if (fiberClass === 2) {
    deratePercent = fiberClass2Percent;
  } else {
    fiberClass = 1;
    deratePercent = fiberClass1Percent;
  }
  document.getElementById("input-fiber-class").value = `${fiberClass}`;
  computeDeratedMBS();
}

function setLoad(value) {
  console.log(`Set Load: ${value}`);
  load = Math.max(parseInt(value) || 0, 0);
  document.getElementById("input-load").value = load > 0 ? `${load}` : "";
  computeWLL();
}

function setSafetyFactor(value) {
  console.log(`Set Safety Factor: ${value}`);
  safetyFactor = Math.max(parseInt(value) || 1, 1);
  document.getElementById("input-safety-factor").value = `${safetyFactor}`;
  computeWLL();
}

function setMBS(value) {
  console.log(`Set MBS: ${value}`);
  mbs = Math.max(parseInt(value) || 0, 0);
  document.getElementById("input-cord-mbs").value = mbs > 0 ? `${mbs}` : "";
  computeDeratedMBS();
}

function computeDeratedMBS() {
  const deratedMbs = parseFloat(mbs * deratePercent) || 0;
  const fiberPercent = deratePercent * 100;
  console.log(`Derated MBS: ${deratedMbs} ${fiberPercent}`);

  document.getElementById("output-derated-mbs").textContent = `${deratedMbs.toFixed(1)}`;
  document.getElementById("output-derated-percent").textContent = `(${fiberPercent}% Class ${fiberClass})`;

  document.getElementById("calc-derate-decimal").textContent = `${deratePercent}`;
  document.getElementById("calc-mbs").textContent = `${mbs}`;
  document.getElementById("calc-derated-mbs").textContent = `${deratedMbs.toFixed(1)}`;

  computeWLL();
}

function computeWLL() {
  const deratedMbs = parseFloat(mbs * deratePercent) || 0;
  const wllPerLine = deratedMbs / safetyFactor;
  const wllPerBasket = wllPerLine * 2;
  console.log(`WLL Per Line: ${wllPerLine}, Per Basket: ${wllPerBasket}`);

  document.getElementById("output-wll-per-line").textContent = `${wllPerLine.toFixed(1)}`;
  document.getElementById("output-wll-per-basket").textContent = `${wllPerBasket.toFixed(1)}`;

  document.getElementById("calc-wll-dmbs").textContent = `${deratedMbs.toFixed(1)}`;
  document.getElementById("calc-wll-sf").textContent = `${safetyFactor}`;
  document.getElementById("calc-wll-result").textContent = `${wllPerLine.toFixed(1)}`;
  document.getElementById("calc-wll-per-line").textContent = `${wllPerLine.toFixed(1)}`;
  document.getElementById("calc-wll-per-basket").textContent = `${wllPerBasket.toFixed(1)}`;

  const minimumLines = parseInt(Math.max(Math.ceil(load / wllPerLine), 1)) || 0;
  const minimumBaskets = Math.ceil(minimumLines / 2);
  console.log(`Minimum Lines: ${minimumLines}, Baskets: ${minimumBaskets}`);

  document.getElementById("output-minimum-lines").textContent = `${minimumLines}`;
  document.getElementById("output-minimum-baskets").textContent = `${minimumBaskets}`;

  document.getElementById("calc-min-cord-load").textContent = `${load}`;
  document.getElementById("calc-min-cord-wll").textContent = `${wllPerLine.toFixed(1)}`;
  document.getElementById("calc-min-cord-lines").textContent = `${minimumLines}`;
  document.getElementById("calc-min-cord-lines-input").textContent = `${minimumLines}`;
  document.getElementById("calc-min-cord-baskets").textContent = `${minimumBaskets}`;
}

document.getElementById("btn-reset").addEventListener("click", () => {
  document.getElementById("input-cord-select").value = "";
  setFiberClass(1);
  setMBS(0);
  setLoad(0);
  setSafetyFactor(10);
  history.replaceState(null, "", window.location.pathname);
});

const shareBtnLabel = '<i class="bi bi-link-45deg"></i> Share Results';
const shareBtn = document.getElementById("btn-share");
shareBtn.innerHTML = shareBtnLabel;

shareBtn.addEventListener("click", () => {
  const params = new URLSearchParams();
  params.set("fc", fiberClass);
  params.set("u", units);
  if (mbs > 0) {
    params.set("mbs", mbs);
  }
  if (load > 0) {
    params.set("load", load);
  }
  params.set("sf", safetyFactor);
  const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  navigator.clipboard.writeText(shareUrl).then(() => {
    shareBtn.innerHTML = '<i class="bi bi-check-lg"></i> Copied!';
    setTimeout(() => {
      shareBtn.innerHTML = shareBtnLabel;
    }, 2000);
  });
});

const mediaQueryListColorScheme = window.matchMedia("(prefers-color-scheme: dark)");
function handleColorSchemeChange(mql) {
  let theme = mql.matches ? "dark" : "light";
  document.querySelector("html").setAttribute("data-bs-theme", theme);
}
mediaQueryListColorScheme.addEventListener("change", handleColorSchemeChange);

fetch("./cord.json")
  .then((res) => res.json())
  .then((data) => {
    cords = data;
    const select = document.getElementById("input-cord-select");
    for (const cord of cords) {
      const option = document.createElement("option");
      option.value = cord.id;
      option.textContent = `${cord.name} (${cord.manufacturer})`;
      select.appendChild(option);
    }
  });

const params = new URLSearchParams(window.location.search);
setFiberClass(params.get("fc") || fiberClass);
setUnits(params.get("u") || units);
setMBS(params.get("mbs"));
setLoad(params.get("load"));
setSafetyFactor(params.get("sf") || safetyFactor);

handleColorSchemeChange(mediaQueryListColorScheme);
