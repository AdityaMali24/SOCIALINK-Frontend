import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const ChatComponent = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socket = io("http://localhost:8007"); // Replace with your server's URL

  useEffect(() => {
    // Listen for incoming chat messages
    socket.on("chatMessage", (message) => {
      setMessages([...messages, message]);
    });

    // Clean up when component unmounts
    return () => {
      socket.disconnect();
    };
  }, [messages]);

  const sendMessage = () => {
    socket.emit("chatMessage", message, (acknowledgment) => {
      // Handle the acknowledgment from the server
      console.log("Server acknowledgment:", acknowledgment);
    });
    setMessage("");
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;
