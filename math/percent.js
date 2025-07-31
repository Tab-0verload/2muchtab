export function startGame(container) {
  container.innerHTML = `
    <div class="percent-container">
      <div class="col">
        <label for="baseLeft">Число</label>
        <input type="number" id="baseLeft" placeholder="например, 700" step="any" />
        <label for="percentLeft">Минус %</label>
        <input type="number" id="percentLeft" placeholder="например, 5" step="any" />
        <div class="result" id="resultLeft">–</div>
        <div class="hint">С вычетом %</div>
      </div>
      <div class="col">
        <label for="baseRight">Число</label>
        <input type="number" id="baseRight" placeholder="например, 700" step="any" />
        <label for="percentRight">Плюс %</label>
        <input type="number" id="percentRight" placeholder="например, 5" step="any" />
        <div class="result" id="resultRight">–</div>
        <div class="hint">С прибавлением %</div>
      </div>
    </div>
  `;


  const baseLeft = container.querySelector("#baseLeft");
  const percentLeft = container.querySelector("#percentLeft");
  const resultLeft = container.querySelector("#resultLeft");

  const baseRight = container.querySelector("#baseRight");
  const percentRight = container.querySelector("#percentRight");
  const resultRight = container.querySelector("#resultRight");

  function calculateLeft() {
    const base = parseFloat(baseLeft.value);
    const percent = parseFloat(percentLeft.value);
    if (!isNaN(base) && !isNaN(percent)) {
      const result = base - (base * percent / 100);
      resultLeft.textContent = result.toFixed(4);
    } else {
      resultLeft.textContent = '–';
    }
  }

  function calculateRight() {
    const base = parseFloat(baseRight.value);
    const percent = parseFloat(percentRight.value);
    if (!isNaN(base) && !isNaN(percent)) {
      const result = base + (base * percent / 100);
      resultRight.textContent = result.toFixed(4);
    } else {
      resultRight.textContent = '–';
    }
  }

  baseLeft.addEventListener("input", calculateLeft);
  percentLeft.addEventListener("input", calculateLeft);
  baseRight.addEventListener("input", calculateRight);
  percentRight.addEventListener("input", calculateRight);
}