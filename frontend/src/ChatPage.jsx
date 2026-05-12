import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import MessageBox from "./MessageBox";

// Backend URL
const socket = io("http://localhost:5000");

function ChatPage({ username, onLeave }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const messagesEndRef = useRef(null);

  // Join chat
  useEffect(() => {
    socket.emit("join", username);

    // Receive messages
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Active users
    socket.on("active_users", (usersList) => {
      setUsers(usersList);
    });

    return () => {
      socket.off("receive_message");
      socket.off("active_users");
    };
  }, [username]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = () => {
    if (message.trim() === "") return;

    const messageData = {
      username,
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", messageData);

    setMessage("");
  };

  return (
    <div className="flex h-screen bg-[#000814] text-white">

      {/* Chat Section */}
      <div className="flex flex-col flex-1">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">Live Chat</h1>

          <button
            onClick={onLeave}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
          >
            Leave
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.username === username
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={
                  msg.username === username
                    ? "message-sent"
                    : "message-received"
                }
              >
                <p className="text-sm font-bold mb-1">
                  {msg.username}
                </p>

                <p>{msg.text}</p>

                <p className="text-xs mt-1 opacity-70">
                  {msg.time}
                </p>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef}></div>
        </div>

        {/* Message Input */}
        <MessageBox
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>

      {/* Sidebar */}
      <div className="w-64 border-l border-gray-800 p-4 hidden md:block">

        <h2 className="text-lg font-semibold mb-4">
          Online Users
        </h2>

        <div className="space-y-3">
          {users.map((user, index) => (
            <div
              key={index}
              className="flex items-center gap-2"
            >
              <div className="online-dot"></div>

              <p>
                {user}
                {user === username && " (You)"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
