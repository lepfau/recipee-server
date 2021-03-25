const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
const uploader = require("../config/cloudinary");
const requireAuth = require("../middlewares/requireAuth");

router.get("/", (req, res, next) => {
  Recipe.find()
    .populate("id_user")
    .then((recipeDoc) => {
      res.status(200).json(recipeDoc);
    })
    .catch((error) => {
      next(error);
    });
});

router.patch(
  "/:id",
  requireAuth,
  uploader.single("image"),
  (req, res, next) => {
    const item = { ...req.body };
    console.log(item);
    Recipe.findById(req.params.id)
      .then((itemDocument) => {
        if (!itemDocument)
          return res.status(404).json({ message: "Item not found" });

        if (req.file) {
          item.image = req.file.path;
        }

        Recipe.findByIdAndUpdate(req.params.id, item, { new: true })
          .populate("id_user")
          .populate("ratings")
          .then((updatedDocument) => {
            return res.status(200).json(updatedDocument);
          })
          .catch(next);
      })
      .catch(next);
  }
);

router.get("/:id", (req, res, next) => {
  Recipe.findById(req.params.id)
    .populate("id_user")

    .then((RecipeDocument) => {
      res.status(200).json(RecipeDocument);
    })
    .catch((error) => {
      next(error);
    });
});

router.post("/", requireAuth, uploader.single("image"), (req, res, next) => {
  const updateValues = { ...req.body };

  if (req.file) {
    updateValues.image = req.file.path;
  }

  updateValues.id_user = req.session.currentUser; // Retrieve the authors id from the session.

  Recipe.create(updateValues)
    .then((recipeDocument) => {
      recipeDocument
        .populate("id_user")
        .populate("ratings")
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
