const X_CLASS = 'x';
const O_CLASS = 'o';
let xTurn;
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

startGame();
restartButton.addEventListener('click', startGame);

function startGame() {
  xTurn = true;
  setBoardHoverClass();

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
}

function handleClick(e) {
  const cell = e.target;
  // Place Marks in clicked cells
  placeMark(cell);
  // Check for Win
  if (checkWin()) {
    endGame(false);
  }
  // Check for Draw
  else if (isDraw()) {
    endGame(true);
  }
  // Switch Turns
  else {
    swapTurns();
    setBoardHoverClass();
  }
}

function placeMark(cell) {
  const currentClass = xTurn ? X_CLASS : O_CLASS;
  cell.classList.add(currentClass);
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
  winningMessageElement.classList.add('show');
}
