const { assert } = require("chai");

const GamesModel = require("./gamesModel");

describe("Model: Game", () => {
  describe("#userId", () => {
    it("is an ObjectId", () => {
      const userIdNotAnObjectId = 1;
      const game = new GamesModel({ userId: userIdNotAnObjectId });
      assert.equal(
        game.errors.userId.message,
        'Cast to ObjectID failed for value "1" at path "userId"'
      );
    });
    it("is required", () => {
      const game = new GamesModel({});
      game.validateSync();
      assert.equal(game.errors.userId.message, "Path `userId` is required.");
    });
  });
  // TODO: add more tests to this model
});
