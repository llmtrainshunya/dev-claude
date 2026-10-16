const LENGTH_TO_METERS = {
  m: 1,
  km: 1000,
  ft: 0.3048,
  mi: 1609.344,
};

const WEIGHT_TO_GRAMS = {
  g: 1,
  kg: 1000,
  oz: 28.349523125,
  lb: 453.59237,
};

function convertViaBaseUnit(value, fromUnit, toUnit, factors) {
  const base = value * factors[fromUnit];
  return base / factors[toUnit];
}

function celsiusToUnit(celsius, unit) {
  if (unit === "c") return celsius;
  if (unit === "f") return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
}

function unitToCelsius(value, unit) {
  if (unit === "c") return value;
  if (unit === "f") return ((value - 32) * 5) / 9;
  return value - 273.15;
}

function convertTemperature(value, fromUnit, toUnit) {
  return celsiusToUnit(unitToCelsius(value, fromUnit), toUnit);
}

function formatResult(value) {
  if (!Number.isFinite(value)) return "";
  const rounded = Number(value.toPrecision(6));
  return rounded.toString();
}

function setupConverter(prefix, convertFn) {
  const input = document.getElementById(`${prefix}-input`);
  const output = document.getElementById(`${prefix}-output`);
  const fromSelect = document.getElementById(`${prefix}-from`);
  const toSelect = document.getElementById(`${prefix}-to`);

  function update() {
    const value = parseFloat(input.value);
    if (Number.isNaN(value)) {
      output.value = "";
      return;
    }
    output.value = formatResult(convertFn(value, fromSelect.value, toSelect.value));
  }

  input.addEventListener("input", update);
  fromSelect.addEventListener("change", update);
  toSelect.addEventListener("change", update);

  update();
}

function setupTabs() {
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      panels.forEach((p) => p.classList.remove("active"));

      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });
}

setupTabs();
setupConverter("temperature", convertTemperature);
setupConverter("length", (value, from, to) => convertViaBaseUnit(value, from, to, LENGTH_TO_METERS));
setupConverter("weight", (value, from, to) => convertViaBaseUnit(value, from, to, WEIGHT_TO_GRAMS));
