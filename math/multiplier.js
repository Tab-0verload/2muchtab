export function startGame(container) {
  container.innerHTML = `
    <label>Начальное число:</label>
    <input type="number" id="start" />

    <label>Множитель:</label>
    <input type="number" id="multiplier" />

    <label>Сколько чисел:</label>
    <input type="number" id="count" />

    <div class="result" id="output"></div>
  `;

  const startInput = container.querySelector("#start");
  const multiplierInput = container.querySelector("#multiplier");
  const countInput = container.querySelector("#count");
  const output = container.querySelector("#output");

  function updateOutput() {
    const start = parseFloat(startInput.value);
    const multiplier = parseFloat(multiplierInput.value);
    const count = parseInt(countInput.value);

    if (isNaN(start) || isNaN(multiplier) || isNaN(count)) {
      output.textContent = "Введите корректные значения";
      return;
    }

    let result = [];
    let value = start;
    for (let i = 0; i < count; i++) {
      result.push(value);
      value *= multiplier;
    }

    output.textContent = "Результат: " + result.join(", ");
  }

  [startInput, multiplierInput, countInput].forEach(input =>
    input.addEventListener("input", updateOutput)
  );

  updateOutput();
}