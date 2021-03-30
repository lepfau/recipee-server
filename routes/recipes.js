const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
const uploader = require("../config/cloudinary");
const requireAuth = require("../middlewares/requireAuth");
const User = require("../models/User");
const Rating = require("../models/Rating");

router.get("/", (req, res, next) => {
  Recipe.find()
    .populate("id_user ratings")
    .then((recipeDoc) => {
      res.status(200).json(recipeDoc);
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
      return User.findByIdAndUpdate(updateValues.id_user, {
        $push: { id_recipes: recipeDocument },
      });
    })
    .then((recipeDocument) => {
      recipeDocument
        .populate("id_user")
        .execPopulate() // Populate on .create() does not work, but we can use populate() on the document once its created !
        .then((recipe) => {
          console.log("here");
          res.status(201).json(recipe); // send the populated document.
        })
        .catch(next);
    })
    .catch(next);
});

router.delete("/:id", (req, res, next) => {
  Recipe.findByIdAndDelete(req.params.id)
    //   Item.findOne({
    //     $and: [{ id_user: req.session.currentUser }, { _id: req.params.id }],
    //   })
    .then((recipeDoc) => {
      res.status(204).json({
        message: "Successfuly deleted",
      });
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
          .then((updatedDocument) => {
            return res.status(200).json(updatedDocument);
          })
          .catch(next);
      })
      .catch(next);
  }
);

router.post("/:id/rating", (req, res, next) => {
  const updateValues = { ...req.body };
  updateValues.id_user = req.session.currentUser;
  updateValues.id_recipe = req.params.id;

  Rating.findOne(
    { id_user: req.session.currentUser, id_recipe: req.params.id },
    function (err, rate) {
      if (rate === null && req.session.currentUser) {
        Rating.create(updateValues)
          .then((ratingdoc) => {
            return Recipe.findByIdAndUpdate(updateValues.id_recipe, {
              $push: { ratings: ratingdoc },
            });
          })
          .catch(next);
      } else if (!req.session.currentUser) {
        return res.status(400).json({ message: "You need to be logged in" });
      } else {
        Rating.findByIdAndUpdate(rate._id, {
          note: updateValues.note,
          comment: updateValues.comment,
        }).catch(next);
      }
    }
  );
});

// router.get("/:id", (req, res, next) => {
//   Recipe.findById(req.params.id)
//     .populate("id_user ratings")
//     .populate({
//       // we are populating author in the previously populated comments
//       path: "ratings",
//       populate: {
//         path: "id_user",
//         model: "User",
//       },
//     })
//     .then((RecipeDocument) => {
//       res.status(200).json(RecipeDocument);
//     })
//     .catch((error) => {
//       next(error);
//     });
// });

router.get("/:id", (req, res, next) => {
  Recipe.findById(req.params.id)
    .populate("id_user ratings")
    .populate({
      //       // we are populating author in the previously populated comments
      path: "ratings",
      populate: {
        path: "id_user",
        model: "User",
      },
    })
    .then((RecipeDocument) => {
      res.status(200).json(RecipeDocument);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
