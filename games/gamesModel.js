const mongoose = require("mongoose");

const {
  GAME_RESULTS,
  GAME_STATUSES,
  GAME_DIFFICULTIES
} = require("./gamesConstants");

const { Schema } = mongoose;

const GameSchema = new Schema({
  startDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  endDate: {
    type: Date
  },
  accuracy: {
    type: Number
  },
  hitShips: {
    type: Number,
    default: 0,
    required: true
  },
  lastMoveAt: {
    type: Date
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: Number,
    enum: GAME_STATUSES,
    default: GAME_STATUSES.ACTIVE,
    required: true
  },
  difficulty: {
    type: Number,
    enum: GAME_DIFFICULTIES,
    default: GAME_DIFFICULTIES.NORMAL,
    required: true
  },
  result: {
    type: Number,
    enum: GAME_RESULTS
  },
  turnsUsed: {
    type: Number,
    default: 0,
    required: true
  },
  board: {
    type: [[String]],
    required: true
  },
  ships: {
    type: [[[Number]]],
    required: true
  },
  movesHistory: {
    type: [[Number]],
    required: true
  }
});

const GameModel = mongoose.model("Game", GameSchema);

module.exports = GameModel;
