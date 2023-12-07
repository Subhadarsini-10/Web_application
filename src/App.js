import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from "./Components/Login";
import { Otpverify } from "./Components/Otpverify";
import { Homepage } from "./Components/Homepage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/verify-otp" element={<Otpverify />} />
        <Route path="/" element={<Login />} />
        <Route path="/homepage" element={<Homepage />} />
      </Routes>
    </Router>
  );
}

export default App;
