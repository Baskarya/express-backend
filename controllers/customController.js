const express = require("express");
const CustomService = require('../services/firestore/CustomService');
const BookmarkService = require('../services/firestore/BookmarksService');
const ClientError = require("../exceptions/ClientError");

const customService = new CustomService();
const bookmarkService = new BookmarkService();

const getCustomById = async (req, res) => {
  try {
    const customId = req.params.id;
    const custom = await articlesService.getArticleById(customId);
    if(!custom) throw new NotFoundError('Custom tidak ditemukan');
    res.status(200).json({
      status: "success",
      error: false,
      data: custom,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const postCustom = async (req, res) => {
  try {
    const { username, imageUrl, batikName } = req.body;
    const custom = await customService.postCustom(imageUrl, batikName);
    await bookmarkService.postBookmark(username, custom.id);
    res.status(201).json({
      status: "success",
      error: false,
      data: custom,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const handleError = (res, error) => {
  if (error instanceof ClientError) {
    res.status(error.statusCode).json({
      status: "error",
      error: true,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      error: true,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getCustomById,
  postCustom
};
