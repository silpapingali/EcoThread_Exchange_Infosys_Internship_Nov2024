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
module.exports={verifyToken,isAdmin}