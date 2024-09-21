import React, { useState, useEffect } from 'react';
import Gun from 'gun';
import 'gun/sea';
import 'gun/axe';

const gun = Gun({
  peers: ['https://gun-manhattan.herokuapp.com/gun'], // Public peer
});

const MainPage = () => {
  const [userID, setUserID] = useState('');
  const [contacts, setContacts] = useState({});
  const [file, setFile] = useState(null);
  const [friendID, setFriendID] = useState('');

  // Load the user ID from localStorage or create a new one
  useEffect(() => {
    const storedUserID = localStorage.getItem('userID');
    if (storedUserID) {
      setUserID(storedUserID);
    } else {
      const newID = gun.user()._.sea.pub; // Use your public key as ID
      localStorage.setItem('userID', newID);
      setUserID(newID);
    }
  }, []);

  // Listen to files coming into **your unique room (your userID)**
  useEffect(() => {
    if (userID) {
      gun.get(`room-${userID}`).on(async (data) => {
        if (data && data.file) {
          try {
            const userPair = JSON.parse(localStorage.getItem('userPair'));
            const decryptedFile = await Gun.SEA.decrypt(data.file, userPair);

            // Create a Blob and trigger download
            const blob = new Blob([decryptedFile], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = data.fileName || 'received-file.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

          } catch (error) {
            console.error('Error decrypting or saving the received file:', error);
          }
        }
      });
    }
  }, [userID]);

  // Handle sending a file to a friend's room (friendID)
  const sendFile = async () => {
    if (file && friendID) {
      const reader = new FileReader();
      reader.onload = async () => {
        const userPair = JSON.parse(localStorage.getItem('userPair'));
        const encryptedFile = await Gun.SEA.encrypt(reader.result, userPair);

        gun.get(`room-${friendID}`).put({
          file: encryptedFile,
          sender: userID, // Your ID, so your friend knows it's from you
          fileName: file.name,
        });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <h2>Your User ID: {userID}</h2>
      <input type="text" value={friendID} onChange={(e) => setFriendID(e.target.value)} placeholder="Enter Friend's ID" />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={sendFile}>Send File</button>
    </div>
  );
};

export default MainPage;
