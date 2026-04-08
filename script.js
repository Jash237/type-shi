// ====================== YOUR ORIGINAL RECURSIVE FUNCTIONS (ported exactly) ======================
function toHexChar(temps) {
  if (temps < 10) return String(temps);
  return String.fromCharCode(65 + (temps - 10));
}

function toDecChar(inp) {
  const ch = inp.toUpperCase();
  if (ch >= '0' && ch <= '9') return ch.charCodeAt(0) - 48;
  return ch.charCodeAt(0) - 65 + 10;
}

function recDecToBin(no) {
  if (no === 0) return 0;
  return (no % 2) + recDecToBin(Math.floor(no / 2)) * 10;
}

function recDecToHex(no) {
  if (no < 16) return toHexChar(no);
  return recDecToHex(Math.floor(no / 16)) + toHexChar(no % 16);
}

function recBinToDec(no, pointer = 0) {
  if (no === 0) return 0;
  const newPointer = pointer + 1;
  return ((no % 10) * Math.pow(2, newPointer)) + recBinToDec(Math.floor(no / 10), newPointer);
}

function recHexToDec(temps) {
  if (temps.length === 0) return 0;
  return recHexToDec(temps.substring(0, temps.length - 1)) * 16 + toDecChar(temps.charAt(temps.length - 1));
}

// ====================== GLOBAL STATE ======================
let currentType = 0;
let currentNum = 0;
let currentHexa = "";

// ====================== UI LOGIC ======================
function handleTypeChange() {
  currentType = parseInt(document.getElementById("typeSelect").value);
}

function setInput() {
  const inputStr = document.getElementById("numberInput").value.trim();

  if (!inputStr) {
    alert("Please enter a number!");
    return;
  }

  if (currentType === 2) {
    currentHexa = inputStr.toUpperCase();
    // Validate hex
    if (!/^[0-9A-F]+$/.test(currentHexa)) {
      alert("Invalid Hexadecimal number! Only 0-9 and A-F allowed.");
      return;
    }
  } else {
    currentNum = parseInt(inputStr, currentType === 1 ? 2 : 10);
    if (isNaN(currentNum)) {
      alert("Invalid number for selected type!");
      return;
    }
  }

  // Show conversion options
  renderConversionOptions();
}

function renderConversionOptions() {
  const container = document.getElementById("conversionOptions");
  container.innerHTML = "";

  if (currentType === 0) {
    container.innerHTML = `
      <button class="btn-option" onclick="performConversion('bin')"><i class="fa-solid fa-1"></i> Decimal → Binary</button>
      <button class="btn-option" onclick="performConversion('hex')"><i class="fa-solid fa-2"></i> Decimal → Hexadecimal</button>
    `;
  } else if (currentType === 1) {
    container.innerHTML = `
      <button class="btn-option" onclick="performConversion('dec')"><i class="fa-solid fa-1"></i> Binary → Decimal</button>
      <button class="btn-option" onclick="performConversion('hex')"><i class="fa-solid fa-2"></i> Binary → Hexadecimal</button>
    `;
  } else if (currentType === 2) {
    container.innerHTML = `
      <button class="btn-option" onclick="performConversion('bin')"><i class="fa-solid fa-1"></i> Hex → Binary</button>
      <button class="btn-option" onclick="performConversion('dec')"><i class="fa-solid fa-2"></i> Hex → Decimal</button>
    `;
  }
}

function performConversion(target) {
  let result = "";

  if (currentType === 0) { // Decimal
    if (target === 'bin') result = recDecToBin(currentNum);
    else if (target === 'hex') result = recDecToHex(currentNum);
  }
  else if (currentType === 1) { // Binary
    const decValue = recBinToDec(currentNum, 0) / 2; // exact match to your Java logic
    if (target === 'dec') result = Math.floor(decValue);
    else if (target === 'hex') result = recDecToHex(Math.floor(decValue));
  }
  else if (currentType === 2) { // Hex
    const decValue = recHexToDec(currentHexa);
    if (target === 'dec') result = decValue;
    else if (target === 'bin') result = recDecToBin(decValue); // fixed the original bug
  }

  // Show result
  document.getElementById("resultValue").innerHTML = `
    <strong>${result}</strong><br>
    <small style="font-size:1rem; color:#67e8f9;">(${getTargetName(target)})</small>
  `;
  document.getElementById("resultCard").classList.remove("hidden");
}

function getTargetName(target) {
  if (target === 'bin') return "Binary";
  if (target === 'hex') return "Hexadecimal";
  return "Decimal";
}

function resetAll() {
  document.getElementById("numberInput").value = "";
  document.getElementById("resultCard").classList.add("hidden");
  document.getElementById("conversionOptions").innerHTML = "";
  currentNum = 0;
  currentHexa = "";
}

// Auto focus input on load
window.onload = () => {
  document.getElementById("numberInput").focus();
};