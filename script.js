const X_CLASS = 'x';
const O_CLASS = 'o';
let i = 0;
let xTurn = false;
let xFirst = false;
let game = new Game();
let ai = new AI();
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winning-message');
const winningMessageTextElement = document.querySelector(
  '[data-winning-message-text]'
);
const restartButton = document.getElementById('restart-button');
const xScoreElement = document.getElementById('x-score');
const drawScoreElement = document.getElementById('draw-score');
const oScoreElement = document.getElementById('o-score');
document.getElementById('clear-button').addEventListener('click', function () {
  localStorage.setItem('xScore', 0);
  localStorage.setItem('drawScore', 0);
  localStorage.setItem('oScore', 0);

  updateScores({});
});
const cells = [...cellElements];

startGame();
restartButton.addEventListener('click', startGame);

function startGame() {
  setBoardHoverClass();
  updateScores({});

  // in case of restarting the game, we have to UNSET everything
  winningMessageElement.classList.remove('show');
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS, O_CLASS);
    cell.removeEventListener('click', handleClick);
  });

  // set an EventListener for new game
  cellElements.forEach((cell) => {
    cell.addEventListener('click', handleClick, { once: true });
  });
  game = new Game();
  if (!xTurn) {
    game.nextRound();
    aiPlay();
  }
}

function handleClick(e) {
  const cell = e.target;
  // Place Marks in clicked cells
  placeMark(cell);
  // Check for Win
  if (checkWin()) {
    const currentClass = xTurn ? X_CLASS : O_CLASS;
    updateScores({ [currentClass]: 1 });
    endGame(false);
    cell.ai = false;
  }
  // Check for Draw
  else if (isDraw()) {
    updateScores({ draw: 1 });
    endGame(true);
    cell.ai = false;
  }
  // Switch Turns
  else {
    swapTurns();
    setBoardHoverClass();
    game.nextRound();
    if (!cell.ai) {
      cell.ai = false;
      console.log(
        game.board,
        '------i play-------',
        i++,
        `xTurn: ${xTurn} xFirst: ${xFirst}`,
        cell,
        cell.ai
      );
      aiPlay();
    } else {
      cell.ai = false;
      console.log(
        game.board,
        '--------ai play------',
        i++,
        `xTurn: ${xTurn} xFirst: ${xFirst}`,
        cell,
        cell.ai
      );
    }
    console.log('end of cell handle --------------------');
  }
}

function placeMark(cell) {
  const currentClass = xTurn ? X_CLASS : O_CLASS;
  cell.classList.add(currentClass);

  // update game object
  const cellIndex = cells.findIndex((e) => e === cell);
  const action = {
    player: currentClass,
    position: [cellIndex % 3, Math.floor(cellIndex / 3)],
  };
  game.makeMove(action);
}

function swapTurns() {
  xTurn = !xTurn;
}

function setBoardHoverClass() {
  const currentClass = xTurn ? X_CLASS : O_CLASS;
  board.classList.remove(X_CLASS, O_CLASS);
  board.classList.add(currentClass);
}

function checkWin() {
  const currentClass = xTurn ? X_CLASS : O_CLASS;
  // Check if: for 'some' combination in WINNING_COMBINATIONS array
  return WINNING_COMBINATIONS.some((combination) => {
    // and for 'every' index in that combination array,
    return combination.every((index) => {
      // the cell corresponding to that index contains currentClass in its classList
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

function isDraw() {
  // Check if: 'every' cell in cellElements
  return [...cellElements].every((cell) => {
    // is filled i.e. contains a X_CLASS or O_CLASS
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
  });
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = 'Draw!';
  } else {
    winningMessageTextElement.innerText = `${xTurn ? "X's" : "O's"} Wins!`;
  }
  setTimeout(() => {
    winningMessageElement.classList.add('show');
  }, 450);
  xFirst = !xFirst;
  xTurn = xFirst;
}

function aiPlay() {
  console.log('call ai');
  const action = ai.play(game);
  game.makeMove(action);

  const { position } = action;
  linearIndex = 3 * position[1] + position[0];
  const aiChoice = cells[linearIndex];
  aiChoice.ai = true;
  aiChoice.click();
}

function updateScores({ x = 0, draw = 0, o = 0 }) {
  let xScore = +localStorage.getItem('xScore') ?? 0;
  let drawScore = +localStorage.getItem('drawScore') ?? 0;
  let oScore = +localStorage.getItem('oScore') ?? 0;

  xScore += x;
  drawScore += draw;
  oScore += o;

  localStorage.setItem('xScore', xScore);
  localStorage.setItem('drawScore', drawScore);
  localStorage.setItem('oScore', oScore);

  xScoreElement.innerHTML = xScore;
  drawScoreElement.innerHTML = drawScore;
  oScoreElement.innerHTML = oScore;
}
