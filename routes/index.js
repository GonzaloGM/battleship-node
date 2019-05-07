const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.js");
const responder = require("../helpers/response.helper");
const userRoutes = require("./v1/users.routes");
const gameRoutes = require("./v1/games.routes");
const sessionRoutes = require("./v1/sessions.routes");

module.exports = app => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use("/v1/users", userRoutes);
  app.use("/v1/games", gameRoutes);
  app.use("/v1/sessions", sessionRoutes);

  app.use(responder.notFound);
  app.use(responder.error);
};
