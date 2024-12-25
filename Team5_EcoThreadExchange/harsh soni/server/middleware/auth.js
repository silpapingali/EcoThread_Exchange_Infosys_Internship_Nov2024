const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  console.log("Token received:", token); // Debugging line
  if (!token) return res.status(401).send("Access denied.");

  try {
    const verified = jwt.verify(token, process.env.JWTPRIVATEKEY);
    req.user = verified; // Attach user info to request
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
};

module.exports = auth; 