import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserForm from "./pages/UserForm";

function App() {
  return (
    <Router>
      <div>
        <h1>Hospital Management System</h1>
        <Routes>
          <Route path="/" element={<UserForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
