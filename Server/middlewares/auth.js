const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY || "Se3c4r4e4tk4e0y";

const auth = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      } else {
        req.user = decoded; // Attach the decoded token payload to the req object
        next();
      }
    });
  } else {
    return res.sendStatus(401); // Unauthorized
  }
};

module.exports = auth;
