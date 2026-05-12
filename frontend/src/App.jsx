import { useEffect, useState } from "react";
import ChatPage from "./ChatPage";

function App() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const savedUsername = sessionStorage.getItem("chat_username");

    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const handleJoin = () => {
    if (username.trim() === "") {
      alert("Please enter username");
      return;
    }

    sessionStorage.setItem("chat_username", username);
    window.location.reload();
  };

  const handleLeave = () => {
    sessionStorage.removeItem("chat_username");
    window.location.reload();
  };

  if (sessionStorage.getItem("chat_username")) {
    return (
      <ChatPage
        username={sessionStorage.getItem("chat_username")}
        onLeave={handleLeave}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#0b1118] border border-gray-800 rounded-2xl p-8 shadow-lg">
        
        <h1 className="text-3xl font-bold text-center mb-3">
          LiveChat
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Enter a username to join the chat
        </p>

        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 rounded-lg bg-black border border-gray-700 outline-none focus:border-blue-500"
        />

        <button
          onClick={handleJoin}
          className="w-full mt-5 bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-semibold"
        >
          Join Chat
        </button>
      </div>
    </div>
  );
}

export default App;
