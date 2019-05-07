const config = require("../config/config");

module.exports = {
  GAME_RESULTS: {
    LOST: 0,
    WON: 1,
    SURRENDERED: 2
  },
  GAME_RESULTS_LABELS: ["lost", "won", "surrendered"],
  GAME_DIFFICULTIES: {
    EASY: 0,
    NORMAL: 1,
    HARD: 2
  },
  GAME_DIFFICULTIES_LABELS: ["easy", "normal", "hard"],
  GAME_STATUSES: {
    ACTIVE: 0,
    FINISHED: 1
  },
  GAME_STATUSES_LABELS: ["active", "finished"],
  MAX_MOVES_PER_DIFFICULTY: [
    config.game.difficulties.easy.maxMoves,
    config.game.difficulties.normal.maxMoves,
    config.game.difficulties.hard.maxMoves
  ]
};
