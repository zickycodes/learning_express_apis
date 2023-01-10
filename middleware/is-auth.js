const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.get("Authorization");
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "somesupersecretsecret");
  } catch (e) {
    e.stausCode = 500;
  }

  if (!decodedToken) {
    const error = new Error("Not Authenticated");
    error.stausCode = 401;
    return next(error);
  }

  req.userId = decodedToken.userId;
  next();
};
