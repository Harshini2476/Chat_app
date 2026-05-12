function MessageBox({ message, setMessage, sendMessage }) {

  // Send message when Enter key is pressed
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="p-4 border-t border-gray-800 bg-[#0b1118]">

      <div className="flex gap-3">

        {/* Input */}
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 p-3 rounded-lg bg-black border border-gray-700 text-white outline-none focus:border-blue-500"
        />

        {/* Send Button */}
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 px-5 rounded-lg font-semibold"
        >
          Send
        </button>

      </div>
    </div>
  );
}

export default MessageBox;
