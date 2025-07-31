export function startGame(container) {
  container.innerHTML = `
    <div class="fifteen-board" id="board"></div>
    <button class="btn" id="new-game-btn">Новая игра</button>
    <div id="game-message" class="result"></div>
  `;

  const board = container.querySelector('#board');
  const newGameBtn = container.querySelector('#new-game-btn');
  const gameMessage = container.querySelector('#game-message');
  let tiles = [];

  function createTiles() {
    let nums = [...Array(15).keys()].map(n => n + 1).concat([0]);
    nums = createSnake(nums);

    do {
      nums.sort(() => Math.random() - 0.5);
    } while (!isSolvable(nums));

    tiles = nums;
    render();
    gameMessage.textContent = "";
  }

  function createSnake(nums) {
    let snake = [], row = [], direction = 1;
    for (let i = 0; i < 16; i++) {
      row.push(nums[i]);
      if (row.length === 4) {
        snake = snake.concat(direction === 1 ? row : row.reverse());
        row = [];
        direction *= -1;
      }
    }
    return snake;
  }

  function render() {
    board.innerHTML = '';
    tiles.forEach((n, i) => {
      const tile = document.createElement('div');
      tile.className = 'tile' + (n === 0 ? ' empty' : '');
      if (n !== 0) tile.textContent = n;
      tile.addEventListener('click', () => move(i));
      board.appendChild(tile);
    });
  }

  function move(index) {
    const emptyIndex = tiles.indexOf(0);
    const [er, ec] = [Math.floor(emptyIndex / 4), emptyIndex % 4];
    const [r, c] = [Math.floor(index / 4), index % 4];

    if (Math.abs(er - r) + Math.abs(ec - c) === 1) {
      [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
      render();
      if (isSolved()) {
        gameMessage.textContent = "Поздравляем, вы победили!";
      }
    }
  }

  function isSolved() {
    for (let i = 0; i < 15; i++) {
      if (tiles[i] !== i + 1) return false;
    }
    return tiles[15] === 0;
  }

  function isSolvable(arr) {
    let inv = 0;
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] && arr[j] && arr[i] > arr[j]) inv++;
      }
    }
    const emptyRow = Math.floor(arr.indexOf(0) / 4);
    return (inv + emptyRow) % 2 === 0;
  }

  newGameBtn.addEventListener('click', createTiles);
  createTiles();
}