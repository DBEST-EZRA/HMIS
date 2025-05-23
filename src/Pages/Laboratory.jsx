import React, { useState } from "react";
import { FaUserCheck, FaHistory, FaCalendarAlt, FaEdit } from "react-icons/fa";
import logo from "../assets/logo.jpg";
import OutPatient4 from "../MorePages/OutPatient4";
import Appointments from "./Appointments";
import "bootstrap/dist/css/bootstrap.min.css";

const Laboratory = () => {
  const [activeTab, setActiveTab] = useState("assignedPatients");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="d-flex vh-100 bg-light">
      {/* Left Panel */}
      <aside
        className="d-flex flex-column p-3 text-white"
        style={{
          width: "250px",
          backgroundColor: "#3C51A1",
          minHeight: "100vh",
          justifyContent: "space-between",
        }}
      >
        <div>
          {/* Logo and hospital name */}
          <div className="d-flex align-items-center mb-4">
            <img
              src={logo}
              alt="Minto Logo"
              style={{ height: 40, marginRight: 10 }}
              className="d-none d-sm-block"
            />
            <h5 className="m-0 d-none d-sm-block">Minto Medical Center</h5>
          </div>

          {/* Navigation */}
          <nav className="nav flex-column">
            <button
              className={`nav-link d-flex align-items-center text-white btn btn-link px-1 ${
                activeTab === "assignedPatients" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveTab("assignedPatients")}
            >
              <FaUserCheck className="me-2" />
              <span className="d-none d-sm-inline">Assigned Patients</span>
            </button>

            <button
              className={`nav-link d-flex align-items-center text-white btn btn-link px-1 ${
                activeTab === "pastPatients" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveTab("pastPatients")}
            >
              <FaHistory className="me-2" />
              <span className="d-none d-sm-inline">Past Patients</span>
            </button>

            <button
              className={`nav-link d-flex align-items-center text-white btn btn-link px-1 ${
                activeTab === "appointments" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveTab("appointments")}
            >
              <FaCalendarAlt className="me-2" />
              <span className="d-none d-sm-inline">Appointments</span>
            </button>
          </nav>
        </div>

        {/* Footer */}
        <footer
          className="text-center"
          style={{ fontSize: 12, opacity: 0.7 }}
          aria-label="copyright"
        >
          &copy; Beta Softwares 2025
        </footer>
      </aside>

      {/* Main Panel */}
      <main
        className="flex-grow-1 p-4"
        style={{ overflowY: "auto", height: "100vh" }}
      >
        <h4>Hello Lab Technician</h4>

        {/* Search Input */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <input
            type="search"
            placeholder="Search patients..."
            className="form-control w-auto"
            style={{ minWidth: 200 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search patients"
          />
        </div>

        {/* Dynamic Component */}
        {activeTab === "assignedPatients" && (
          <OutPatient4 searchTerm={searchTerm} />
        )}
        {activeTab === "pastPatients" && (
          <OutPatient4 searchTerm={searchTerm} />
        )}
        {activeTab === "appointments" && (
          <Appointments searchTerm={searchTerm} />
        )}
      </main>
    </div>
  );
};

export default Laboratory;
