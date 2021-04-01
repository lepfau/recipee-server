const express = require("express");
const router = express.Router();
const Ratings = require("../models/Rating");
const requireAuth = require("../middlewares/requireAuth");
const Recipe = require("../models/Recipe");

router.get("/", (req, res, next) => {
  Ratings.find()

    .then((recipeDoc) => {
      res.status(200).json(recipeDoc);
    })
    .catch((error) => {
      next(error);
    });
});

// router.delete("/", (req, res, next) => {
//   const values = { ...req.body };
//   Ratings.deleteMany({ id_recipe: values._id })
//     .then((ratingdoc) => {
//       console.log(ratingdoc);
//     })
//     .catch((error) => {
//       next(error);
//     });
// });

router.delete("/:id", (req, res, next) => {
  Ratings.findByIdAndDelete(req.params.id)
    .then((ratingDoc) => {
      console.log(ratingDoc);
      return Recipe.findByIdAndUpdate(ratingDoc.id_recipe, {
        $pull: { ratings: ratingDoc._id },
      });
    })
    .then((ratingDoc) => {
      res.status(204).json({
        message: "Successfuly deleted",
      });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
