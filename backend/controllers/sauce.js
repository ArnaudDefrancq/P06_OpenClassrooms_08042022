const Sauce = require("../models/Sauces");
const fs = require("fs");

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

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [" "],
    usersDisliked: [" "],
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Objet créé" }))
    .catch((error) => res.status(400).json({ error: error }));
};

// verifier si il existe
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.findOneAndDelete({ _id: req.params.id })
          .then((sauce) => {
            if (!sauce) {
              return res.status(404).json({ error: "Objet non trouvé" });
            }
            if (sauce.userId !== req.auth.userId) {
              return res.status(401).json({ error: "Requête non autorisée" });
            } else {
              return res.status(200).json({ message: "Objet supprimé" });
            }
          })
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// utiliser la fonction switch et faire avec les cas +1 (Ajout du like) 0 (suppréssion du like ou dislike) -1 (ajout d'un dislike).
exports.likeSauce = (req, res, next) => {
  let like = req.body.like;
  let ID = req.body.userId;
  let sauceID = req.params.id;

  console.log(like);
  console.log(ID);
  console.log(sauceID);

  switch (like) {
    case 1:
      Sauce.findOneAndUpdate(
        { _id: sauceID },
        { $push: { usersLiked: ID }, $inc: { likes: +1 } }
      )
        .then(() => res.status(200).json({ message: `J'aime` }))
        .catch((error) => res.status(400).json({ error }));
      break;

    case 0:
      Sauce.findOne({ _id: sauceID })
        .then((sauce) => {
          if (sauce.usersLiked.includes(ID)) {
            Sauce.updateOne(
              { _id: sauceID },
              { $pull: { usersLiked: ID }, $inc: { likes: -1 } }
            )
              .then(() => res.status(200).json({ message: "Neutre" }))
              .catch((error) => res.status(400).json({ error }));
          }
          if (sauce.usersDisliked.includes(ID)) {
            Sauce.updateOne(
              { _id: sauceID },
              { $pull: { usersDisliked: ID }, $inc: { dislikes: -1 } }
            )
              .then(() => res.status(200).json({ message: "Neutre" }))
              .catch((error) => res.status(400).json({ error }));
          }
        })

        .catch((error) => res.status(400).json({ error }));
      break;

    case -1:
      Sauce.findOneAndUpdate(
        { _id: sauceID },
        { $push: { usersDisliked: ID }, $inc: { dislikes: +1 } }
      )
        .then(() => res.status(200).json({ message: `Je n'aime pas` }))
        .catch((error) => res.status(400).json({ error }));
      break;

    default:
      console.log("error");
  }
};
