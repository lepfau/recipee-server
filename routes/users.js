const express = require("express");
const router = express.Router();
const User = require("../models/User");
const requireAuth = require("../middlewares/requireAuth");

router.get("/", (req, res, next) => {
  User.find()
    .populate({
      path: "id_recipes",
      populate: {
        path: "ratings",
      },
    })
    .then((recipeDoc) => {
      res.status(200).json(recipeDoc);
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/profile", (req, res, next) => {
  User.findById(req.session.currentUser)
    .populate({
      path: "id_recipes",
      populate: {
        path: "ratings",
      },
    })
    .then((recipeDoc) => {
      res.status(200).json(recipeDoc);
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/:username", (req, res, next) => {
  User.findOne({ userName: req.params.username })
    .then((userDoc) => {
      res.status(200).json(userDoc);
    })
    .catch((error) => {
      next(error);
    });
});

router.patch("/:username", requireAuth, (req, res, next) => {
  const updateValues = { ...req.body };
  User.findOne({ userName: req.params.username })
    .then((userDoc) => {
      if (!userDoc) return res.status(404).json({ message: "user not found" });
      User.findOneAndUpdate({ userName: req.params.username }, updateValues, {
        new: true,
      })
        .populate("recipes")
        .then((updatedUser) => {
          return res.status(200).json(updatedUser);
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = router;
