const express = require("express");
const router = express.Router();
const Ratings = require("../models/Rating");
const requireAuth = require("../middlewares/requireAuth");

router.get("/", (req, res, next) => {
  Ratings.find()
    .then((recipeDoc) => {
      res.status(200).json(recipeDoc);
    })
    .catch((error) => {
      next(error);
    });
});

router.post("/", requireAuth, (req, res, next) => {
  const updateValues = { ...req.body };

  updateValues.id_user = req.session.currentUser; // Retrieve the authors id from the session.

  Ratings.create(updateValues)
    .then((recipeDocument) => {
      console.log(recipeDocument);
      recipeDocument
        .populate("id_user")
        .populate("id_recipe.note")
        .execPopulate() // Populate on .create() does not work, but we can use populate() on the document once its created !
        .then((recipe) => {
          console.log("here");
          res.status(201).json(recipe); // send the populated document.
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = router;
