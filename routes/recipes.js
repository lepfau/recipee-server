const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
const uploader = require("../config/cloudinary");

router.get("/", (req, res, next) => {
  Recipe.find()
    .then((recipeDoc) => {
      res.status(200).json(recipeDoc);
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/:id", (req, res, next) => {
  Recipe.findById(req.params.id)
    .then((RecipeDocument) => {
      res.status(200).json(RecipeDocument);
    })
    .catch((error) => {
      next(error);
    });
});

router.post("/", uploader.single("image"), (req, res, next) => {
  const updateValues = { ...req.body };
  if (req.file) {
    updateValues.image = req.file.path;
  }
  console.log(updateValues);
  Recipe.create(updateValues)
    .then((recipeDoc) => {
      res.status(201).json(recipeDoc);
    })
    .catch(next);
});

module.exports = router;
