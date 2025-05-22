import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./Components/Login";
import AddEmployee from "./Pages/AddEmployee";

import "bootstrap/dist/css/bootstrap.min.css";
import PatientDetails from "./Pages/PatientDetails";
import PharmacyInventory from "./Pages/PharmacyInventory";
import InjectRoom from "./Pages/InjectRoom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/patient-details" element={<PatientDetails />} />
        <Route path="/pharmacy-inventory" element={<PharmacyInventory />} />
        <Route path="/inject-room" element={<InjectRoom />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
