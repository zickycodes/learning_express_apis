const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
const sequelize = require("./util/database");
const morgan = require("morgan");
const helmet = require("helmet");
const fs = require("fs");

// Models
const Post = require("./model/post");
const Author = require("./model/author");

// Routes
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
// const authRoutes = require("./routes/auth");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use("/images", express.static(path.join(__dirname, "images")));

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

// When client sides and servers are hosted on different hosts
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

Author.hasMany(Post, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Post.belongsTo(Author, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

sequelize
  .authenticate()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log("I'm fucking ready for connections");
    });
    console.log("connected to the db");
  })
  .catch((err) => {
    console.log(err);
  });

// { alter: true }
sequelize
  .sync()
  .then(() => {
    console.log("Pushed");
  })
  .catch((err) => console.log(err));
