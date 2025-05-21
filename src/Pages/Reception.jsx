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
    { key: "newPatients", label: "New Patients", icon: <FaUserPlus /> },
    { key: "pastPatients", label: "Past Patients", icon: <FaHistory /> },
    { key: "birthRecord", label: "Birth Record", icon: <FaBaby /> },
    { key: "attendance", label: "Attendance", icon: <FaCalendarCheck /> },
    { key: "ambulance", label: "Ambulance", icon: <FaAmbulance /> },
    { key: "ward", label: "Ward", icon: <FaProcedures /> },
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
      <div className="bg-white border-end p-3" style={{ width: "240px" }}>
        <img
          src={logo}
          alt="Minto Logo"
          className="mb-3"
          style={{ height: "50px" }}
        />
        <ul className="list-unstyled">
          {sidebarItems.map(({ key, label, icon }) => (
            <li
              key={key}
              onClick={() => setActiveSection(key)}
              style={{
                cursor: "pointer",
                padding: "10px",
                borderRadius: "5px",
                backgroundColor:
                  activeSection === key ? "#3C51A1" : "transparent",
                color: activeSection === key ? "white" : "#3C51A1",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "5px",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#e7eaf9")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  activeSection === key ? "#3C51A1" : "transparent")
              }
            >
              {icon} {label}
            </li>
          ))}
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
