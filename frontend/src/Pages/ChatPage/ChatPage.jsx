import React, { useEffect, useRef, useState } from "react";
import { apiConnector } from "../../Services/apiConnector";
import { authEndpoints, chatEndpoints, doctorEndpoints } from "../../Services/apis";
import { useParams } from 'react-router-dom';
import socket from "../../Components/socket"; // Shared socket instance
import { useDispatch, useSelector } from "react-redux";
import { setAllDoctors, setLoading, setUserDetails } from "../../Redux/Slices/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import ChatLeftSidebar from "./ChatLeftSidebar";
import ChatSkeleton from "./ChatSkeleton";
const ChatPage = ({ userId, peerId }) => {

  const dispatch = useDispatch();
  const { doctorId } = useParams()
  const refreshUser = useSelector((state)=>state.user.refreshUser)
  const loading = useSelector((state)=>state.user.loading)
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const chatEndRef = useRef(null);
  const allDoctors = useSelector((state)=>state.user.allDoctors)
  

  const userDetails = useSelector((state)=>state.user.userDetails)
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  const getUserDetails = async () => {
    try {
      if(userDetails) return;
      dispatch(setLoading(true))
      const result = await apiConnector("GET", authEndpoints.GET_USER_DETAILS)
      dispatch(setUserDetails(result?.data?.userDetails))
    } catch (error) {
      console.error("Error in getting user details:", error)
      toast.error(error?.response?.data?.message || "Error in getting user details")
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    getUserDetails()
  }, [refreshUser])

  const getAllDoctors = async () => {
    try {
      if (allDoctors?.length > 0) return;
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

  useEffect(() => {
    if (!userDetails?._id) return;

    socket.emit("join", userDetails?._id,"device");
    socket.off("chat:message").on("chat:message", (data) => {
      setChatHistory((prev) => [...prev, {
        sender: data.from,
        message: data.message,
        replyTo: data.replyTo || null,
      }]);
    });

    const fetchChatHistory = async () => {
      try {
        dispatch(setLoading(true))
        const res = await apiConnector("GET", chatEndpoints.GET_CHATS(userDetails?._id, doctorId));
        console.log("Result is : ",res)
        setChatHistory(res?.data || []);
        dispatch(setLoading(false))
    } catch (err) {
        dispatch(setLoading(false))
        console.error("Chat history fetch failed:", err);
      }
    };

    fetchChatHistory();

    return () => {
      socket.off("chat:message");
    };
  }, [userDetails?._id, doctorId]);

  useEffect(scrollToBottom, [chatHistory]);

  const sendMessage = () => {
    if (!message.trim()) return;


    socket.emit("chat:message", {
        from: userDetails?._id,
        to: doctorId,
        message: message,
    });

    setChatHistory((prev) => [...prev, {
      sender: userDetails?._id,
      message,
    }]);

    setMessage("");
    setReplyTo(null);
  };

  return (
    <div className="flex justify-between ">
        <div className="w-[15%]">
            <ChatLeftSidebar/>
        </div>

        <div className="p-6 w-[80%] mx-auto bg-white shadow-md rounded-xl min-h-screen">
        <h2 className="text-xl font-bold mb-4">Chat with {allDoctors?.find((doc)=>doc?._id === doctorId)?.name || "Unknown"}</h2>
        
        <div className="space-y-2 mb-4 bg-[#F5F1EB] h-[78vh] overflow-y-auto scrollbar-slim border border-gray-300 rounded p-4">
            {loading ? <ChatSkeleton/> :
            chatHistory?.map((msg, index) => (
            <div
                key={index}
                className={`flex  ${
                msg.sender === userDetails?._id ? "justify-end" : " justify-start"
                }`}
            >
                <div className={`p-2 rounded-md max-w-lg break-words ${
                    msg.sender === userDetails?._id ? "bg-[#D9FDD3] px-4" : "bg-white px-4"
                    }`}>{msg.message}</div>
            </div>
            ))}
            <div ref={chatEndRef}></div>
            
        </div>


        <div className="flex gap-2">
            <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="border border-gray-300 rounded w-full p-3 px-5"
            placeholder="Type your message"
            />
            <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-8 py-2 rounded"
            >
            Send
            </button>
        </div>
        </div>
    </div>

  );
};

export default ChatPage;
