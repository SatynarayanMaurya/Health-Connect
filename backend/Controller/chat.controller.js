const Message = require("../Models/message.model")

exports.getChats = async (req, res) => {
  const { userId, peerId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: peerId },
        { sender: peerId, receiver: userId },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } 
  catch (err) {
    res.status(500).json({ error: "Failed to get messages" });
  }
}

// For doctor dashboard
exports.getDoctorChats = async(req,res)=>{
  try{
    const {deviceId} = req.params;
    console.log("Device id : ",deviceId)
    const messages = await Message.find({
      $or: [
        { sender: req.user.userId, receiver: deviceId },
        { sender: deviceId, receiver: req.user.userId },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);

  }
  catch(error){
    res.status(500).json({ error: "Failed to get messages",errorMessage:error?.messages });
  }
}