import React, { useState } from "react";
import {
  FaUserTie,
  FaUserInjured,
  FaCapsules,
  FaCalendarAlt,
  FaBaby,
  FaHospitalUser,
  FaBuilding,
  FaClock,
  FaTint,
  FaFileInvoiceDollar,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/logo.jpg";

import AddEmployee from "./AddEmployee";
import OutPatient5 from "../MorePages/OutPatient5";
import PharmacyInventory from "./PharmacyInventory";
import Appointments from "./Appointments";
import BirthRecords from "./BirthRecords";
import WardRecords from "./WardRecords";
import Departments from "./Departments";
import Shifts from "./Shifts";
import BloodBank from "./BloodBank";
import OutPatient6 from "../MorePages/OutPatient6";
import Attendance from "./Attendance";
import NewSale from "../MorePages/NewSale";

const tabComponents = {
  employeeDetails: AddEmployee,
  patientDetails: OutPatient5,
  pharmacyInventory: PharmacyInventory,
  pharmacySales: NewSale,
  appointments: Appointments,
  birthRecords: BirthRecords,
  wardRecords: WardRecords,
  departments: Departments,
  shifts: Shifts,
  bloodBank: BloodBank,
  billList: OutPatient6,
  attendance: Attendance,
};

const tabsConfig = [
  { key: "employeeDetails", label: "Employee Details", icon: <FaUserTie /> },
  { key: "patientDetails", label: "Patient Details", icon: <FaUserInjured /> },
  {
    key: "pharmacyInventory",
    label: "Pharmacy Inventory",
    icon: <FaCapsules />,
  },
  {
    key: "pharmacySales",
    label: "Pharmacy Sales",
    icon: <FaFileInvoiceDollar />,
  },
  { key: "appointments", label: "Appointments", icon: <FaCalendarAlt /> },
  { key: "birthRecords", label: "Birth Records", icon: <FaBaby /> },
  { key: "wardRecords", label: "Ward Records", icon: <FaHospitalUser /> },
  { key: "departments", label: "Departments", icon: <FaBuilding /> },
  { key: "shifts", label: "Shifts", icon: <FaClock /> },
  { key: "bloodBank", label: "Blood Bank", icon: <FaTint /> },
  { key: "billList", label: "Bill List", icon: <FaFileInvoiceDollar /> },
  { key: "attendance", label: "Attendance", icon: <FaMoneyCheckAlt /> },
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState("employeeDetails");

  // Get the component corresponding to activeTab
  const ActiveComponent = tabComponents[activeTab];

  return (
    <div className="d-flex vh-100 bg-light">
      {/* Sidebar */}
      <aside
        className="d-flex flex-column p-3 text-white"
        style={{
          width: "270px",
          backgroundColor: "#3C51A1",
          minHeight: "100vh",
          justifyContent: "space-between",
        }}
      >
        <div>
          {/* Logo & Title */}
          <div className="d-flex align-items-center mb-4">
            <img
              src={logo}
              alt="Minto Logo"
              style={{ height: 40, marginRight: 10 }}
              className="d-none d-sm-block"
            />
            <h5 className="m-0 d-none d-sm-block">Minto Medical Center</h5>
          </div>

          {/* Tabs */}
          <nav className="nav flex-column">
            {tabsConfig.map(({ key, label, icon }) => (
              <button
                key={key}
                className={`nav-link d-flex align-items-center text-white btn btn-link px-1 ${
                  activeTab === key ? "fw-bold" : ""
                }`}
                onClick={() => setActiveTab(key)}
                type="button"
              >
                <span className="me-2 fs-5">{icon}</span>
                <span className="d-none d-sm-inline">{label}</span>
              </button>
            ))}
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
        className="flex-grow-1 p-4 overflow-auto"
        style={{ height: "100vh" }}
      >
        {ActiveComponent ? (
          <ActiveComponent />
        ) : (
          <p>Select a tab to display content</p>
        )}
      </main>
    </div>
  );
};

export default Admin;
