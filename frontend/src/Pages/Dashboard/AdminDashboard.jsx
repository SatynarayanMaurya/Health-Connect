import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "../../Components/socket"; // shared socket instance
import {  devicesEndpoints, doctorEndpoints } from "../../Services/apis";
import { useDispatch, useSelector } from "react-redux";
import { setAllDevices, setAllDoctors, setLoading } from "../../Redux/Slices/userSlice";
import { toast } from "react-toastify";
import { apiConnector } from "../../Services/apiConnector";
import { motion } from "framer-motion";
import { FaUserMd, FaHeartbeat, FaLaptopMedical, FaCapsules } from "react-icons/fa";
import { MdOutlineDevicesOther } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import LogoutModal from "../../Components/LogoutModal";
const AdminDashboard = () => {

  const [isLogoutModal,setIsLogoutModal] = useState(false)
  const dispatch = useDispatch()
  const loading = useSelector((state)=>state.user.loading);
  const allDoctors = useSelector((state)=>state.user.allDoctors)
  const allDevices = useSelector((state)=>state.user.allDevices)


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

  const getAllDevices = async()=>{
    try{
      if(allDevices) return ;
      dispatch(setLoading(true))
      const result = await apiConnector("GET",devicesEndpoints.GET_ALL_DEVICES)
      dispatch(setAllDevices(result?.data?.allDevices))
      dispatch(setLoading(false))
    }
    catch(error){
      dispatch(setLoading(false))
      console.log("Error in getting all the Devices : ",error)
      toast.error(error?.response?.data?.message || "Error in getting all devices")
    }
  }

  useEffect(() => {
    getAllDoctors();
    getAllDevices()
  }, []);

  const [connectedUsers, setConnectedUsers] = useState({});
  console.log("Connected User : ",connectedUsers)
  useEffect(() => {
    // Request connected users from backend
    socket.emit("admin:requestConnectedUsers");

    // Listen for connected users list
    socket.on("admin:connectedUsers", (data) => {
      setConnectedUsers(data);
    });

    // Cleanup on unmount
    return () => {
      socket.off("admin:connectedUsers");
    };
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="flex justify-between">

      
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-blue-900 mb-6 flex items-center gap-2"
        >
          <FaCapsules className="text-pink-600" />
          Admin Dashboard
        </motion.h1>

      
        <motion.h1
          onClick={()=>setIsLogoutModal(true)}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold text-red-500 mb-6 flex items-center gap-2 cursor-pointer"
        >
          <FiLogOut className="text-red-500" />
          Logout
        </motion.h1>
      </div>

    {/* Live Sessions */}
    {connectedUsers && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-6 bg-white rounded-2xl shadow-md border border-blue-100"
      >
        {/* Doctors Live */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
            <FaUserMd className="text-green-500" />
            Doctors Engaged in Live Sessions
          </h3>
          {
            Object.entries(connectedUsers)?.length===0 ? 
            <div className="text-blue-500">No Doctors Engaged in Live Sessions</div>:
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(connectedUsers)
                .filter(([_, role]) => role === "doctor")
                .map(([userId]) => {
                  const doctor = allDoctors?.find((doc) => doc?._id === userId);
                  return (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      key={userId}
                      className="flex items-center justify-between bg-green-50 p-4 rounded-xl border border-green-200 shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-green-600 text-lg animate-pulse">🟢</span>
                        <div>
                          <p className="font-medium text-gray-800">{doctor?.name || "Unknown"}</p>
                          <p className="text-sm text-gray-600">Specialization: {doctor?.specialization || "General"}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          }
        </div>

        {/* Devices Live */}
        <div>
          <h3 className="text-2xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
            <MdOutlineDevicesOther className="text-blue-500" />
            Devices Engaged in Live Sessions
          </h3>
          {
            Object.entries(connectedUsers)?.length === 0 ?
            <div className="text-blue-500">No Devices Engaged in Live Sessions</div>:
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(connectedUsers)
                .filter(([_, role]) => role === "device")
                .map(([userId]) => {
                  const device = allDevices?.find((doc) => doc?._id === userId);
                  return (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      key={userId}
                      className="flex items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-blue-600 text-lg">📶</span>
                        <div>
                          <p className="font-medium text-gray-800">{device?.deviceId || "Unknown Device"}</p>
                          <p className="text-sm text-gray-500">Registered At: {formatDate(device?.registeredAt)}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          }
        </div>
      </motion.div>
    )}

    {/* Divider */}
    <div className="my-10 border-t border-gray-300" />

    {/* Doctors List */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="p-6 bg-white rounded-2xl shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-4 text-blue-900 flex gap-2 items-center">
        <FaHeartbeat className="text-pink-500" />
        All Doctors
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {allDoctors?.map((doc) => (
          <motion.div
            whileHover={{ scale: 1.02 }}
            key={doc._id}
            className="bg-gray-50 p-5 rounded-xl border hover:shadow-md transition"
          >
            <p className="font-medium text-gray-800">{doc.name}</p>
            <p className="text-sm text-gray-600">{doc.email}</p>
            <div className="flex items-center mt-2 gap-2">
              <span
                className={`h-3 w-3 rounded-full ${
                  doc?.isAvailable ? "bg-green-500" : "bg-red-400"
                }`}
              />
              <span className="text-sm">
                {doc?.isAvailable ? "Online" : "Offline"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>

    {/* Devices List */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="p-6 bg-white rounded-2xl shadow-md my-10"
    >
      <h2 className="text-2xl font-semibold mb-4 text-blue-900 flex gap-2 items-center">
        <FaLaptopMedical className="text-purple-600" />
        Registered Devices
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {allDevices?.map((device) => (
          <motion.div
            whileHover={{ scale: 1.02 }}
            key={device._id}
            className="bg-gray-50 p-5 rounded-xl border hover:shadow-md transition"
          >
            <p className="font-medium text-gray-800">Device ID: {device.deviceId}</p>
            <p className="text-sm text-gray-600">Last Active: {formatDate(device?.lastActive)}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>

    {/* Logout Modal  */}
    <>
      {
        isLogoutModal &&
        <LogoutModal closeModal={()=>setIsLogoutModal(false)}/>
      }
    </>
  </div>
  );
};

export default AdminDashboard;
