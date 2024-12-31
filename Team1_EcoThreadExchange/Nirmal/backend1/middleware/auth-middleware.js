const jwt=require("jsonwebtoken");

function isAdmin(req,res,next){
    if(req.user && req.user.isAdmin){
        next();
    }
    else{
        return res.status(403).send({
            error:"Forbidden",
        });
    }
}

function verifyToken(req, res, next) {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).send({ error: "Access Denied. No token provided." });
    }
    try {
      const decoded = jwt.verify(token.replace("Bearer ", ""), "seceret");  
      req.user = decoded; 
      next();  
    } catch (err) {
      return res.status(401).send({ error: "Invalid token." });
    }
  }


  function authenticate(req, res, next) {
    // Verify the user using session or token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    // Decode token and attach user info to the request (adjust for your logic)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.userId }; // Add `userId` to req.user
    next();
}

module.exports={verifyToken,isAdmin,authenticate}