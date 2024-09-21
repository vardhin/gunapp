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
  const [contacts, setContacts] = useState([]); // Always start as an array
  const [newContactID, setNewContactID] = useState("");
  const [alias, setAlias] = useState("");

  // Load user ID and contacts from localStorage or set defaults
  useEffect(() => {
    const storedUserID = localStorage.getItem("userID");
    if (storedUserID) {
      setUserID(storedUserID);
    } else {
      const newID = gun.user()._.sea.pub; // Use your public key as ID
      localStorage.setItem("userID", newID);
      setUserID(newID);
    }

    // Get stored contacts from localStorage and parse
    const storedContacts = localStorage.getItem("contacts");
    console.log("Stored Contacts:", storedContacts); // Debugging log
    if (storedContacts) {
      try {
        const parsedContacts = JSON.parse(storedContacts);
        console.log("Parsed Contacts:", parsedContacts); // Debugging log
        setContacts(Array.isArray(parsedContacts) ? parsedContacts : []);
      } catch (error) {
        console.error("Failed to parse contacts:", error);
        setContacts([]); // Reset to empty array on error
      }
    }
  }, []);

  // Add new contact and store it in localStorage
  const addContact = () => {
    const updatedContacts = [...contacts, { id: newContactID, alias }];
    console.log("Updated Contacts:", updatedContacts); // Debugging log
    setContacts(updatedContacts);
    localStorage.setItem("contacts", JSON.stringify(updatedContacts)); // Store updated contacts
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
        {Array.isArray(contacts) &&
          contacts.length > 0 &&
          contacts.map((contact, index) => (
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
