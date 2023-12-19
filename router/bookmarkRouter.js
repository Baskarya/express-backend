const express = require("express");
const router = express.Router();
const {
  getBookmarkByUsername,
  getBookmarkArticlesByUsername,
  getBookmarkBatikByUsername,
  getBookmarkCustomsByUsername,
  postBookmark,
  deleteBookmark
} = require("../controllers/bookmarkController");

const { upload } = require('../app');

router.get("/bookmarks/:username", getBookmarkByUsername);
router.get("/bookmarks/articles/:username", getBookmarkArticlesByUsername);
router.get("/bookmarks/batik/:username", getBookmarkBatikByUsername);
router.get("/bookmarks/customs/:username", getBookmarkCustomsByUsername);
router.post("/bookmarks/", postBookmark);
router.delete("/bookmarks/:username/:contentId", deleteBookmark);

module.exports = router;
