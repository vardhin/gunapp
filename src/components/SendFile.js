import React, { useState } from "react";
import Gun from "gun";
import { useParams } from "react-router-dom";
import "gun/sea";
import "gun/axe";

const gun = Gun({
  peers: ["https://your-relay-peer.herokuapp.com/gun"],
});

const SendFile = () => {
  const { roomId } = useParams(); // Get the contact's room ID from the URL
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const sendFile = async () => {
    if (!file) {
      alert("Please select a file to send");
      return;
    }
    setStatus("Encrypting and sending file...");

    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileContent = event.target.result;

      try {
        const userPair = JSON.parse(localStorage.getItem("userPair"));
        const encryptedFile = await Gun.SEA.encrypt(fileContent, roomId);

        const message = {
          file: encryptedFile,
          fileName: file.name,
          sender: userPair.pub,
          timestamp: Date.now(),
        };

        gun.get(`room-${roomId}`).put(message);
        setStatus("File sent securely!");
      } catch (error) {
        console.error("Error encrypting or sending file:", error);
        setStatus("Failed to send the file.");
      }
    };

    reader.readAsText(file);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Send File to Contact {roomId}</h2>
      <input type="file" onChange={handleFileChange} accept=".txt" />
      <button onClick={sendFile}>Send File</button>
      <p>Status: {status}</p>
    </div>
  );
};

export default SendFile;
