const express = require("express");
const passport = require("passport");

const router = express.Router();

const gamesController = require("../../games/gamesController");
const asyncMiddleware = require("../../middlewares/asyncMiddleware");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  asyncMiddleware(gamesController.getGames)
);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  asyncMiddleware(gamesController.createGame)
);
router.post(
  "/:id/newMove",
  passport.authenticate("jwt", { session: false }),
  asyncMiddleware(gamesController.newMove)
);
router.post(
  "/:id/surrender",
  passport.authenticate("jwt", { session: false }),
  asyncMiddleware(gamesController.surrenderGame)
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  asyncMiddleware(gamesController.getGame)
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  asyncMiddleware(gamesController.deleteGame)
);

module.exports = router;
