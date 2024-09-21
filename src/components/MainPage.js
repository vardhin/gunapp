import React, { useState, useEffect } from "react";
import Gun from "gun";
import { Link } from "react-router-dom";
import "gun/sea";
import "gun/axe";

const gun = Gun({
  peers: ["https://gun-manhattan.herokuapp.com/gun"], // Public peer
});

const MainPage = () => {
  const [userID, setUserID] = useState("");
  const [contacts, setContacts] = useState([]);
  const [newContactID, setNewContactID] = useState("");
  const [alias, setAlias] = useState("");

  // Load the user ID from localStorage or create a new one
  useEffect(() => {
    const storedUserID = localStorage.getItem("userID");
    if (storedUserID) {
      setUserID(storedUserID);
    } else {
      const newID = gun.user()._.sea.pub; // Use your public key as ID
      localStorage.setItem("userID", newID);
      setUserID(newID);
    }

    const storedContacts = JSON.parse(localStorage.getItem("contacts")) || [];
    setContacts(storedContacts);
  }, []);

  // Add new contact and store it in localStorage
  const addContact = () => {
    const updatedContacts = [...contacts, { id: newContactID, alias }];
    setContacts(updatedContacts);
    localStorage.setItem("contacts", JSON.stringify(updatedContacts));
    setNewContactID("");
    setAlias("");
  };

  return (
    <div>
      <h2>Your User ID: {userID}</h2>

      {/* Add new contact form */}
      <input
        type="text"
        value={newContactID}
        onChange={(e) => setNewContactID(e.target.value)}
        placeholder="Enter Contact's Unique ID"
      />
      <input
        type="text"
        value={alias}
        onChange={(e) => setAlias(e.target.value)}
        placeholder="Enter Contact's Alias"
      />
      <button onClick={addContact}>Add Contact</button>

      <h3>Contacts</h3>
      <ul>
        {contacts.map((contact, index) => (
          <li key={index}>
            <Link to={`/chat/${contact.id}`}>
              {contact.alias} ({contact.id})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MainPage;
