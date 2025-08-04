
const express = require("express");
const router = express.Router();

const { signup, login, getUserDetails, logout } = require("../Controller/auth.controller");
const { authMiddleware } = require("../Middlewares/auth.middleware");
const { getAllDoctors, updateDoctorAvailability } = require("../Controller/doctor.controller");
const { getAllDevices } = require("../Controller/device.controller");
const { getChats, getDoctorChats } = require("../Controller/chat.controller");



router.post("/api/signup",signup)
router.post("/api/login",login)
router.post("/api/logout",logout)
router.get("/api/get-user-details",authMiddleware,getUserDetails)

router.get("/api/get-all-doctors",authMiddleware,getAllDoctors)
router.put("/api/update-doctor-availability",authMiddleware,updateDoctorAvailability)
router.get("/api/get-doctor-chats/:deviceId",authMiddleware,getDoctorChats)


router.get("/api/get-all-devices",authMiddleware,getAllDevices)



router.get("/:userId/:peerId", authMiddleware,getChats);

module.exports = router