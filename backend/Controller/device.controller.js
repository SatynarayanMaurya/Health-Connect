const PharmacyDevice = require("../Models/pharmacyDeviceSchema.model")



exports.getAllDevices = async (req,res)=>{
    try{
        const allDevices = await PharmacyDevice.find()
        return res.status(200).json({
            success:true,
            message:"All Devices fetched successfully",
            allDevices
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error in getting all the Devices ",
            errorMessage:error.message
        })
    }
}