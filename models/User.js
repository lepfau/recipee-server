const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  userName: { type: String, required: true },
  id_recipes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
    },
  ],
  ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
