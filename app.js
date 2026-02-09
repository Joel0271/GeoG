
// ----------------------
// TOOL SWITCHING
// ----------------------
function showTool(id) {
  document.querySelectorAll('.tool').forEach(t =>
    t.classList.remove('active')
  );
  document.getElementById(id)?.classList.add('active');
}


document.querySelectorAll('.tool-nav button').forEach(btn => {
  btn.addEventListener('click', () => showTool(btn.dataset.tool));
});

// ----------------------
// DONUT TOOL INIT
// ----------------------
function initDonutTool() {
  const tool = document.querySelector('#donut');
  if (!tool) return;

  const donut = tool.querySelector('.donut-visual');
  const colorCountInput = tool.querySelector('.color-count');
  const colorInputsDiv = tool.querySelector('.color-inputs');
  const toggleSpinButton = tool.querySelector('.toggle-spin');

  let spinning = false;

  function updateDonut() {
    const colors = Array.from(
      colorInputsDiv.querySelectorAll('input')
    ).map(input => input.value);

    if (colors.length > 1) colors.push(colors[0]);
    donut.style.background = `conic-gradient(${colors.join(',')})`;
  }

  function renderColorInputs() {
    const count = parseInt(colorCountInput.value);
    const existing = Array.from(
      colorInputsDiv.querySelectorAll('input')
    ).map(i => i.value);

    colorInputsDiv.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const input = document.createElement('input');
      input.type = 'color';
      input.value = existing[i] || '#33CCBB';

      const hexinput = document.createElement('input');
      hexinput.type = "text";
      hexinput.value = input.value;
      hexinput.classList.add('hex-input');
      hexinput.maxLength = 7;

      input.addEventListener('input', () => {
        hexinput.value = input.value;
        updateDonut();
      });

      hexinput.addEventListener('input', () => {
        if (/^#[0-9a-fA-F]{0,6}$/.test(hexinput.value)) {
          input.value = hexinput.value;
          updateDonut();
        }
      });

      const label = document.createElement('label');
      label.textContent = `Color ${i + 1}: `;
      label.appendChild(input);

      colorInputsDiv.appendChild(label);
    }

    updateDonut();
  }

  toggleSpinButton.addEventListener('click', () => {
    spinning = !spinning;
    donut.classList.toggle('spinning', spinning);
  });

  colorCountInput.addEventListener('input', renderColorInputs);

  renderColorInputs();
}

initDonutTool();

// ----------------------
// CALCULATORS INIT
// ----------------------
function initCalculators() {

  // --- 1) Haversine Distance ---
  const coordOption = document.getElementById("coord-option");
  if (coordOption) {
    coordOption.addEventListener("change", function() {
      if (this.value === "separate") {
        document.getElementById("separate-inputs").style.display = "block";
        document.getElementById("combined-inputs").style.display = "none";
      } else {
        document.getElementById("separate-inputs").style.display = "none";
        document.getElementById("combined-inputs").style.display = "block";
      }
    });
  }

  document.getElementById("distcalc")?.addEventListener("click", function() {
    let lat1, lon1, lat2, lon2;
    const option = document.getElementById("coord-option")?.value;

    if (!option) return;

    if (option === "separate") {
      lat1 = parseFloat(document.getElementById("lat1").value);
      lon1 = parseFloat(document.getElementById("lon1").value);
      lat2 = parseFloat(document.getElementById("lat2").value);
      lon2 = parseFloat(document.getElementById("lon2").value);
    } else {
      const parsePoint = (value) => {
        const match = value.match(/-?\d+(\.\d+)?/g);
        if (!match || match.length < 2) return [NaN, NaN];
        return match.map(Number);
      };
      [lat1, lon1] = parsePoint(document.getElementById("pointA").value);
      [lat2, lon2] = parsePoint(document.getElementById("pointB").value);
    }

    if ([lat1, lon1, lat2, lon2].some(isNaN)) {
      document.getElementById("distance-result").textContent = "Unknown coordinates detected";
      return;
    }

    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const aCalc = Math.sin(dLat/2)**2 +
                  Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(aCalc), Math.sqrt(1 - aCalc));
    let distance = R * c;
    let UWOOGHUNITO = "???";
    if (distance < 0.01) {
      UWOOGHUNITO = "cm";
      distance = distance * 100000;
    } else if (distance < 1) {
      UWOOGHUNITO = "m";
      distance = distance * 1000;
    } else {
      UWOOGHUNITO = "km";
    }

    console.log("Nya!");

    document.getElementById("distance-result").textContent = distance.toFixed(3) + " " + UWOOGHUNITO;
  });

  // --- 2) Right-Angled Triangle Calculator ---
  document.getElementById("tricalc")?.addEventListener("click", function() {
    let a = parseFloat(document.getElementById("sideA").value);
    let b = parseFloat(document.getElementById("sideB").value);
    let c = parseFloat(document.getElementById("sideC").value);
    let A = parseFloat(document.getElementById("angleA").value);
    let B = parseFloat(document.getElementById("angleB").value);

    const deg2rad = deg => deg * Math.PI / 180;
    const rad2deg = rad => rad * 180 / Math.PI;

    const knownSides = [a, b, c].filter(v => !isNaN(v)).length;
    const knownAngles = [A, B].filter(v => !isNaN(v)).length;

    let result = "";

    try {
      // Two sides known → calculate third
      if (knownSides >= 2) {
        if (!a && b && c) a = Math.sqrt(c*c - b*b);
        if (!b && a && c) b = Math.sqrt(c*c - a*a);
        if (!c && a && b) c = Math.sqrt(a*a + b*b);
      }

      // One side + one angle → calculate the rest
      if (knownSides === 1 && knownAngles === 1) {
        if (!A && B) A = 90 - B;
        if (!B && A) B = 90 - A;

        if (a && A) {
          b = a / Math.tan(deg2rad(A));
          c = a / Math.sin(deg2rad(A));
        } else if (b && B) {
          a = b / Math.tan(deg2rad(B));
          c = b / Math.sin(deg2rad(B));
        } else if (a && B) {
          b = a * Math.tan(deg2rad(B));
          c = a / Math.cos(deg2rad(B));
        } else if (b && A) {
          a = b * Math.tan(deg2rad(A));
          c = b / Math.cos(deg2rad(A));
        } else if (c && A) {
          a = c * Math.sin(deg2rad(A));
          b = c * Math.cos(deg2rad(A));
        } else if (c && B) {
          b = c * Math.sin(deg2rad(B));
          a = c * Math.cos(deg2rad(B));
        }
      }

      // Calculate missing angles
      if (!A && a && c) A = rad2deg(Math.asin(a / c));
      if (!B && b && c) B = rad2deg(Math.asin(b / c));

      if ([a,b,c,A,B].some(v => isNaN(v))) {
        result = "Insufficient or inconsistent input. Provide at least two known values.";
      } else {
        result = `Side A: ${a.toFixed(3)}, Side B: ${b.toFixed(3)}, Hypotenuse C: ${c.toFixed(3)}\nAngle A: ${A.toFixed(3)}°, Angle B: ${B.toFixed(3)}°`;
      }
    } catch {
      result = "Error in calculation. Check your inputs.";
    }

    document.getElementById("triangle-result").textContent = result;
  });

  // --- 3) CM ↔ PX Converter ---
  document.getElementById("covcalc")?.addEventListener("click", function() {
    const value = parseFloat(document.getElementById("conv-value").value);
    const mode = document.getElementById("conv-mode")?.value;
    const edgeComp = document.getElementById("edgeComp")?.checked;
    const A4heightPx = 3508;
    const A4heightCm = 29.7;

    if (isNaN(value)) {
      document.getElementById("converter-result").textContent = "Enter a valid number.";
      return;
    }

    let result;

    if (mode === "cm2px") result = (value / A4heightCm) * A4heightPx;
    else result = (value / A4heightPx) * A4heightCm;

    if (edgeComp) result *= 1.05;

    document.getElementById("converter-result").textContent = result.toFixed(3);
  });

}

// Initialize calculators
initCalculators();










