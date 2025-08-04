const mongoose = require('mongoose');

const pharmacyDeviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },

  role:{
    type:String,
    default:"device"
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PharmacyDevice', pharmacyDeviceSchema);
