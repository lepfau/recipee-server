const express = require("express");
const router = express.Router();
const Recipee = require("../models/Recipee")

router.get("/", (req, res, next) => {
    Recipee.find()
        .then((recipeeDoc) => {
            res.status(200).json(recipeeDoc);
        })
        .catch((error) => {
            next(error)
        })
})

router.post("/", (req, res, next) => {
    const updateValues = { ...req.body };
    console.log(updateValues)
    Recipee.create(updateValues)
        .then((recipeeDoc) => {
            res.status(201).json(recipeeDoc);
        })
        .catch(next)
})


module.exports = router;

