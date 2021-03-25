const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
  note: Number,
  id_user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  id_recipe: String,
});

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
