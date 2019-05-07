const mongoose = require("mongoose");
const _ = require("lodash");

const GameModel = mongoose.model("Game");

const GameBoard = require("./GameBoard");

const { GAME_STATUSES, GAME_RESULTS } = require("./gamesConstants");
const { BadRequestError, NotFoundError } = require("../helpers/error.helper");

function createGame({ boardSize, difficulty }) {
  const game = new GameBoard({ boardSize, difficulty });
  game.newGame();
  return game;
}

async function newMove({ gameId, userId, coords }) {
  const game = await GameModel.findOne({
    _id: gameId,
    userId
  });

  if (!game) {
    throw new NotFoundError({ message: `Game not found` });
  }

  const gameBoard = new GameBoard({
    board: game.board,
    movesHistory: game.movesHistory,
    turnsUsed: game.turnsUsed,
    ships: game.ships,
    status: game.status,
    result: game.result,
    hitShips: game.hitShips
  });

  const messageFromShoot = gameBoard.shoot(coords);

  game.board = gameBoard.getBoard();
  game.movesHistory = gameBoard.getMovesHistory();
  game.turnsUsed = gameBoard.getTurnsUsed();
  game.status = gameBoard.getStatus();
  game.hitShips = gameBoard.getHitShips();
  game.markModified("board");
  game.endDate = gameBoard.getEndDate();
  game.accuracy = gameBoard.getAccuracy();

  await game.save();

  return {
    message: messageFromShoot,
    board: game.board
  };
}

async function surrenderGame({ gameId, userId }) {
  const game = await GameModel.findOne({
    _id: gameId,
    userId
  });

  if (!game) {
    throw new NotFoundError({ message: `Game not found` });
  }

  const gameBoard = new GameBoard({
    board: game.board,
    movesHistory: game.movesHistory,
    turnsUsed: game.turnsUsed,
    ships: game.ships,
    status: game.status,
    result: game.result
  });

  const surrenderResult = gameBoard.surrenderGame();

  game.status = gameBoard.getStatus();
  game.result = gameBoard.getResult();
  game.endDate = gameBoard.getEndDate();
  game.accuracy = gameBoard.getAccuracy();
  await game.save();

  return {
    message: surrenderResult,
    board: game.board
  };
}

async function deleteGame({ gameId, userId }) {
  const game = await GameModel.findOne({
    _id: gameId,
    userId
  });
  if (!game) {
    throw new NotFoundError({ message: `Game not found` });
  }
  await game.remove();
  return `Game deleted`;
}

async function getGame({ gameId, userId }) {
  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    throw new BadRequestError({ message: `Invalid game ID` });
  }
  const game = await GameModel.findOne({
    _id: gameId,
    userId
  });
  if (!game) {
    throw new NotFoundError({ message: `Game not found` });
  }

  const {
    _id,
    accuracy,
    startDate,
    endDate,
    status,
    result,
    turnsUsed,
    board
  } = game;

  return {
    _id,
    accuracy,
    startDate,
    endDate,
    status,
    result,
    turnsUsed,
    board
  };
}

async function getGames({ sortString = "", filterString = "", userId }) {
  // build sort object from query string
  const sortArr = sortString.split(" ");
  let sort = {};
  let filter;
  try {
    if (sortArr[1] === "asc" || sortArr[1] === "desc") {
      sort[sortArr[0]] = sortArr[1] === "asc" ? 1 : -1;
    }
  } catch (e) {
    // if there's an issue parsing, we remove sort
    sort = {};
  }
  // build filter query object from query string
  try {
    filter = filterString
      .split(",")
      .map(arr => arr.split(" "))
      .reduce((prev, curr) => {
        if (curr[0] === "status") {
          if (GAME_STATUSES[curr[1].toUpperCase()] !== undefined) {
            prev[curr[0]] = GAME_STATUSES[curr[1].toUpperCase()];
          }
        } else if (curr[0] === "result") {
          if (GAME_RESULTS[curr[1].toUpperCase()] !== undefined) {
            prev[curr[0]] = GAME_RESULTS[curr[1].toUpperCase()];
          }
        }

        return prev;
      }, {});
  } catch (e) {
    // if there's an issue parsing, we remove filter
    filter = {};
  }

  const baseQuery = { userId };
  const query = Object.assign(baseQuery, filter);

  const queryGames = GameModel.find(query);

  if (!_.isEmpty(sort)) {
    queryGames.sort(sort);
  }

  const games = await queryGames.exec();

  return games.map(game => {
    game = game.toObject();
    const {
      _id,
      accuracy,
      startDate,
      endDate,
      status,
      result,
      turnsUsed
    } = game;

    return {
      _id,
      accuracy,
      startDate,
      endDate,
      status,
      result,
      turnsUsed
    };
  });
}

module.exports = {
  createGame,
  newMove,
  getGame,
  getGames,
  surrenderGame,
  deleteGame
};
