import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./components/MainPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define route to the MainPage */}
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Router>
  );
};

export default App;
