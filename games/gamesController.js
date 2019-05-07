const mongoose = require("mongoose");

const GameModel = mongoose.model("Game");
const GamesService = require("./gamesService");
const { GAME_STATUSES, GAME_DIFFICULTIES } = require("./gamesConstants");

async function createGame(req, res, next) {
  const { difficulty } = req.body;

  const battleshipGame = GamesService.createGame({
    difficulty: GAME_DIFFICULTIES[difficulty.toUpperCase()]
  });
  const board = battleshipGame.getBoard();
  const ships = battleshipGame.getShips();
  const gameDifficulty = battleshipGame.getDifficulty();
  const turnsUsed = battleshipGame.getTurnsUsed();
  const movesHistory = battleshipGame.getMovesHistory();
  const hitShips = battleshipGame.getHitShips();

  const flattenedBoard = board.map(row => row.join("").replace(/1/g, "?"));

  const newGame = await GameModel.create({
    userId: req.user._id,
    status: GAME_STATUSES.ACTIVE,
    board,
    difficulty: gameDifficulty,
    ships,
    turnsUsed,
    movesHistory,
    hitShips
  });

  res.json({
    message: "Game created",
    board: flattenedBoard,
    gameId: newGame._id
  });
}

async function surrenderGame(req, res, next) {
  const resultSurrender = await GamesService.surrenderGame({
    gameId: req.params.id,
    userId: req.user._id
  });

  return res.json({
    message: resultSurrender.message,
    board: resultSurrender.board
  });
}

async function getGame(req, res, next) {
  const game = await GamesService.getGame({
    gameId: req.params.id,
    userId: req.user._id
  });

  const flattenedBoard = game.board.map(row => row.join("").replace(/1/g, "?"));

  const { accuracy, startDate, endDate, status, result, turnsUsed } = game;

  return res.json({
    board: flattenedBoard,
    message: "Game",
    accuracy,
    startDate,
    endDate,
    status,
    result,
    turnsUsed
  });
}

async function getGames(req, res, next) {
  const { filter } = req.query;
  const sortFromQueryString = req.query.sort;

  const games = await GamesService.getGames({
    filterString: filter,
    sortString: sortFromQueryString,
    userId: req.user._id
  });

  return res.json({
    message: "Games",
    games
  });
}

async function deleteGame(req, res, next) {
  const resultDelete = await GamesService.deleteGame({
    gameId: req.params.id,
    userId: req.user._id
  });

  return res.json({
    message: resultDelete
  });
}

async function newMove(req, res, next) {
  const { coordX, coordY } = req.body;
  const coords = [coordX, coordY];

  const resultNewMove = await GamesService.newMove({
    gameId: req.params.id,
    userId: req.user._id,
    coords
  });

  return res.json({
    message: resultNewMove.message,
    board: resultNewMove.board
  });
}

module.exports = {
  createGame,
  surrenderGame,
  getGame,
  getGames,
  deleteGame,
  newMove
};
