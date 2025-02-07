import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Lock from "./pages/Lock";

const App: React.FC = () => (
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Lock />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
export default App;