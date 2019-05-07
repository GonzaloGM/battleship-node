const { respondUnauthorized } = require("../helpers/response.helper");

function userIsAdmin(req, res, next) {
  if (req.user.isAdmin) {
    next();
  } else {
    respondUnauthorized(res, "Unauthorized");
  }
}

module.exports = {
  userIsAdmin
};
