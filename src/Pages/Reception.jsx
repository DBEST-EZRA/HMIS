import React, { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaHistory,
  FaBaby,
  FaCalendarCheck,
  FaAmbulance,
  FaProcedures,
  FaSearch,
} from "react-icons/fa";
import logo from "../assets/logo.jpg";
import NewPatients from "./PatientDetails";
import PastPatients from "./PatientDetails";
import BirthRecord from "./BirthRecords";
import Attendance from "./Attendance";
import Ambulance from "./Ambulance";
import Ward from "./WardRecords";

const Reception = () => {
  const [activeSection, setActiveSection] = useState("newPatients");

  const sidebarItems = [
    { key: "newPatients", label: "New OutPatient", icon: <FaUserPlus /> },
    { key: "pastPatients", label: "Past OutPatients", icon: <FaHistory /> },
    { key: "birthRecord", label: "Birth Record", icon: <FaBaby /> },
    { key: "attendance", label: "Attendance", icon: <FaCalendarCheck /> },
    { key: "ambulance", label: "Ambulance", icon: <FaAmbulance /> },
    { key: "ward", label: "Inpatient", icon: <FaProcedures /> },
  ];

  // Function to render the active section component
  const renderActiveSection = () => {
    switch (activeSection) {
      case "newPatients":
        return <NewPatients />;
      case "pastPatients":
        return <PastPatients />;
      case "birthRecord":
        return <BirthRecord />;
      case "attendance":
        return <Attendance />;
      case "ambulance":
        return <Ambulance />;
      case "ward":
        return <Ward />;
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="vh-100 d-flex">
      {/* Sidebar */}
      <div
        className="border-end p-3"
        style={{ width: "240px", backgroundColor: "#3c51a1" }}
      >
        <img
          src={logo}
          alt="Minto Logo"
          className="mb-3"
          style={{ height: "50px" }}
        />
        <ul className="list-unstyled">
          {sidebarItems.map(({ key, label, icon }) => {
            const isActive = activeSection === key;

            return (
              <li
                key={key}
                onClick={() => setActiveSection(key)}
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  borderRadius: "5px",
                  backgroundColor: isActive ? "#88c244" : "transparent",
                  color: isActive ? "#fff" : "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "5px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isActive
                    ? "#76ac3d" // Slightly darker green on hover
                    : "#4a5ba5"; // Slightly lighter blue on hover for inactive
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isActive
                    ? "#88c244"
                    : "transparent";
                }}
              >
                {icon} {label}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Content */}
      <div className="flex-grow-1 d-flex flex-column bg-light">
        {/* Header */}
        <header
          className="d-flex align-items-center p-3 shadow-sm"
          style={{ backgroundColor: "#3C51A1" }}
        >
          <h4 className="text-white m-0">
            Minto Medical Center - Reception Desk
          </h4>
        </header>

        {/* Main Content */}
        <main className="container-fluid py-4 overflow-auto">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
};

export default Reception;
