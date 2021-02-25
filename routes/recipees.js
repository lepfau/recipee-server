const express = require("express");
const router = express.Router();
const Recipee = require("../models/Recipee");
const uploader = require("../config/cloudinary");

router.get("/", (req, res, next) => {
    Recipee.find()
        .then((recipeeDoc) => {
            res.status(200).json(recipeeDoc);
        })
        .catch((error) => {
            next(error)
        })
})

router.post("/", uploader.single("image"), (req, res, next) => {


    const updateValues = { ...req.body };
    if (req.file) {
        updateValues.image = req.file.path;
    }
    console.log(updateValues)
    Recipee.create(updateValues)
        .then((recipeeDoc) => {
            res.status(201).json(recipeeDoc);
        })
        .catch(next)
})


module.exports = router;

