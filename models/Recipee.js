const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeeSchema = new Schema({
    name: String,

})


const Recipee = mongoose.model("Recipee", recipeeSchema);

module.exports = Recipee;