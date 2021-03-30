require("dotenv").config();
require("./config/dbConnection");

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

/**
 * Middlewares
 */
const corsOptions = { origin: process.env.FRONTEND_URL, credentials: true };

app.use(cors(corsOptions));
app.use(logger("dev")); // This logs HTTP reponses in the console.
app.use(express.json()); // Access data sent as json @req.body
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 60000 * 60 }, // in millisec
    store: new MongoStore({
      mongooseConnection: mongoose.connection, // you can store session infos in mongodb :)
      ttl: 24 * 60 * 60,
      // 1 day
    }),
    saveUninitialized: true,
    resave: true,
  })
);

// Test to see if user is logged In before getting into any router.
app.use(function (req, res, next) {
  console.log("User in session =>", req.session.currentUser);
  next();
});

/**
 * Routes
 */

const authRouter = require("./routes/auth");
const indexRouter = require("./routes/index");
const recipesRouter = require("./routes/recipes");
const ratingsRouter = require("./routes/ratings");

app.use("/api/auth", authRouter);
app.use("/api", indexRouter);
app.use("/api/ratings", ratingsRouter);
app.use("/api/recipes", recipesRouter);

// 404 Middleware

// Error handler middleware
// If you pass an argument to your next function in any of your routes or middlewares
// You will end up in this middleware
// next("toto") makes you end up here
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }
  console.log("An error occured");
  res.status(err.status || 500);
  if (!res.headersSent) {
    res.json(err);
  }
});

module.exports = app;
