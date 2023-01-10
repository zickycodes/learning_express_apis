const Author = require("../model/author");
const Post = require("../model/post");
const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");
// const { post } = require("../routes/feed");
// const { where } = require("sequelize");

getPosts = async (req, res, next) => {
  try {
    const posts = await Post.findAll({});
    // console.log(post);
    let modPost = [];
    posts.forEach((post) => {
      return modPost.push(post.dataValues);
    });

    return res.status(200).json({
      posts: modPost,
    });
  } catch (e) {
    if (!e.statusCode) {
      err.statusCode = 500;
    }
    next(e);
  }
};

createPost = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    return next(error);
  }

  if (!req.file) {
    const error = new Error("No image provided.");
    error.statusCode = 422;
    return next(error);
  }

  const author = await Author.findAll({
    where: {
      id: req.userId,
    },
  });

  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;

  try {
    const post = await Post.create({
      title,
      imageUrl,
      content,
      AuthorId: author[0].dataValues.id,
    });
    return res.status(201).json({
      message: "Post created successfully!",
      post: {
        id: new Date().toISOString(),
        title: title,
        content: content,
        imageUrl,
      },
    });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  const postID = req.params.postId;
  const imageUrl = req.file ? req.file.path : null;
  const title = req.body.title;
  const content = req.body.content;

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    return next(error);
    // throw error;
    // next(error);
  }

  // if (!req.file) {
  //   const error = new Error("No image provided.");
  //   error.statusCode = 422;
  //   throw error;
  // }

  try {
    if (imageUrl) {
      post = await Post.findAll({
        where: {
          id: postID,
        },
      });
      clearImage(post[0].dataValues.imageUrl);
      await Post.update(
        { imageUrl, title, content },
        {
          where: {
            id: postID,
          },
        }
      );
    } else {
      await Post.update(
        { title, content },
        {
          where: {
            id: postID,
          },
        }
      );
    }

    return res.status(200).json({ message: "Post updated!" });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

getPost = async (req, res, next) => {
  const postID = req.params.postId;
  try {
    const post = await Post.findAll({
      where: {
        id: postID,
      },
    });
    console.log(post[0].dataValues);
    return res.status(200).json({
      post: post[0].dataValues,
    });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

deletePost = async (req, res, next) => {
  const postID = req.params.postId;
  try {
    post = await Post.findAll({
      where: {
        id: postID,
        AuthorId: req.userId,
      },
    });

    // await Post.destroy({
    //   truncate: true,
    // });
    await Post.destroy({
      where: {
        id: postID,
        AuthorId: req.userId,
        // AuthorId: req.userId ===
      },
    });
    // console.log(post[0].dataValues.imageUrl);
    clearImage(post[0].dataValues.imageUrl);
    // clearImage(post[0].dataValues.imageUrl);
    res.status(200).json({ message: "Deleted post." });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }

  //  const imageUrl = Post
  //  const imagePath = path.join(__dirname, "..", imageUrl)
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

module.exports = {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
};

// exports.getPosts = (req, res, next) => {
//   res.status(200).json({
//     posts: [{ title: "First Post", content: "This is the first post!" }],
//   });
// };

// exports.createPost = (req, res, next) => {
//   const title = req.body.title;
//   const content = req.body.content;
//   // Create post in db
//   res.status(201).json({
//     message: "Post created successfully!",
//     post: { id: new Date().toISOString(), title: title, content: content },
//   });
// };
