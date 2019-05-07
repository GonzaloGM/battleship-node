require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");
const bodyParser = require("body-parser");

const app = express();

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

require("./middlewares/passportMiddleware");

require("./games/gamesModel");
require("./users/userModel");

// add lower limit for body-parser for security purposes
app.use(bodyParser.urlencoded({ extended: false, limit: "10kb" }));

// remove header for security purposes
app.settings["x-powered-by"] = false;

mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "DB connection error:"));
db.once("open", () => {
  console.log("Successfully connected to DB");
});

require("./routes")(app);

console.log(`ENV: ${process.env.NODE_ENV}`);

module.exports = app;
