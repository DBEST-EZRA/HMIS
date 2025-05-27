import React, { useState } from "react";
import { FaUserInjured, FaCapsules, FaPlus } from "react-icons/fa";
import logo from "../assets/logo.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import OutPatient5 from "../MorePages/OutPatient5";
import PharmacyInventory from "./PharmacyInventory";
import NewSale from "../MorePages/NewSale";
import WardRecords from "./WardRecords";

const Pharmacy = () => {
  const [activeTab, setActiveTab] = useState("newsale");

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "newsale":
        return <NewSale />;
      case "patients":
        return <OutPatient5 />;
      case "inPatients":
        return <WardRecords />;
      case "inventory":
        return <PharmacyInventory />;
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
          width: "220px",
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
              type="button"
              className={`nav-link d-flex align-items-center text-white btn btn-link px-1 ${
                activeTab === "newsale" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveTab("newsale")}
            >
              <FaPlus className="me-2" />
              <span className="d-none d-sm-inline">New Sale</span>
            </button>
            <button
              type="button"
              className={`nav-link d-flex align-items-center text-white btn btn-link px-1 ${
                activeTab === "patients" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveTab("patients")}
            >
              <FaUserInjured className="me-2" />
              <span className="d-none d-sm-inline">OutPatients</span>
            </button>
            <button
              type="button"
              className={`nav-link d-flex align-items-center text-white btn btn-link px-1 ${
                activeTab === "inPatients" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveTab("inPatients")}
            >
              <FaUserInjured className="me-2" />
              <span className="d-none d-sm-inline">InPatients</span>
            </button>
            <button
              type="button"
              className={`nav-link d-flex align-items-center text-white btn btn-link px-1 ${
                activeTab === "inventory" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveTab("inventory")}
            >
              <FaCapsules className="me-2" />
              <span className="d-none d-sm-inline">Inventory</span>
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
        {renderActiveComponent()}
      </main>
    </div>
  );
};

export default Pharmacy;
