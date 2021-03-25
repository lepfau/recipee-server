const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  name: String,
  ingredients: [String],
  etapes: [String],
  vegan: Boolean,
  vegetarian: Boolean,
  gluten: Boolean,
  lactose: Boolean,
  image: {
    type: String,
    default:
      "https://cdn1.iconfinder.com/data/icons/gardening-filled-line/614/1935_-_Growing_Plant-512.png",
  },
  type: {
    type: String,
    enum: ["snack", "plat", "entrée", "dessert", "autre"],
  },
  temps: {
    type: Number,
    min: 0,
  },
  id_user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Recipe = mongoose.model("Recipee", recipeSchema);

module.exports = Recipe;
