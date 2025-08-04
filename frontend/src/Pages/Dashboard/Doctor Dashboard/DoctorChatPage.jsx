import React, { useEffect, useRef, useState } from 'react'
import DoctorChatLeftSidebar from './DoctorChatLeftSidebar'
import { useDispatch, useSelector } from 'react-redux'
import { setAllDevices, setLoading, setUserDetails } from '../../../Redux/Slices/userSlice'
import { toast } from 'react-toastify'
import { apiConnector } from '../../../Services/apiConnector'
import { authEndpoints, devicesEndpoints, doctorEndpoints } from '../../../Services/apis'
import Spinner from '../../../Components/Spinner'
import { useLocation } from 'react-router-dom'
import ChatSkeleton from '../../ChatPage/ChatSkeleton'
import socket from '../../../Components/socket'

function DoctorChatPage() {

    const userDetails = useSelector((state)=>state.user.userDetails)
    const dispatch = useDispatch()
    const [chatHistory, setChatHistory ] = useState([])
    const [message , setMessage ] = useState("")
    const loading = useSelector((state)=>state.user.loading)
    const refreshUser = useSelector((state)=>state.user.refreshUser)
    const allDevices = useSelector((state)=>state.user.allDevices)
    const location = useLocation();
    const deviceId = location?.pathname?.split("/")?.pop();
    const chatEndRef = useRef(null);
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    
  const getUserDetails = async () => {
    try {
      if(userDetails) return ;
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
        getUserDetails()
    }, [refreshUser])

    useEffect(()=>{
        getAllDevices()
    },[])

  useEffect(() => {
    if (!userDetails?._id ) return;

    socket.emit("join", userDetails?._id,"doctor");
    socket.off("chat:message").on("chat:message", (data) => {
        if(data.from === deviceId){
            setChatHistory((prev) => [...prev, {
                sender: data.from,
                message: data.message,
            }]);
        }
        else{
            toast.info(`New message from device ${allDevices?.find((dev)=>dev?._id === deviceId)?.deviceId || "Unknown"}`, { autoClose: 5000 });
        }
    });

    const fetchChatHistory = async () => {
      try {
        dispatch(setLoading(true))
        const res = await apiConnector("GET",doctorEndpoints.GET_DOCTOR_CHATS(deviceId));
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
  }, [userDetails?._id,deviceId ]);


   useEffect(scrollToBottom, [chatHistory]);


  const sendMessage = () => {
    if (!message.trim()) return;


    socket.emit("chat:message", {
        from: userDetails?._id,
        to: deviceId,
        message: message,
    });

    setChatHistory((prev) => [...prev, {
      sender: userDetails?._id,
      message,
    }]);

    setMessage("");
  }

  if (loading) return <Spinner />

  return (
    <div className="flex justify-between ">
        <div className="w-[15%]">
            <DoctorChatLeftSidebar/>
        </div>

        <div className="p-6 w-[80%] mx-auto bg-white shadow-md rounded-xl min-h-screen">
            {
                deviceId === "pharmdev_001" ?
                <div className="space-y-2 mb-4 bg-[#F5F1EB] h-[90vh] overflow-y-auto scrollbar-slim border border-gray-300 rounded p-4">
                    <ChatSkeleton/>
                </div>:
                <div>
                    <h2 className="text-xl font-bold mb-4">Chat with {allDevices?.find((dev)=>dev?._id === deviceId)?.deviceId || "Unknown"} </h2>
                    
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
                                msg.sender === userDetails?._id ? "bg-[#D9FDD3] px-4 " : "bg-white px-4  "
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
            }
        </div>
    </div>
  )
}

export default DoctorChatPage
