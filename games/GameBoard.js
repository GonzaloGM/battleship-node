const {
  GAME_DIFFICULTIES,
  MAX_MOVES_PER_DIFFICULTY,
  GAME_STATUSES,
  GAME_RESULTS
} = require("./gamesConstants");

const config = require("../config/config");
const { BadRequestError, BusinessError } = require("../helpers/error.helper");

function generateRandomCoordsForShip(shipSize, isHorizontal, boardSize) {
  // limit origin coordinates to not end up outside board
  const limitX = isHorizontal ? boardSize + 1 - shipSize : boardSize;
  const limitY = !isHorizontal ? boardSize + 1 - shipSize : boardSize;

  const initialX = Math.floor(Math.random() * limitX);
  const initialY = Math.floor(Math.random() * limitY);

  const coords = [];

  for (let i = 0; i < shipSize; i += 1) {
    if (isHorizontal) {
      coords.push([initialX + i, initialY]);
    } else {
      coords.push([initialX, initialY + i]);
    }
  }

  return coords;
}

class GameBoard {
  constructor({
    boardSize = config.game.boardSize,
    difficulty = GAME_DIFFICULTIES.NORMAL,
    board = [],
    ships = [],
    status = GAME_STATUSES.ACTIVE,
    hitShips = 0,
    result,
    turnsUsed = 0,
    movesHistory = []
  }) {
    this.board = board;
    this.boardSize = boardSize;
    this.ships = ships;
    this.status = status;
    this.difficulty = difficulty;
    this.result = result;
    this.turnsUsed = turnsUsed;
    this.hitShips = hitShips;
    this.maxMoves = MAX_MOVES_PER_DIFFICULTY[difficulty];
    this.movesHistory = movesHistory;
  }

  // TODO: add _ to private functions

  newGame() {
    this.resetBoard(this.boardSize);
    this.initializeBoardWithRandomShips();
  }

  resetBoard() {
    for (let i = 0; i < this.boardSize; i += 1) {
      this.board.push(new Array(this.boardSize).fill("?"));
    }
  }

  getBoard() {
    return this.board;
  }

  getShips() {
    return this.ships;
  }

  getTurnsUsed() {
    return this.turnsUsed;
  }

  getDifficulty() {
    return this.difficulty;
  }

  getAccuracy() {
    return Math.floor((this.hitShips / this.movesHistory.length) * 100);
  }

  getHitShips() {
    return this.hitShips;
  }

  getStatus() {
    return this.status;
  }

  getMovesHistory() {
    return this.movesHistory;
  }

  getResult() {
    return this.result;
  }

  getEndDate() {
    return this.endDate;
  }

  shipCanBePlacedWithoutCollision(shipCoords) {
    let collision = false;
    shipCoords.forEach(([x, y]) => {
      if (this.board[x][y] === "1") {
        collision = true;
      }
    });
    return collision;
  }

  initializeBoardWithRandomShips() {
    const boardSize = this.board.length;
    let isHorizontal;
    let shipCoords;
    Object.keys(config.game.shipAmounts).forEach(shipSize => {
      const shipAmount = config.game.shipAmounts[shipSize];
      for (let i = 1; i <= shipAmount; i += 1) {
        do {
          isHorizontal = Math.floor(Math.random() * 2);
          shipCoords = generateRandomCoordsForShip(
            shipSize,
            isHorizontal,
            boardSize
          );
        } while (this.shipCanBePlacedWithoutCollision(shipCoords) === true);
        this.addShipToBoard(shipCoords);
      }
    });
  }

  addShipToBoard(shipCoords) {
    shipCoords.forEach(([x, y]) => {
      this.board[x][y] = "1";
    });
    this.ships.push(shipCoords);
  }

  shipWasHit([x, y]) {
    return this.board[x][y] === "1";
  }

  shipWasSunk([x, y]) {
    const hitShip = this.ships.find(ship => {
      for (let i = 0; i < ship.length; i += 1) {
        if (ship[i][0] === x && ship[i][1] === y) {
          return true;
        }
      }
      return false;
    });

    return hitShip.every(([shipX, shipY]) => this.board[shipX][shipY] === "X");
  }

  surrenderGame() {
    if (this.status === GAME_STATUSES.FINISHED) {
      throw new BusinessError({
        message: `Sorry, this game has already finished`
      });
    }
    this.status = GAME_STATUSES.FINISHED;
    this.result = GAME_RESULTS.SURRENDERED;
    this.endDate = new Date();

    return `Game surrendered`;
  }

  allShipsSunk() {
    return this.ships.every(ship => {
      return ship.every(([shipX, shipY]) => this.board[shipX][shipY] === "X");
    });
  }

  shoot([x, y]) {
    if (this.status === GAME_STATUSES.FINISHED) {
      throw new BusinessError({
        message: `Sorry, this game has already finished`
      });
    }
    if (x > this.boardSize - 1 || y > this.boardSize - 1) {
      throw new BadRequestError({ message: "Coordinates outside board" });
    }
    // check if we already made this move
    const movesHistoryString = JSON.stringify(this.getMovesHistory());
    const moveString = JSON.stringify([x, y]);

    if (movesHistoryString.indexOf(moveString) !== -1) {
      throw new BusinessError({
        message: "Sorry, you've already made that move"
      });
    }

    let message;

    this.movesHistory.push([x, y]);

    const shipWasHit = this.shipWasHit([x, y]);

    if (shipWasHit) {
      this.board[x][y] = "X";
      message = "HIT!";
      this.hitShips += 1;
      if (this.shipWasSunk([x, y])) {
        message = "SUNK!";
        if (this.allShipsSunk()) {
          message = "You WON! :)";
          this.game = GAME_STATUSES.FINISHED;
          this.result = GAME_RESULTS.WON;
          this.endDate = new Date();
        }
      }
    } else {
      this.turnsUsed += 1;
      this.board[x][y] = "O";
      message = "Miss :(";
      if (this.turnsUsed >= this.maxMoves) {
        this.result = GAME_RESULTS.LOST;
        this.game = GAME_STATUSES.FINISHED;
        this.endDate = new Date();
        message = "Sorry, you've lost";
      }
    }

    return message;
  }
}

module.exports = GameBoard;
