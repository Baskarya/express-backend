// const express = require("express");
const BookmarkService = require('../services/firestore/BookmarksService');
const ClientError = require("../exceptions/ClientError");
const { firestore } = require('firebase-admin');

const bookmarkService = new BookmarkService();

const getBookmarkByUid = async (req, res) => {
  try {
    const uid = req.params.uid;
    const data = await bookmarkService.getBookmarkByUid(uid);
    res.status(200).json({
      status: "success",
      error: false,
      data: data,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getBookmarkArticlesByUid = async (req, res) => {
  try {
    const uid = req.params.uid;
    const data = await bookmarkService.getBookmarkArticlesByUid(uid);
    res.status(200).json({
      status: "success",
      error: false,
      data: data,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getBookmarkBatikByUid = async (req, res) => {
  try {
    const uid = req.params.uid;
    const data = await bookmarkService.getBookmarkBatikByUid(uid);
    res.status(200).json({
      status: "success",
      error: false,
      data: data,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getBookmarkCustomsByUid = async (req, res) => {
  try {
    const uid = req.params.uid;
    const data = await bookmarkService.getBookmarkCustomsByUid(uid);
    res.status(200).json({
      status: "success",
      error: false,
      data: data,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const postBookmark = async (req, res) => {
  try {
    const uid = req.headers['uid'] || req.body.uid;
    const contentId = req.body.contentId;
    const contentType = contentId.split('-')[0];

    await bookmarkService.postBookmark(uid, contentId);

    let updatedBookmark;
    if(contentType === 'article'){
      updatedBookmark = await bookmarkService.getBookmarkArticlesByUid(uid);
    } else if(contentType === 'batik'){
      updatedBookmark = await bookmarkService.getBookmarkBatikByUid(uid);
      
    }

    res.status(201).json({
      status: "success",
      error: false,
      message: "Bookmark berhasil ditambahkan",
      data: updatedBookmark
    });
  } catch (error) {
    handleError(res, error);
  }
};

const deleteBookmark = async (req, res) => {
  try {
    const { uid, contentId } = req.params;

    await bookmarkService.deleteBookmarkById(uid, contentId);
    res.status(200).json({
      status: "success",
      error: false,
      message: "Bookmark berhasil dihapus"
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
    res.status(400).json({
      status: "error",
      error: true,
      message: error.message,
    });
  }
};

module.exports = {
  getBookmarkByUid,
  getBookmarkArticlesByUid,
  getBookmarkBatikByUid,
  getBookmarkCustomsByUid,
  postBookmark,
  deleteBookmark
};
