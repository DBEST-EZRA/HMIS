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
import ViewMore from "./MorePages/ViewMore";
import Admin from "./Pages/Admin";
import Clinician from "./Pages/Clinician";
import Reception from "./Pages/Reception";
import Pharmacy from "./Pages/Pharmacy";
import Laboratory from "./Pages/Laboratory";
import Doctor from "./Pages/Doctor";
import Nurse from "./Pages/Nurse";
import Accounts from "./Pages/Accounts";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/clinician" element={<Clinician />} />
        <Route path="/reception" element={<Reception />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/lab" element={<Laboratory />} />
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/nurse" element={<Nurse />} />
        <Route path="/accounts" element={<Accounts />} />

        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/patient-details" element={<PatientDetails />} />
        <Route path="/pharmacy-inventory" element={<PharmacyInventory />} />
        <Route path="/inject-room" element={<InjectRoom />} />
        <Route path="/viewmore/:id" element={<ViewMore />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
