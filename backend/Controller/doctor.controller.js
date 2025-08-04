const Doctor = require("../Models/doctor.model")


exports.getAllDoctors = async (req,res)=>{
    try{
        const allDoctors = await Doctor.find()
        return res.status(200).json({
            success:true,
            message:"All Doctors fetched successfully",
            allDoctors
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error in getting all the doctors ",
            errorMessage:error.message
        })
    }
}


exports.updateDoctorAvailability = async(req,res)=>{
    try{
        const {available} = req.body;
        await Doctor.findByIdAndUpdate(req.user.userId,{isAvailable:!available})
        return res.status(200).json({
            success:true,
            message:"Status Updated ",
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error in updating the doctor status",
            errorMessage:error.message
        })
    }
}