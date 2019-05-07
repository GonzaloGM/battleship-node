const express = require("express");
const passport = require("passport");

const router = express.Router();

const usersController = require("../../users/usersController");
const asyncMiddleware = require("../../middlewares/asyncMiddleware");
const { userIsAdmin } = require("../../middlewares/authMiddlewares");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  userIsAdmin,
  asyncMiddleware(usersController.getUsers)
);
router.post(
  "/",
  passport.authenticate("signup", { session: false }),
  asyncMiddleware(usersController.createUser)
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userIsAdmin,
  asyncMiddleware(usersController.getUser)
);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userIsAdmin,
  asyncMiddleware(usersController.updateUser)
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userIsAdmin,
  asyncMiddleware(usersController.deleteUser)
);

module.exports = router;
