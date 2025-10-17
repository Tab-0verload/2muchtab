export function startGame(container) {
  container.innerHTML = `
    <div class="pks">
  <div id="tableSelect" style="flex:1;display:flex;flex-direction:column;justify-content:center;">
    <h1 style="text-align:center;margin-bottom:16px;">Выберите стол</h1>
    <div class="tablespk">
      <button class="table-btn" onclick="selectTable(2500)">Стол 1 — ставка 2,500</button>
      <button class="table-btn" onclick="selectTable(25000)">Стол 2 — ставка 25,000</button>
      <button class="table-btn" onclick="selectTable(250000)">Стол 3 — ставка 250,000</button>
    </div>
  </div>


  <div id="game" style="display:none; flex:1;flex-direction:column;justify-content:space-between;">
  
    <div class="pkt">
      <h1 class="h1pk">Одиночная игра</h1>
      <div class="statspk">
        Баланс: <span id="balance"></span> | Ставка: <span id="bet"></span>
      </div>
    </div>

    <div>
      <div style="text-align:center;font-size:13px;color:#bbb;">Борд:</div>
      <div class="boardpk" id="board">
        <div class="placeholderpk"></div>
        <div class="placeholderpk"></div>
        <div class="placeholderpk"></div>
        <div class="placeholderpk"></div>
        <div class="placeholderpk"></div>
      </div>
    </div>
    
    <div>
      <div style="text-align:center;font-size:13px;color:#bbb;">Ваши карты:</div>
      <div class="playerpk" id="player"></div>
    </div>
    
    <div class="controlspk">
      <button class="btn-pass" id="passBtn">Пас</button>
      <button class="btn-check" id="checkBtn">Чек</button>
      <button class="btn-raise2" id="raise2Btn">Рейз ×2</button>
      <button class="btn-raise3" id="raise3Btn">Рейз ×3</button>
    </div>
    
    <div class="messagepk" id="message">Нажмите любую кнопку, чтобы начать раздачу</div>
  </div>
</div>`;


const SUITS = ['♠','♥','♦','♣'];
const RANKS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
let deck = [];
let player = [];
let board = [null,null,null,null,null];
let stage = 0;

let balance = Number(localStorage.getItem('blpk')) || 0;
let defaultBet = 0;
let bet = 0;
const balanceLimit = -100000000;

const balanceEl = document.getElementById("balance");
const betEl = document.getElementById("bet");
const messageEl = document.getElementById("message");
const boardEl = document.getElementById("board");
const playerEl = document.getElementById("player");

const passBtn = document.getElementById("passBtn");
const checkBtn = document.getElementById("checkBtn");
const raise2Btn = document.getElementById("raise2Btn");
const raise3Btn = document.getElementById("raise3Btn");

function selectTable(startBet) {
  defaultBet = startBet;
  bet = defaultBet;
  document.getElementById("tableSelect").style.display = "none";
  document.getElementById("game").style.display = "flex";
  newHand();
}
window.selectTable = selectTable;

function updateUI() {
  if (balance < balanceLimit) balance = balanceLimit;
  
  balanceEl.textContent = balance.toLocaleString();
  betEl.textContent = bet.toLocaleString();


  if (balance <= balanceLimit) {
    enableButtons(false);
    messageEl.textContent = "Баланс достиг минимального значения. Ставки недоступны!";
  } else if (stage < 3) {
    enableButtons(true);
  }
}

function createDeck() {
  deck = [];
  for (let r of RANKS) {
    for (let s of SUITS) {
      deck.push({rank:r, suit:s, value:RANKS.indexOf(r)+2});
    }
  }
}
function shuffle() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}
function renderBoard() {
  boardEl.innerHTML = '';
  board.forEach(c=>{
    if (c) {
      const div = document.createElement("div");
      div.className = "cardpk";
      div.innerHTML = `<div class="rankpk">${c.rank}</div><div class="suitpk">${c.suit}</div><div class="rankpk" style="text-align:right">${c.rank}</div>`;
      div.style.color = (c.suit==='♥'||c.suit==='♦')?'#e63946':'#111';
      boardEl.appendChild(div);
    } else {
      const div = document.createElement("div");
      div.className = "placeholderpk";
      boardEl.appendChild(div);
    }
  });
}
function renderPlayer() {
  playerEl.innerHTML = '';
  player.forEach(c=>{
    const div = document.createElement("div");
    div.className = "cardpk";
    div.innerHTML = `<div class="rankpk">${c.rank}</div><div class="suitpk">${c.suit}</div><div class="rankpk" style="text-align:right">${c.rank}</div>`;
    div.style.color = (c.suit==='♥'||c.suit==='♦')?'#e63946':'#111';
    playerEl.appendChild(div);
  });
}
function enableButtons(active=true) {
  checkBtn.disabled = !active;
  raise2Btn.disabled = !active;
  raise3Btn.disabled = !active;
}
function newHand() {
  stage = 0;
  createDeck(); shuffle();
  player = [deck.pop(), deck.pop()];
  board = [null,null,null,null,null];
  renderPlayer();
  renderBoard();
  bet = defaultBet;
  updateUI();
  enableButtons(true);
  messageEl.textContent = "Раздача началась!";
}
function nextStage(action) {
  if (action==="Пас") {
    messageEl.textContent = "Вы сделали пас. Новая раздача.";
    newHand(); return;
  }
  if (action==="Рейз ×2") { bet *= 2; }
  if (action==="Рейз ×3") { bet *= 3; }
  balance -= bet;
  localStorage.setItem('blpk', (Number(localStorage.getItem('blpk')) || 0) - bet);
  
  updateUI();
  if (stage===0) { board[0]=deck.pop(); board[1]=deck.pop(); board[2]=deck.pop(); stage=1; messageEl.textContent="Флоп"; }
  else if (stage===1) { board[3]=deck.pop(); stage=2; messageEl.textContent="Тёрн"; }
  else if (stage===2) { board[4]=deck.pop(); stage=3; evaluate(); }
  renderBoard();
}

function evaluate() {
  const all = [...player, ...board.filter(c=>c)];
  const res = evaluateHand(all);
  if (res.multiplier>0) {
    const win = res.multiplier*bet;
    balance+=win;
    localStorage.setItem('blpk', (Number(localStorage.getItem('blpk')) || 0) + win);
    messageEl.textContent = `Комбинация: ${res.name}! Выигрыш ${win.toLocaleString()}`;
  } else {
    messageEl.textContent = `Нет комбинации.`;
  }
  updateUI();
  bet = defaultBet;
  enableButtons(false);
}


function evaluateHand(cards) {
  let counts = {}, suits = {}, vals = [];

  cards.forEach(c => {
    counts[c.rank] = (counts[c.rank] || 0) + 1;
    suits[c.suit] = (suits[c.suit] || 0) + 1;
    vals.push(c.value);
  });

  vals = [...new Set(vals)].sort((a, b) => a - b);

  const flushSuit = Object.keys(suits).find(s => suits[s] >= 5);
  const flush = !!flushSuit;

  let straight = false;
  let straightHigh = 0;

  const straightVals = vals.includes(14) ? [...vals, 1].sort((a, b) => a - b) : vals;

  for (let i = 0; i < straightVals.length - 4; i++) {
    if (
      straightVals[i + 1] === straightVals[i] + 1 &&
      straightVals[i + 2] === straightVals[i] + 2 &&
      straightVals[i + 3] === straightVals[i] + 3 &&
      straightVals[i + 4] === straightVals[i] + 4
    ) {
      straight = true;
      straightHigh = straightVals[i + 4];
      break;
    }
  }

  const groups = Object.values(counts).sort((a, b) => b - a);

  if (flush && straight) {

    const suitedCards = cards
      .filter(c => c.suit === flushSuit)
      .map(c => c.value)
      .sort((a, b) => a - b);
    const suitedSet = new Set(suitedCards);

    const royal = [10, 11, 12, 13, 14].every(v => suitedSet.has(v));
    if (royal) return { name: "Royal Flush", multiplier: 60 };

    let suitedStraight = false;
    for (let i = 0; i < suitedCards.length - 4; i++) {
      if (
        suitedCards[i + 1] === suitedCards[i] + 1 &&
        suitedCards[i + 2] === suitedCards[i] + 2 &&
        suitedCards[i + 3] === suitedCards[i] + 3 &&
        suitedCards[i + 4] === suitedCards[i] + 4
      ) {
        suitedStraight = true;
        break;
      }
    }
    if (suitedStraight) return { name: "Straight Flush", multiplier: 20 };
  }

  if (groups[0] === 4) return { name: "Four of a Kind", multiplier: 9 };
  if (groups[0] === 3 && groups[1] === 2) return { name: "Full House", multiplier: 6 };
  if (flush) return { name: "Flush", multiplier: 4 };
  if (straight) return { name: "Straight", multiplier: 2 };
  if (groups[0] === 3) return { name: "Three of a Kind", multiplier: 0.9 };
  if (groups[0] === 2 && groups[1] === 2) return { name: "Two Pair", multiplier: 0.6 };
  if (groups[0] === 2) return { name: "One Pair", multiplier: 0.3 };
  return { name: "No Win", multiplier: 0 };
}

passBtn.onclick=()=>nextStage("Пас");
checkBtn.onclick=()=>nextStage("Чек");
raise2Btn.onclick=()=>nextStage("Рейз ×2");
raise3Btn.onclick=()=>nextStage("Рейз ×3");

}