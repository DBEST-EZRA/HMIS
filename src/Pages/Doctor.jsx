import React, { useState } from "react";
import { FaUserCheck, FaHistory, FaCalendarAlt } from "react-icons/fa";
import logo from "../assets/logo.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import OutPatient2 from "../MorePages/OutPatient2";
import Appointments from "./Appointments";
import WardRecords from "./WardRecords";
import PastPatients2 from "../MorePages/PastPatients2";

const Doctor = () => {
  const [activeTab, setActiveTab] = useState("assignedPatients");

  const renderComponent = () => {
    switch (activeTab) {
      case "assignedPatients":
        return <OutPatient2 />;
      case "pastPatients":
        return <PastPatients2 />;
      case "inPatients":
        return <WardRecords />;
      case "appointments":
        return <Appointments />;
      default:
        return null;
    }
  };

  return (
    <div className="d-flex vh-100 bg-light">
      {/* Sidebar */}
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
          <div className="d-flex align-items-center mb-4">
            <img
              src={logo}
              alt="Minto Logo"
              style={{ height: 40, marginRight: 10 }}
              className="d-none d-sm-block"
            />
            <h5 className="m-0 d-none d-sm-block">Minto Medical Center</h5>
          </div>

          <nav className="nav flex-column">
            <button
              className={`nav-link d-flex align-items-center text-white btn btn-link px-1 ${
                activeTab === "assignedPatients" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveTab("assignedPatients")}
            >
              <FaUserCheck className="me-2" />
              <span className="d-none d-sm-inline">Assigned OutPatients</span>
            </button>

            <button
              className={`nav-link d-flex align-items-center text-white btn btn-link px-1 ${
                activeTab === "pastPatients" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveTab("pastPatients")}
            >
              <FaHistory className="me-2" />
              <span className="d-none d-sm-inline">Past OutPatients</span>
            </button>

            <button
              className={`nav-link d-flex align-items-center text-white btn btn-link px-1 ${
                activeTab === "inPatients" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveTab("inPatients")}
            >
              <FaHistory className="me-2" />
              <span className="d-none d-sm-inline">In Patients</span>
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

        <footer
          className="text-center"
          style={{ fontSize: 12, opacity: 0.7 }}
          aria-label="copyright"
        >
          &copy; Beta Softwares 2025
        </footer>
      </aside>

      {/* Main Content */}
      <main
        className="flex-grow-1 p-4 overflow-auto"
        style={{ height: "100vh" }}
      >
        <h4>Hello, Doctor</h4>
        <div className="d-flex flex-wrap gap-3 mb-4">
          <div
            className="card text-white"
            style={{ backgroundColor: "#3C51A1", flex: "1 1 200px" }}
          >
            <div className="card-body">
              <FaUserCheck size={28} />
              <h5 className="card-title mt-2">Assigned Patients</h5>
              <p className="card-text fs-4">--</p>
            </div>
          </div>

          <div
            className="card text-white"
            style={{ backgroundColor: "#88C244", flex: "1 1 200px" }}
          >
            <div className="card-body">
              <FaHistory size={28} />
              <h5 className="card-title mt-2">Past Patients</h5>
              <p className="card-text fs-4">--</p>
            </div>
          </div>

          <div
            className="card text-white"
            style={{ backgroundColor: "#3C51A1", flex: "1 1 200px" }}
          >
            <div className="card-body">
              <FaCalendarAlt size={28} />
              <h5 className="card-title mt-2">Appointments</h5>
              <p className="card-text fs-4">--</p>
            </div>
          </div>
        </div>

        {/* Dynamic Component */}
        {renderComponent()}
      </main>
    </div>
  );
};

export default Doctor;
