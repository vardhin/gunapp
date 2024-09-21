import React, { useState, useEffect } from "react";
import Gun from "gun";
import "gun/sea";
import "gun/axe";
import { useParams } from "react-router-dom";

const gun = Gun({
  peers: ["https://gun-manhattan.herokuapp.com/gun"],
});

const ChatWindow = () => {
  const { friendID } = useParams(); // Get the friend's unique ID from route params
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userID, setUserID] = useState("");

  // Load the user ID from localStorage
  useEffect(() => {
    const storedUserID = localStorage.getItem("userID");
    setUserID(storedUserID);
  }, []);

  // Listen to incoming messages from the friend's room
  useEffect(() => {
    const roomID = `room-${friendID}`;

    gun.get(roomID).on((data) => {
      if (data && data.text && data.sender !== userID) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.text, sender: data.sender },
        ]);
      }
    });
  }, [friendID, userID]);

  // Handle sending a new message
  const sendMessage = async () => {
    const roomID = `room-${friendID}`;
    const messageData = {
      text: newMessage,
      sender: userID,
      timestamp: Date.now(),
    };

    gun.get(roomID).put(messageData); // Send message to the friend's room

    setMessages([...messages, messageData]); // Add to local messages
    setNewMessage(""); // Clear the input field
  };

  return (
    <div>
      <h2>Chat with {friendID}</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender === userID ? "You" : "Friend"}:</strong>{" "}
            {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatWindow;
