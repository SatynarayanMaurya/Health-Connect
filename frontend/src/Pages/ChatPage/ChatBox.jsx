import React, { useEffect, useState, useRef } from "react";
import socket from "../../Components/socket";
import { apiConnector } from "../../Services/apiConnector";
import { chatEndpoints } from "../../Services/apis";
import { useSelector } from "react-redux";

const ChatBox = ({ userId, peerId }) => {
  const [messages, setMessages] = useState([]);
  const allDevices = useSelector((state)=>state.user.allDevices)
  const userDetails = useSelector((state)=>state.user.userDetails)
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Join chat room and listen for incoming messages
  useEffect(() => {
    if (!userId || !peerId) return;

    socket.emit("joinRoom", { userId, peerId });

    socket.on("chat:message", (msg) => {
      setMessages((prev) => [...prev, msg]);

    });
    const fetchChatHistory = async () => {
      try {
        const res = await apiConnector(
          "GET",
          chatEndpoints.GET_CHATS(userDetails?._id, peerId)
        );
        const history = res?.data || [];
        setMessages(history);
      } catch (err) {
        console.error("Chat history fetch failed:", err);
      }
    };
    fetchChatHistory();

    return () => {
      socket.off("chat:message");
    };
  }, [peerId, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMsg = { sender: userId, message: message };
    socket.emit("chat:message", {
        from: userId,
        to: peerId,
        message: message,
    });

    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white border rounded-xl shadow-lg z-50">
      <div className="bg-blue-500 text-white text-lg font-semibold px-4 py-2 rounded-t-xl">
        Chat with {allDevices?.find((dev)=>dev?._id === peerId)?.deviceId || "Device"}
      </div>

        <div className="h-64 overflow-y-auto scrollbar-slim p-3 space-y-2">
        {messages?.map((msg, i) => (
            <div
            key={i}
            className={`flex ${msg.sender === userId ? "justify-end" : "justify-start"}`}
            >
            <div
                className={`p-2 rounded-md max-w-xs break-words ${
                msg.sender === userId ? "bg-blue-100 px-4 text-center" : "bg-gray-100 px-4  text-center"
                }`}
            >
                {msg.message}
            </div>
            </div>
        ))}
        <div ref={messagesEndRef}></div>
        </div>


      <div className="flex items-center border-t p-2">
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 px-3 py-1 border rounded-lg mr-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-1 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
