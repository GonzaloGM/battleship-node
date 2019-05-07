const express = require("express");

const router = express.Router();

const sessionsController = require("../../sessions/sessionsController");
const asyncMiddleware = require("../../middlewares/asyncMiddleware");

router.post("/", asyncMiddleware(sessionsController.login));
router.delete("/", asyncMiddleware(sessionsController.logout));

module.exports = router;
