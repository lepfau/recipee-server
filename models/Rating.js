const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
  note: Number,
  comment: String,
  id_user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  id_recipe: {
    type: Schema.Types.ObjectId,
    ref: "Rating",
  },
});

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
