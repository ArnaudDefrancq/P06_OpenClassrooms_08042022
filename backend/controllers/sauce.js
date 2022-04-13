const Sauce = require("../models/Sauces");

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => res.status(400).json({ error: error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

exports.createSauce = (req, res, next) => {};

exports.modifySauce = (req, res, next) => {};

exports.deleteSauce = (req, res, next) => {};
