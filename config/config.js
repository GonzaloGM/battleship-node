const config = require("rc")("battleship", {
  game: {
    boardSize: 10,
    shipAmounts: {
      1: 4,
      2: 3,
      3: 2,
      4: 1
    },
    difficulties: {
      easy: {
        maxMoves: 50
      },
      normal: {
        maxMoves: 40
      },
      hard: {
        maxMoves: 30
      }
    }
  }
});

module.exports = config;
