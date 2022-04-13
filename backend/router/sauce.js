const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/sauce");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");

router.get("/" + "", auth, sauceCtrl.getAllSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id", auth, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);

module.exports = router;
