import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setAllDoctors, setLoading } from "../../Redux/Slices/userSlice";
import { apiConnector } from "../../Services/apiConnector";
import { doctorEndpoints } from "../../Services/apis";
import socket from "../../Components/socket"; // Import socket instance
import { motion } from "framer-motion";
import { FaUserMd, FaHeartbeat } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import LogoutModal from "../../Components/LogoutModal";
const DeviceDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = useSelector((state)=>state.user.userDetails)
  const [isLogoutModal,setIsLogoutModal] = useState(false)

  const allDoctors = useSelector((state) => state.user.allDoctors);
  const deviceId = userDetails?._id


  const getAllDoctors = async () => {
    try {
      if (allDoctors) return;
      dispatch(setLoading(true));
      const result = await apiConnector("GET", doctorEndpoints.GET_ALL_DOCTORS);
      dispatch(setAllDoctors(result?.data?.allDoctors));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      toast.error(error?.response?.data?.message || "Error in getting all doctors");
    }
  };

  useEffect(() => {
    getAllDoctors();
  }, []);
  
  const handleChatRequest = (doctorId) => {
    if (!deviceId) return alert("Device not identified! Refresh Again");

    // Emit chat initiation event
    socket.emit("chat:initiate", {
      from: deviceId,
      to: doctorId,
      message: "Hello Doctor, we need assistance.",
    });

    // Navigate to Chat Page with params
    navigate(`/chat/${deviceId}/${doctorId}`, {
      state: { deviceId },
    });
  };

  return (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
    {/* Header */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10 text-center relative"
    >
      <h1 className="text-4xl font-bold text-blue-900 mb-2 flex justify-center items-center gap-2">
        <FaUserMd className="text-green-600" />
        Device Dashboard
      </h1>

      <div onClick={()=>setIsLogoutModal(true)} className="absolute right-4 cursor-pointer top-0 flex items-center gap-2 text-red-500 text-lg">
        <FiLogOut/>
        <p>Logout</p>
      </div>

      <p className="text-gray-600 text-sm">Connect with available doctors in real-time</p>
    </motion.div>


    {/* Doctors Grid */}
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {allDoctors?.map((doc, index) => (
        <motion.div
          key={doc._id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6"
        >
          {/* Avatar & Name */}
          <div className="flex items-center gap-4 mb-4">
            <img
              src={doc?.avatar || `https://i.pravatar.cc/10${index}`}
              alt="Doctor Avatar"
              className="w-14 h-14 rounded-full border object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{doc.name}</h2>
              <p className="text-sm text-gray-500">{doc.specialization}</p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`h-3 w-3 rounded-full ${
                doc?.isAvailable ? "bg-green-500" : "bg-red-400"
              }`}
            ></span>
            <span className="text-sm text-gray-600">
              {doc?.isAvailable ? "Online" : "Offline"}
            </span>
          </div>

          {/* Button */}
          <button
            onClick={() => handleChatRequest(doc._id)}
            disabled={!doc?.isAvailable}
            className={`w-full py-2 px-4 rounded-xl text-white font-semibold transition ${
              doc?.isAvailable
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {doc?.isAvailable ? "Start Chat" : "Doctor Unavailable"}
          </button>
        </motion.div>
      ))}
    </div>

    {/* Logout  */}
    <>
      {
        isLogoutModal &&
        <LogoutModal closeModal={()=>setIsLogoutModal(false)}/>
      }
    </>
  </div>
  );
};

export default DeviceDashboard;
