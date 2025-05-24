import React, { useState } from "react";
import {
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import logo from "../assets/logo.jpg";
import "bootstrap/dist/css/bootstrap.min.css";

// Import your real components here
import OutPatient6 from "../MorePages/OutPatient6";
import NewSale from "../MorePages/NewSale";

const Accounts = () => {
  const [activeTab, setActiveTab] = useState("paid");

  return (
    <div className="d-flex vh-100 bg-light">
      {/* Sidebar */}
      <aside
        className="d-flex flex-column p-3 text-white"
        style={{
          width: "250px",
          backgroundColor: "#3c51a1",
          minHeight: "100vh",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div className="d-flex align-items-center mb-4">
            <img
              src={logo}
              alt="Logo"
              style={{ height: 40, marginRight: 10 }}
              className="d-none d-sm-block"
            />
            <h5 className="m-0 d-none d-sm-block">Accounts</h5>
          </div>

          <nav className="nav flex-column">
            <button
              className={`d-flex align-items-center nav-link btn btn-link text-white px-2 py-2 rounded ${
                activeTab === "paid" ? "fw-bold bg-white bg-opacity-10" : ""
              }`}
              onClick={() => setActiveTab("paid")}
              style={{ gap: "8px" }}
            >
              <FaMoneyBillWave size={18} />
              <span className="d-none d-sm-inline">Patient Bills</span>
            </button>
            <button
              className={`d-flex align-items-center nav-link btn btn-link text-white px-2 py-2 rounded ${
                activeTab === "unpaid" ? "fw-bold bg-white bg-opacity-10" : ""
              }`}
              onClick={() => setActiveTab("unpaid")}
              style={{ gap: "8px" }}
            >
              <FaMoneyCheckAlt size={18} />
              <span className="d-none d-sm-inline">Pharmacy Sales</span>
            </button>
          </nav>
        </div>

        <footer className="text-center" style={{ fontSize: 12, opacity: 0.7 }}>
          &copy; Beta Softwares 2025
        </footer>
      </aside>

      {/* Main Panel */}
      <main className="flex-grow-1 p-4" style={{ overflowY: "auto" }}>
        <h4>Hello Accounts Team</h4>

        <div className="d-flex flex-wrap gap-3 mb-4">
          <div
            className="card text-white"
            style={{ backgroundColor: "#3c51a1", flex: "1 1 200px" }}
          >
            <div className="card-body">
              <FaMoneyBillWave size={28} />
              <h5 className="card-title mt-2">Patient Bills</h5>
              <p className="card-text fs-4">{}</p>
            </div>
          </div>

          <div
            className="card text-white"
            style={{ backgroundColor: "#88c244", flex: "1 1 200px" }}
          >
            <div className="card-body">
              <FaMoneyCheckAlt size={28} />
              <h5 className="card-title mt-2">Pharmacy Sales</h5>
              <p className="card-text fs-4">{}</p>
            </div>
          </div>

          <div
            className="card text-white"
            style={{ backgroundColor: "#6c757d", flex: "1 1 200px" }}
          >
            <div className="card-body">
              <FaFileInvoiceDollar size={28} />
              <h5 className="card-title mt-2">Total Invoices</h5>
              <p className="card-text fs-4">{}</p>
            </div>
          </div>
        </div>

        {/* Dynamically render component based on activeTab */}
        {activeTab === "paid" ? <OutPatient6 /> : <NewSale />}
      </main>
    </div>
  );
};

export default Accounts;
