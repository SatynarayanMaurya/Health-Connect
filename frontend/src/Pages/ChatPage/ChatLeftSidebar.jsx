import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import LogoutModal from "../../Components/LogoutModal";
import { useSelector } from "react-redux";

function ChatLeftSidebar() {
    const [isLogoutModal,setIsLogoutModal] = useState(false)
    const userDetails = useSelector((state)=>state.user.userDetails)
  return (
    <div className="w-64 h-full bg-white shadow-md p-4 space-y-4">
        <h1 className="text-xl font-semibold mb-4">{userDetails?.deviceId || "Device Id"}</h1>
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
        
        className={
          `w-full px-4 py-2 rounded-md font-medium text-start bg-blue-500 text-white   `
        }
      >
        Chat
      </button>

      <button
        onClick={() => setIsLogoutModal(true)  }
        className="w-full text-left px-4 py-2 rounded-md font-medium text-gray-700 hover:bg-red-100  border border-gray-200"
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

export default ChatLeftSidebar;
