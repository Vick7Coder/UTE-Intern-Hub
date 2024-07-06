import jwt, { decode } from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

const userAuth = async(req,res,next)=>{

    try {

    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader?.startsWith("Bearer")){
       return res.status(401).json({error:"Authentication failed: Token missing or malformed"})
    }

    const token = authHeader?.split(" ")[1];

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      req.user = {
        userId: decoded.userId,
      };
  
      next();
    
      
    } catch (error) {
      console.log(error);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Authentication failed: Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Authentication failed: Invalid token' });
    } else {
        return res.status(500).json({ error: 'Internal server error' });
    }
    }
}

export default userAuth;