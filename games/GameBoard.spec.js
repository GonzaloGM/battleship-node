const { assert } = require("chai");

const GameBoard = require("./GameBoard");
const config = require("../config/config");
const gameConstants = require("./gamesConstants");

describe("GameBoard", () => {
  describe("newGame", () => {
    it("should create a board", () => {
      const game = new GameBoard({ boardSize: config.game.boardSize });
      game.newGame();

      assert.isArray(game.board);
      assert.oneOf(game.board[0][0], ["0", "?"]);
      assert.strictEqual(game.board.length, config.game.boardSize);
    });
  });

  describe("shoot", () => {
    it("should return 0 when hitting water", () => {
      const emptyBoard = [];
      for (let i = 0; i < config.game.boardSize; i += 1) {
        emptyBoard.push(new Array(config.game.boardSize).fill("?"));
      }
      const game = new GameBoard({
        boardSize: config.game.boardSize,
        board: emptyBoard
      });

      game.shoot([0, 0]);

      assert.strictEqual(game.getBoard()[0][0], "O");
    });
  });

  describe("getShips()", () => {
    it("should return an array of ships", () => {
      const game = new GameBoard({ boardSize: config.game.boardSize });
      game.newGame();

      const amountOfShipsInGame = Object.values(config.game.shipAmounts).reduce(
        (acc, curr) => acc + curr,
        0
      );

      assert.isArray(game.getShips());
      assert.strictEqual(game.getShips().length, amountOfShipsInGame);
    });
  });

  describe("getTurnsUsed()", () => {
    it("should return 1 when hitting water on the first move on an empty board", () => {
      const emptyBoard = [];
      for (let i = 0; i < config.game.boardSize; i += 1) {
        emptyBoard.push(new Array(config.game.boardSize).fill("?"));
      }
      const game = new GameBoard({
        boardSize: config.game.boardSize,
        board: emptyBoard
      });

      game.shoot([0, 0]);

      assert.strictEqual(game.getTurnsUsed(), 1);
    });
  });

  describe("getDifficulty()", () => {
    it("should normal when creating a game with no difficulty set", () => {
      const game = new GameBoard({
        boardSize: config.game.boardSize
      });
      game.newGame();

      assert.strictEqual(
        game.getDifficulty(),
        gameConstants.GAME_DIFFICULTIES.NORMAL
      );
    });
  });

  describe("surrenderGame()", () => {
    it("should return a FINISHED status and SURRENDERED result after surrendering", () => {
      const game = new GameBoard({
        boardSize: config.game.boardSize
      });
      game.newGame();

      game.surrenderGame();

      assert.strictEqual(
        game.getStatus(),
        gameConstants.GAME_STATUSES.FINISHED
      );
      assert.strictEqual(
        game.getResult(),
        gameConstants.GAME_RESULTS.SURRENDERED
      );
    });
  });
});
