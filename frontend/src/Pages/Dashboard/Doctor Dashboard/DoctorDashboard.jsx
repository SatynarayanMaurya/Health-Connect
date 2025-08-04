import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {  clearUserDetails, setAllDevices, setLoading,  triggerUserRefresh,} from "../../../Redux/Slices/userSlice";
import { toast } from "react-toastify";
import { apiConnector } from "../../../Services/apiConnector";
import { devicesEndpoints, doctorEndpoints } from "../../../Services/apis";
import { FiLogOut } from "react-icons/fi";
import LogoutModal from "../../../Components/LogoutModal";
import socket from "../../../Components/socket"; // your socket instance
import Spinner from "../../../Components/Spinner";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const loading = useSelector((state) => state.user.loading);
  const [isLogoutModal, setIsLogoutModal] = useState(false);
  const allDevices = useSelector((state)=>state.user.allDevices)
  const userDetails = useSelector((state) => state.user.userDetails);

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

  useEffect(()=>{
    getAllDevices()
  },[])


  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

  const formattedTime = twoMinutesAgo.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const [activeSession] = useState({
    patientName: "John Doe",
    startedAt: formattedTime,
    status: "Ongoing",
  });


  const [activityLogs, setActivityLogs] = useState([
    "✅ Last login at 9:45 AM",
    `✅ Marked as ${userDetails?.isAvailable ? "Available":"Unavailable"}`,
    `✅ Started session with John Doe`,
    "✅ Updated profile",
  ]);

  const appointmentStats = [
    { name: "Mon", count: 2 },
    { name: "Tue", count: 5 },
    { name: "Wed", count: 3 },
    { name: "Thu", count: 4 },
    { name: "Fri", count: 1 },
    { name: "Sat", count: 6 },
    { name: "Sun", count: 2 },
  ];

  const toggleAvailability = async () => {
    try {
      dispatch(setLoading(true));
      const result = await apiConnector(
        "PUT",
        doctorEndpoints.UPDATE_DOCTOR_AVAILABILITY,
        { available: userDetails?.isAvailable }
      );
      toast.success(result?.data?.message || "Doctor Status Updated");
      dispatch(clearUserDetails())
      dispatch(triggerUserRefresh());
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Error in updating the Doctor availability"
      );
      console.log("Error in updating the doctor availability : ", error);
    } finally {
      dispatch(setLoading(false));
    }
  };



  useEffect(() => {
    if (!userDetails?._id) return;

    socket.emit("join", userDetails._id);
    socket.on("chat:message", (data) => {
      const entry = `💬 Message from ${allDevices?.find((dev)=>dev?._id === data?.from)?.deviceId} : ${data.message}`;
      setActivityLogs((prev) => [entry, ...prev.slice(0, 4)]);
      toast.info(`New message from device ${allDevices?.find((dev)=>dev?._id === data?.from)?.deviceId || "Unknown"}`, { autoClose: 5000 });
    });


    return () => {
      socket.off("chat:message");
    };
  }, [userDetails?._id]);



  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6"
  >
    {loading && <Spinner />}

    {/* Header */}
    <div className="flex justify-between items-center mb-8">
      <motion.h1
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-blue-900"
      >
        Doctor Dashboard
      </motion.h1>
      <div className="flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            navigate(
              `/chat-with-pharmacy-device/${allDevices?.[0]?._id || "pharmdev_001"}`
            )
          }
          className="px-5 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          Go To Chat
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleAvailability}
          className={`px-5 py-2 rounded-md text-white font-medium transition ${
            userDetails?.isAvailable
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {userDetails?.isAvailable ? "Online" : "Offline"}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsLogoutModal(true)}
          className="px-5 text-xl py-2 rounded-md text-white bg-red-500 hover:bg-red-600 transition"
        >
          <FiLogOut />
        </motion.button>
      </div>
    </div>

    {/* Doctor Card */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl shadow-xl p-6 flex flex-col sm:flex-row items-center gap-6 mb-6"
    >
      <img
        src="https://i.pravatar.cc/100"
        alt="Doctor"
        className="w-24 h-24 rounded-full border object-cover"
      />
      <div className="text-center sm:text-left">
        <h2 className="text-xl font-semibold text-gray-800">
          {userDetails?.name || "Dr. Placeholder"}
        </h2>
        <p className="text-gray-500">
          Specialization: {userDetails?.specialization || "General"}
        </p>
        <p className="text-gray-500">
          Status:{" "}
          <span
            className={
              userDetails?.isAvailable ? "text-green-600" : "text-red-600"
            }
          >
            {userDetails?.isAvailable ? "Available" : "Unavailable"}
          </span>
        </p>
      </div>
    </motion.div>

    {/* Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Active Session */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl shadow p-6 transition"
      >
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Active Session
        </h3>
        {activeSession ? (
          <div className="space-y-1 text-sm text-gray-700">
            <p>
              <strong>Device:</strong>{" "}
              {allDevices?.[0]?.deviceId || "pharmdev_001"}
            </p>
            <p>
              <strong>Start Time:</strong> {activeSession.startedAt}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="text-green-600">{activeSession.status}</span>
            </p>
            <button
              onClick={() =>
                navigate(
                  `/chat-with-pharmacy-device/${allDevices?.[0]?._id || "pharmdev_001"}`
                )
              }
              className="mt-3 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
            >
              View Details
            </button>
          </div>
        ) : (
          <p className="text-gray-500">No active sessions.</p>
        )}
      </motion.div>

      {/* Activity Log */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl shadow p-6"
      >
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Recent Activity
        </h3>
        <ul className="text-sm text-gray-600 space-y-1">
          {activityLogs.map((log, idx) => (
            <li key={idx}>{log}</li>
          ))}
        </ul>
      </motion.div>

      {/* Patients Summary */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center"
      >
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Patients Today
        </h3>
        <p className="text-4xl font-bold text-blue-600">8</p>
        <span className="text-sm text-gray-500 mt-2">Updated just now</span>
      </motion.div>
    </div>

    {/* Chart */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-xl shadow p-6 mt-6"
    >
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Weekly Appointments
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={appointmentStats}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>


    {/* Logout Modal */}
    {isLogoutModal && (
      <LogoutModal closeModal={() => setIsLogoutModal(false)} />
    )}
  </motion.div>
  );
};

export default DoctorDashboard;
