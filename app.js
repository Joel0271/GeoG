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
      input.value = existing[i] || '#ffffff';
      input.addEventListener('input', updateDonut);

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