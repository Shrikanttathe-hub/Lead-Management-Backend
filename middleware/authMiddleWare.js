const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({status:false, message: "Access Denied ! Super Admin Only" });
    try{
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    }
    catch(error){
        console.log("JWT ERROR:", error.message);
        return res.status(401).json({status: false, message: "Invalid Token"});
    }
}

module.exports = authMiddleware;
