const jwt = require("jsonwebtoken")

exports.authMiddleware = async (req,res,next)=>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(400).json({
                success:false,
                message:"Token not Found"
            })
        }
        try{

            const decode =  jwt.verify(token,process.env.JWT_SECRET)
            req.user = decode;
            next();
        }
        catch(error){
            return res.status(401).json({
                success:false,
                message:"Invalid Token"
            })
        }

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error in auth middleware",
            errorMessage:error?.message
        })
    }
}