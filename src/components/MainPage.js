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
  const [contactAlias, setContactAlias] = useState("");
  const [contacts, setContacts] = useState({});
  const [messages, setMessages] = useState({});

  // Initialize user ID from localStorage, or generate a new one
  useEffect(() => {
    const storedUserID = localStorage.getItem("userID");
    const storedUserPair = localStorage.getItem("userPair");
    if (storedUserID && storedUserPair) {
      setUserID(storedUserID);
    } else {
      generateUserID();
    }

    // Load contacts from localStorage
    const storedContacts = JSON.parse(localStorage.getItem("contacts")) || {};
    setContacts(storedContacts);
  }, []);

  // Generate a new unique User ID and store it in localStorage
  const generateUserID = async () => {
    const userPair = await Gun.SEA.pair();
    setUserID(userPair.pub);
    localStorage.setItem("userID", userPair.pub);
    localStorage.setItem("userPair", JSON.stringify(userPair));
  };

  // Add contact with alias, store in localStorage
  const addContact = () => {
    if (!contactID || !contactAlias) {
      alert("Please enter both Contact ID and Alias");
      return;
    }

    const updatedContacts = { ...contacts, [contactID]: contactAlias };
    setContacts(updatedContacts);
    localStorage.setItem("contacts", JSON.stringify(updatedContacts));
    setContactID("");
    setContactAlias("");
  };

  // Listen for messages/files sent to each contact's room
  useEffect(() => {
    Object.keys(contacts).forEach((contact) => {
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
      <button onClick={generateUserID}>Create New Unique ID</button>

      <h3>Add Contact:</h3>
      <input
        type="text"
        placeholder="Enter Contact ID"
        value={contactID}
        onChange={(e) => setContactID(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Alias"
        value={contactAlias}
        onChange={(e) => setContactAlias(e.target.value)}
      />
      <button onClick={addContact}>Add Contact</button>

      <h3>Your Contacts:</h3>
      <ul>
        {Object.entries(contacts).map(([contact, alias]) => (
          <li key={contact}>
            {alias} ({contact}){" "}
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
