const express = require("express");
const router = express.Router();
const {
  getCustomById,
  postCustom,
  } = require("../controllers/customController");

router.get("/custom/:id", getCustomById);
router.post("/custom/", postCustom);

module.exports = router;
