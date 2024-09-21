import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./components/MainPage";
import ChatWindow from "./components/ChatWindow";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/chat/:friendID" element={<ChatWindow />} />
      </Routes>
    </Router>
  );
};

export default App;
