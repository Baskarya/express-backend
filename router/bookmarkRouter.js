const express = require("express");
const router = express.Router();
const {
  getBookmarkByUid,
  getBookmarkArticlesByUid,
  getBookmarkBatikByUid,
  getBookmarkCustomsByUid,
  postBookmark,
  deleteBookmark
} = require("../controllers/bookmarkController");

const { upload } = require('../app');

router.get("/bookmarks/:uid", getBookmarkByUid);
router.get("/bookmarks/articles/:uid", getBookmarkArticlesByUid);
router.get("/bookmarks/batik/:uid", getBookmarkBatikByUid);
router.get("/bookmarks/customs/:uid", getBookmarkCustomsByUid);
router.post("/bookmarks/", postBookmark);
router.delete("/bookmarks/:uid/:contentId", deleteBookmark);

module.exports = router;
