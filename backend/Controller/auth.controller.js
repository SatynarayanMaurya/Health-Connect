const Doctor = require("../Models/doctor.model")
const Admin = require("../Models/AdminSchema.model")
const PharmacyDevice = require("../Models/pharmacyDeviceSchema.model")

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.signup = async(req,res)=>{
    try{
        const {selectedRole,name,email,password, specialization,latitude,longitude,deviceId} = req.body;
        if(!selectedRole){
            return res.status(400).json({
                success:false,
                message:"Role is not find"
            })
        }

        if(selectedRole === "admin"){

            if(!name || !email || !password){
                return res.status(400).json({
                    success:false,
                    message:"Required field are mandatory !"
                })
            }

            if(email === "admin@gmail.com"){
                const existingUser = await Admin.findOne({email})
                if(!existingUser){
                    const hashPassword = await bcrypt.hash(password,10)
                    await Admin.create({name,email,password:hashPassword})
                    return res.status(201).json({
                        success:true,
                        message:"Admin signup successfull"
                    })
                }
                else{
                    return res.status(401).json({
                        success:false,
                        message:"An admin account with this email already exists. Please log in instead."
                    })
                }
            }
            else{
                return res.status(401).json({
                    success:false,
                    message:"Signup restricted: Only authorized admin accounts can register."
                })
            }


        }
        else if (selectedRole === "doctor"){
            if(!name || !email || !password){
                return res.status(400).json({
                    success:false,
                    message:"Required field are mandatory !"
                })
            }
            const existingUser = await Doctor.findOne({email})
            if (existingUser) {
                return res.status(409).json({
                success: false,
                message: "Registration failed: Doctor account already exists."
                });
            }
            const hashPassword = await bcrypt.hash(password,10)
            await Doctor.create({email,name,specialization,password:hashPassword})
            return res.status(201).json({
                success:true,
                message:"Doctor signup successfull"
            })
        }
        else{
            if(!deviceId || !password || !longitude || !latitude){
                return res.status(400).json({
                    success:false,
                    message:"Required field are mandatory !"
                })
            }
            const existingUser = await PharmacyDevice.findOne({deviceId})
            if (existingUser) {
                return res.status(409).json({
                success: false,
                message: "A device with this ID is already registered."
                });
            }
            const hashPassword = await bcrypt.hash(password,10)
            await PharmacyDevice.create({deviceId,password:hashPassword,latitude,longitude})
            return res.status(201).json({
                success:true,
                message:"Device signup successfull"
            })

        }
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while signup ",
            errorMessage:error.message
        })
    }
}


exports.login = async(req,res)=>{
    try{
        const {email,password,deviceId,selectedRole} = req.body;
        if(!selectedRole){
            return res.status(401).json({
                success:false,
                message:"Role is not found"
            })
        }

        if(selectedRole === "admin"){
            if(!email || !password){
                return res.status(400).json({
                    success:false,
                    message:"Required Field are missing !"
                })
            }
            const existingUser = await Admin.findOne({email})
            if(!existingUser){
                return res.status(401).json({
                    success:false,
                    message:"No admin account found with this email"
                })
            }
            if( await bcrypt?.compare(password,existingUser?.password )){
                const token = jwt.sign(
                    {
                        email:existingUser?.email,
                        name:existingUser?.name,
                        userId:existingUser?._id,
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn:"7d"
                    }
                )

                const isProduction = process.env.NODE_ENV === "production";

                const cookieOptions = {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "None" : "Lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: "/",
                };
                
                return res.cookie("token", token, cookieOptions).status(200).json({
                    success: true,
                    message: "Login complete. Access granted",
                    token, 
                    userDetails:existingUser
                });
            }
            else{
                return res.status(401).json({
                    success:false,
                    message:"Incorrect password. Please try again."
                })
            }

        }

        else if (selectedRole === "doctor" ){
            const existingUser = await Doctor.findOne({email})
            if(!existingUser){
                return res.status(401).json({
                    success:false,
                    message:"No doctor account found with this email"
                })
            }
            if( await bcrypt?.compare(password,existingUser?.password )){
                const token = jwt.sign(
                    {
                        email:existingUser?.email,
                        name:existingUser?.name,
                        userId:existingUser?._id,
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn:"7d"
                    }
                )

                const isProduction = process.env.NODE_ENV === "production";

                const cookieOptions = {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "None" : "Lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: "/",
                };
                
                return res.cookie("token", token, cookieOptions).status(200).json({
                    success: true,
                    message: "Login complete. Access granted",
                    token, 
                    userDetails:existingUser
                });
            }
            else{
                return res.status(401).json({
                    success:false,
                    message:"Incorrect password. Please try again."
                })
            }
        }
        
        else{
            const existingUser = await PharmacyDevice.findOne({deviceId})
            if(!existingUser){
                return res.status(401).json({
                    success:false,
                    message:"No device account found with this ID."
                })
            }
            if( await bcrypt?.compare(password,existingUser?.password )){
                const token = jwt.sign(
                    {
                        deviceId:existingUser?.deviceId,
                        userId:existingUser?._id,
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn:"7d"
                    }
                )

                const isProduction = process.env.NODE_ENV === "production";

                const cookieOptions = {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "None" : "Lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: "/",
                };

                await PharmacyDevice?.findByIdAndUpdate(existingUser?._id,{$set:{lastActive:Date.now()}})
                
                return res.cookie("token", token, cookieOptions).status(200).json({
                    success: true,
                    message: "Login complete. Access granted",
                    token, 
                    userDetails:existingUser
                });
            }
            else{
                return res.status(401).json({
                    success:false,
                    message:"Incorrect password. Please try again."
                })
            }
        }
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error in login ",
            errorMessage:error.message
        })
    }
}

exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found in request.",
      });
    }

    // Try finding the user from all 3 models
    const userDetails =
      (await Admin.findById(userId)) ||
      (await Doctor.findById(userId)) ||
      (await PharmacyDevice.findById(userId));

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully.",
      userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving user details.",
      errorMessage: error.message,
    });
  }
};


exports.logout = async (req, res) => {
    try{

        res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV==="production", sameSite: "Strict" });
        res.status(200).json({ message: "Logged out successfully 🥺" });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error in logout in backend ",
            errorMessage:error.message
        })
    }
}
