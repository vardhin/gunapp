import React, { useState, useEffect } from "react";
import Gun from "gun";
import "gun/sea";
import "gun/axe";
import { useParams } from "react-router-dom";

const gun = Gun({
  peers: ["https://gun-manhattan.herokuapp.com/gun"], // Public Gun peer
});

const ChatWindow = () => {
  const { friendID } = useParams(); // Get friend's ID from route params
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userID, setUserID] = useState("");

  // Load user ID from localStorage or create a new one if it doesn't exist
  useEffect(() => {
    const storedUserID = localStorage.getItem("userID");
    if (storedUserID) {
      setUserID(storedUserID);
    } else {
      const newID = gun.user()._.sea.pub; // Use your public key as ID
      localStorage.setItem("userID", newID);
      setUserID(newID);
    }
  }, []);

  // Listen for messages in your friend's room (receiving messages from them)
  useEffect(() => {
    const roomID = `room-${userID}`; // Listen to the room with **your own userID** to get messages sent to you

    gun.get(roomID).on((data) => {
      if (data && data.text && data.sender !== userID) {
        // Only show messages that aren't from you (i.e., from your friend)
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.text, sender: data.sender },
        ]);
      }
    });
  }, [userID]);

  // Handle sending a new message to your friend's room
  const sendMessage = async () => {
    const roomID = `room-${friendID}`; // You send messages to your friend's room
    const messageData = {
      text: newMessage,
      sender: userID, // Send with your ID
      timestamp: Date.now(),
    };

    gun.get(roomID).put(messageData); // Send the message to the friend's room

    setMessages([...messages, messageData]); // Add your message to the local state
    setNewMessage(""); // Clear the input field after sending
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
