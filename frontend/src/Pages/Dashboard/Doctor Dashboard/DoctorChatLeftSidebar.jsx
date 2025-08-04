import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import LogoutModal from "../../../Components/LogoutModal";
import { useSelector } from "react-redux";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
function DoctorChatLeftSidebar() {

    const navigate = useNavigate()
    const [isLogoutModal,setIsLogoutModal] = useState(false)
    const userDetails = useSelector((state)=>state.user.userDetails)
    const allDevices = useSelector((state)=>state.user.allDevices)
    const location = useLocation ();

  return (
    <div className="w-64 h-full bg-white shadow-md p-4 space-y-4">
        <h1 className="text-xl font-semibold mb-4">{userDetails?.name || "Device Id"}</h1>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `block px-4 py-2 rounded-md font-medium text-gray-700 ${
            isActive ? "bg-blue-500 text-white" : "hover:bg-gray-100 border border-gray-200"
          }`
        }
      >
        Dashboard 
        
      </NavLink>

      <button
        onClick={()=>navigate(`/chat-with-pharmacy-device/pharmdev_001`)}
        className={
          `w-full flex justify-between items-center px-4 py-2 rounded-md font-medium text-start cursor-pointer ${location?.pathname?.split("/")?.pop() === "pharmdev_001" ? "bg-blue-500 text-white ":"border  border-gray-200"} `
        }
      >
        Devices
        <MdKeyboardDoubleArrowDown/>
      </button>

      <div className="flex flex-col gap-2">
        {
            allDevices?.map((dev)=>{
                return <p key={dev?._id} onClick={()=>navigate(`/chat-with-pharmacy-device/${dev?._id}`)} className={`w-full px-4 py-2 rounded-md  text-start cursor-pointer ${location?.pathname?.split("/")?.pop() === dev?._id ? "bg-blue-500 text-white ":"border  border-gray-200"}  `}>{dev.deviceId}</p>
            })
        }
        {/* <p onClick={()=>navigate(`/chat-with-pharmacy-device/${"23"}`)} className="w-full px-4 py-2 rounded-md font-medium text-start bg-blue-500 text-white  ">Device 1</p>
        <p className="w-full px-4 py-2 rounded-md font-medium text-start bg-blue-500 text-white  ">Device 1</p> */}
      </div>

      <button
        onClick={() => setIsLogoutModal(true)  }
        className="w-full text-left cursor-pointer px-4 py-2 rounded-md bg-red-500 text-white  font-medium  hover:bg-red-600  border border-gray-200"
      >
        Logout
      </button>
        
        {/* Logout  */}
        <>
            {
                isLogoutModal &&
                <LogoutModal closeModal={ ()=>setIsLogoutModal(false)} />
            }
        </>

    </div>
  );
}



export default DoctorChatLeftSidebar
