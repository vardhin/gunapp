import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./components/MainPage";
import SendFile from "./components/SendFile"; // For sending files to specific contacts

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/send/:roomId" element={<SendFile />} />
      </Routes>
    </Router>
  );
}

export default App;
