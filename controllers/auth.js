const Author = require("../model/author");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errA = errors.array();
    const errMe = errA[0].msg;
    console.log(errMe);
    const error = new Error(errMe);
    error.statusCode = 422;
    // error.data = errors.array();
    return next(error);
  }
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  // console.log(user);
  // console.log("e", email);
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await Author.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    // await Author.destroy({ truncate: true });
    res.status(201).json({ message: "User created!", userId: result.id });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

const login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await Author.findAll({
      where: {
        email: email,
      },
    });

    if (user.length === 0) {
      const error = new Error("No user with that email is found");
      error.statusCode = 401;
      return next(error);
    }
    const confirmedPassword = await bcrypt.compare(
      password,
      user[0].dataValues.password
    );

    if (!confirmedPassword) {
      const error = new Error("Password is incorrect");
      error.statusCode = 401;
      return next(error);
    } else {
      const token = jwt.sign(
        {
          email: user[0].dataValues.email,
          userId: user[0].dataValues.id,
        },
        "somesupersecretsecret",
        { expiresIn: "1h" }
      );
      res.status(200).json({ token: token, userId: user[0].dataValues.id });
    }
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

module.exports = {
  signup,
  login,
};
