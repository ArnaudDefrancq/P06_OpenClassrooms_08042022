const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/sauce");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");

router.get("/" + "", sauceCtrl.getAllSauce);
router.get("/:id", sauceCtrl.getOneSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id", sauceCtrl.modifySauce);
router.delete("/:id", sauceCtrl.deleteSauce);

module.exports = router;
