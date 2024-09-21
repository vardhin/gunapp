import React, { useState, useEffect } from "react";
import Gun from "gun";
import { Link } from "react-router-dom";
import "gun/sea";
import "gun/axe";

const gun = Gun({
  peers: ["https://your-relay-peer.herokuapp.com/gun"],
});

const MainPage = () => {
  const [userID, setUserID] = useState("");
  const [contactID, setContactID] = useState("");
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState({});

  useEffect(() => {
    // Generate a unique User ID (public/private key pair) using SEA
    const generateUserID = async () => {
      const userPair = await Gun.SEA.pair();
      setUserID(userPair.pub); // Set your public key as your User ID
      localStorage.setItem("userPair", JSON.stringify(userPair));
    };
    generateUserID();
  }, []);

  const addContact = () => {
    if (contactID) {
      setContacts([...contacts, contactID]);
      setContactID("");
    }
  };

  // Listen for messages/files sent to each contact's room
  useEffect(() => {
    contacts.forEach((contact) => {
      gun.get(`room-${contact}`).on((data) => {
        if (data) {
          setMessages((prevMessages) => ({
            ...prevMessages,
            [contact]: data,
          }));
        }
      });
    });
  }, [contacts]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your User ID (Share this with your friends):</h2>
      <p>{userID}</p>

      <h3>Add Contact:</h3>
      <input
        type="text"
        placeholder="Enter Contact ID"
        value={contactID}
        onChange={(e) => setContactID(e.target.value)}
      />
      <button onClick={addContact}>Add Contact</button>

      <h3>Your Contacts:</h3>
      <ul>
        {contacts.map((contact) => (
          <li key={contact}>
            {contact}{" "}
            <Link to={`/send/${contact}`}>
              <button>Send File</button>
            </Link>
            {messages[contact] && (
              <p>
                <strong>New Message:</strong> {messages[contact].fileName}{" "}
                received
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MainPage;
