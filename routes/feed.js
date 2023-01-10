const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const feedController = require("../controllers/feed");
const isauth = require("../middleware/is-auth");

router.get("/posts", isauth, feedController.getPosts);

router.post(
  "/post",
  isauth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

router.put(
  "/post/:postId",
  isauth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

router.get("/post/:postId", isauth, feedController.getPost);

router.delete("/post/:postId", isauth, feedController.deletePost);

module.exports = router;
