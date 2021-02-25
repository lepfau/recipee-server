const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeeSchema = new Schema({
    name: String,
    ingredients: String,
    image: {
        type: String,
        default: "https://www.biocoop-cholet.fr/docs/1/Actualites//Quelle-casserole-pour-cuisiner-sain.png"
    }

})


const Recipee = mongoose.model("Recipee", recipeeSchema);

module.exports = Recipee;