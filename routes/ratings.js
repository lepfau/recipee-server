const express = require("express");
const router = express.Router();
const Ratings = require("../models/Rating");
const requireAuth = require("../middlewares/requireAuth");
const Recipe = require("../models/Recipe");

router.get("/", (req, res, next) => {
  Ratings.find()
    .populate("id_user")
    .populate("id_recipe")
    .then((recipeDoc) => {
      res.status(200).json(recipeDoc);
    })
    .catch((error) => {
      next(error);
    });
});

router.delete("/:id", (req, res, next) => {
  Ratings.findByIdAndDelete(req.params.id)
    .then((recipeDoc) => {
      res.status(204).json({
        message: "Successfuly deleted",
      });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
