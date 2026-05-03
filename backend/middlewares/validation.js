const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req._id = decoded._id;

    next();
  } catch (error) {
    return res.status(401).send("Invalid token");
  }
};

module.exports = { validateToken };
