class Game {
  nbRounds = 1;
  board;

  constructor(board = null) {
    if (!board) this.board = this.createBoard();
    else this.board = board;
  }

  createBoard() {
    return [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
  }

  player(state) {
    // flatten board
    const plays = [...state[0], ...state[1], ...state[2]];
    // count number of x
    const nbX = plays.reduce((prev, curr) => {
      if (curr === 'x') prev++;
    }, 0);
    // count number of o
    const nbO = plays.reduce((prev, curr) => {
      if (curr === 'o') prev++;
    }, 0);
    // if round is odd, x goes first, else o
    let order = ['x', 'o'];
    if (this.nbRounds % 2 == 1) order = ['o', 'x'];
    return order[Number(nbX === nbO)];
  }

  actions(state) {
    const acts = [];
    const player = this.player(state);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!state[i][j]) {
          acts.push({ player, position: [j, i] });
        }
      }
    }
    return acts;
  }

  result(state, action) {
    // example of action {player: 'x', position: [x, y]}
    if (!action) return state;
    const { player, position } = action;
    let c_state = [[...state[0]], [...state[1]], [...state[2]]];
    c_state[position[1]][position[0]] = player;
    return c_state;
  }

  terminal(state) {
    return (
      this.playerWon(state, 'x') ||
      this.playerWon(state, 'o') ||
      this.tieCheck(state)
    );
  }

  utility(state) {
    return this.playerWon(state, 'x') ? 1 : this.playerWon(state, 'o') ? -1 : 0;
  }

  playerWon(state, player) {
    return (
      this.verticalWinCheck(state, player) ||
      this.horizontalWinCheck(state, player) ||
      this.diagonalWinCheck(state, player)
    );
  }

  verticalWinCheck(state, player) {
    for (let i = 0; i < 3; i++) {
      let rowCount = 0;
      for (let j = 0; j < 3; j++) {
        if (state[j][i] == player) {
          rowCount++;
        }
      }
      if (rowCount === 3) return true;
      rowCount = 0;
    }
    return false;
  }

  horizontalWinCheck(state, player) {
    for (let i = 0; i < 3; i++) {
      let rowCount = 0;
      for (let j = 0; j < 3; j++) {
        if (state[i][j] == player) {
          rowCount++;
        }
      }
      if (rowCount === 3) return true;
      rowCount = 0;
    }
    return false;
  }

  diagonalWinCheck(state, player) {
    let dia1Count = 0;
    let dia2Count = 0;
    for (let i = 0; i < 3; i++) {
      if (state[i][i] === player) dia1Count++;
      if (state[i][2 - i] === player) dia2Count++;
    }
    if ([dia1Count, dia2Count].includes(3)) return true;
    return false;
  }

  tieCheck(state) {
    return (
      (function () {
        return ![...state[0], ...state[1], ...state[2]].includes(null);
      })() && !(this.playerWon(state, 'x') || this.playerWon(state, 'o'))
    );
  }

  nextRound() {
    this.nbRounds++;
    return this;
  }

  makeMove(action) {
    this.board = this.result(this.board, action);
  }
}

class AI {
  play(game) {
    if (game.player(game.board) === 'x') return this.max(game);
    return this.mini(game);
  }

  max(game, action = null) {
    if (!action || !game.terminal(game.result(game.board, action))) {
      const board = action ? game.result(game.board, action) : game.board;
      let v = -44444444444;
      let choice = {};
      for (let action of this.shuffle(game.actions(board))) {
        const miniChoice = this.mini(new Game(board).nextRound(), action);
        const { utility } = miniChoice;
        if (utility > v) {
          v = utility;
          choice = { ...action, utility };
        }
      }
      return choice;
    }
    return {
      ...action,
      utility: game.utility(game.result(game.board, action)),
    };
  }

  mini(game, action = null) {
    if (!action || !game.terminal(game.result(game.board, action))) {
      const board = action ? game.result(game.board, action) : game.board;
      let v = 44444444444;
      let choice = {};
      for (let action of this.shuffle(game.actions(board))) {
        const maxChoice = this.max(new Game(board), action);
        const { utility } = maxChoice;
        if (utility < v) {
          v = utility;
          choice = { ...action, utility };
        }
      }
      return choice;
    }
    return {
      ...action,
      utility: game.utility(game.result(game.board, action)),
    };
  }

  shuffle(array) {
    let c_array = JSON.parse(JSON.stringify(array));
    let arrLen = c_array.length;

    while (arrLen != 0) {
      let randIndex = Math.floor(Math.random() * arrLen);
      arrLen--;
      [c_array[arrLen], c_array[randIndex]] = [
        c_array[randIndex],
        c_array[arrLen],
      ];
    }
    return c_array;
  }
}

module.exports = {
  Game,
  AI,
};
