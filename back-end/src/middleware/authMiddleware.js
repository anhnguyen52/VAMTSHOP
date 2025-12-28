const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authAdminMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token provided",
      status: "ERROR",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).json({
        message: "Token Expired Error",
        status: "ERROR",
      });
    }

    req.user = decoded.payload;

    if (decoded.payload?.role === "ADMIN") {
      next();
    } else {
      return res.status(403).json({
        message: "The authentication",
        status: "ERROR",
      });
    }
  });
};

const authUserMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token provided",
      status: "ERROR",
    });
  }

  const token = authHeader.split(" ")[1];
  const userId = req.params.id;

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(404).json({
        message: "The authenticationsss",
        status: "ERROR",
      });
    }

    req.user = decoded.payload;
    console.log("Decoded payload:", req.user);

    if (decoded.payload?.role || decoded.payload?.id === userId) {
      next();
    } else {
      return res.status(404).json({
        message: "The authentication",
        status: "ERROR",
      });
    }
  });
};

module.exports = {
  authAdminMiddleware,
  authUserMiddleware
};
