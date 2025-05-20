import React, { useState, useEffect } from "react";
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

// Dummy data for demonstration; expand as needed
const dummyData = {
  employeeDetails: [
    {
      id: "E001",
      name: "John Smith",
      position: "Nurse",
      phone: "123-456-7890",
    },
    {
      id: "E002",
      name: "Mary Johnson",
      position: "Doctor",
      phone: "987-654-3210",
    },
  ],
  patientDetails: [
    { id: "P001", name: "Alice Smith", phone: "123-456-7890" },
    { id: "P002", name: "Bob Johnson", phone: "987-654-3210" },
  ],
  pharmacyInventory: [
    { id: "M001", name: "Paracetamol", quantity: 120 },
    { id: "M002", name: "Ibuprofen", quantity: 80 },
  ],
  appointments: [
    { id: "A001", patient: "Dana Lee", date: "2025-06-01", time: "10:00 AM" },
    { id: "A002", patient: "Evan Kim", date: "2025-06-02", time: "2:00 PM" },
  ],
  birthRecords: [
    { id: "B001", babyName: "Liam", birthDate: "2025-01-15", mother: "Emma" },
  ],
  wardRecords: [
    { id: "W001", patient: "Noah", ward: "General", admittedOn: "2025-05-10" },
  ],
  departments: [
    { id: "D001", name: "Cardiology" },
    { id: "D002", name: "Neurology" },
  ],
  shifts: [{ id: "S001", employee: "John Smith", shift: "Morning" }],
  bloodBank: [{ id: "BB001", bloodType: "A+", unitsAvailable: 20 }],
  billList: [{ id: "BL001", patient: "Alice Smith", amount: 500 }],
  salary: [{ id: "SAL001", employee: "Mary Johnson", amount: 3000 }],
};

const tabsConfig = [
  { key: "employeeDetails", label: "Employee Details", icon: <FaUserTie /> },
  { key: "patientDetails", label: "Patient Details", icon: <FaUserInjured /> },
  {
    key: "pharmacyInventory",
    label: "Pharmacy Inventory",
    icon: <FaCapsules />,
  },
  { key: "appointments", label: "Appointments", icon: <FaCalendarAlt /> },
  { key: "birthRecords", label: "Birth Records", icon: <FaBaby /> },
  { key: "wardRecords", label: "Ward Records", icon: <FaHospitalUser /> },
  { key: "departments", label: "Departments", icon: <FaBuilding /> },
  { key: "shifts", label: "Shifts", icon: <FaClock /> },
  { key: "bloodBank", label: "Blood Bank", icon: <FaTint /> },
  { key: "billList", label: "Bill List", icon: <FaFileInvoiceDollar /> },
  { key: "salary", label: "Salary", icon: <FaMoneyCheckAlt /> },
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState("employeeDetails");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(dummyData.employeeDetails);

  useEffect(() => {
    const data = dummyData[activeTab] || [];
    if (searchTerm.trim() === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [activeTab, searchTerm]);

  // Simple cards for totals
  const totalPayments = dummyData.billList.reduce(
    (acc, bill) => acc + bill.amount,
    0
  );
  const totalPatients = dummyData.patientDetails.length;
  const totalEmployees = dummyData.employeeDetails.length;

  // Render table rows based on activeTab
  const renderTableHeaders = () => {
    switch (activeTab) {
      case "employeeDetails":
        return (
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Position</th>
            <th>Phone</th>
          </tr>
        );
      case "patientDetails":
        return (
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
          </tr>
        );
      case "pharmacyInventory":
        return (
          <tr>
            <th>ID</th>
            <th>Medicine Name</th>
            <th>Quantity</th>
          </tr>
        );
      case "appointments":
        return (
          <tr>
            <th>ID</th>
            <th>Patient</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        );
      case "birthRecords":
        return (
          <tr>
            <th>ID</th>
            <th>Baby Name</th>
            <th>Birth Date</th>
            <th>Mother</th>
          </tr>
        );
      case "wardRecords":
        return (
          <tr>
            <th>ID</th>
            <th>Patient</th>
            <th>Ward</th>
            <th>Admitted On</th>
          </tr>
        );
      case "departments":
        return (
          <tr>
            <th>ID</th>
            <th>Department Name</th>
          </tr>
        );
      case "shifts":
        return (
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Shift</th>
          </tr>
        );
      case "bloodBank":
        return (
          <tr>
            <th>ID</th>
            <th>Blood Type</th>
            <th>Units Available</th>
          </tr>
        );
      case "billList":
        return (
          <tr>
            <th>ID</th>
            <th>Patient</th>
            <th>Amount</th>
          </tr>
        );
      case "salary":
        return (
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Amount</th>
          </tr>
        );
      default:
        return null;
    }
  };

  const renderTableRows = () => {
    return filteredData.map((item, idx) => {
      switch (activeTab) {
        case "employeeDetails":
          return (
            <tr key={idx}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.position}</td>
              <td>{item.phone}</td>
            </tr>
          );
        case "patientDetails":
          return (
            <tr key={idx}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.phone}</td>
            </tr>
          );
        case "pharmacyInventory":
          return (
            <tr key={idx}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
            </tr>
          );
        case "appointments":
          return (
            <tr key={idx}>
              <td>{item.id}</td>
              <td>{item.patient}</td>
              <td>{item.date}</td>
              <td>{item.time}</td>
            </tr>
          );
        case "birthRecords":
          return (
            <tr key={idx}>
              <td>{item.id}</td>
              <td>{item.babyName}</td>
              <td>{item.birthDate}</td>
              <td>{item.mother}</td>
            </tr>
          );
        case "wardRecords":
          return (
            <tr key={idx}>
              <td>{item.id}</td>
              <td>{item.patient}</td>
              <td>{item.ward}</td>
              <td>{item.admittedOn}</td>
            </tr>
          );
        case "departments":
          return (
            <tr key={idx}>
              <td>{item.id}</td>
              <td>{item.name}</td>
            </tr>
          );
        case "shifts":
          return (
            <tr key={idx}>
              <td>{item.id}</td>
              <td>{item.employee}</td>
              <td>{item.shift}</td>
            </tr>
          );
        case "bloodBank":
          return (
            <tr key={idx}>
              <td>{item.id}</td>
              <td>{item.bloodType}</td>
              <td>{item.unitsAvailable}</td>
            </tr>
          );
        case "billList":
          return (
            <tr key={idx}>
              <td>{item.id}</td>
              <td>{item.patient}</td>
              <td>${item.amount}</td>
            </tr>
          );
        case "salary":
          return (
            <tr key={idx}>
              <td>{item.id}</td>
              <td>{item.employee}</td>
              <td>${item.amount}</td>
            </tr>
          );
        default:
          return null;
      }
    });
  };

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
        {/* Summary cards */}
        <div className="d-flex flex-wrap gap-3 mb-4">
          <div
            className="card text-white"
            style={{ backgroundColor: "#3C51A1", flex: "1 1 200px" }}
          >
            <div className="card-body">
              <FaFileInvoiceDollar size={28} />
              <h5 className="card-title mt-2">Total Payments</h5>
              <p className="card-text fs-4">
                ${totalPayments.toLocaleString()}
              </p>
            </div>
          </div>

          <div
            className="card text-white"
            style={{ backgroundColor: "#88C244", flex: "1 1 200px" }}
          >
            <div className="card-body">
              <FaUserInjured size={28} />
              <h5 className="card-title mt-2">Total Patients</h5>
              <p className="card-text fs-4">{totalPatients}</p>
            </div>
          </div>

          <div
            className="card text-white"
            style={{ backgroundColor: "#3C51A1", flex: "1 1 200px" }}
          >
            <div className="card-body">
              <FaUserTie size={28} />
              <h5 className="card-title mt-2">Total Employees</h5>
              <p className="card-text fs-4">{totalEmployees}</p>
            </div>
          </div>
        </div>

        {/* Search & Greeting */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <h4>Welcome, Admin</h4>
          <input
            type="search"
            placeholder="Search records..."
            className="form-control w-auto"
            style={{ minWidth: 200 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search records"
          />
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead style={{ backgroundColor: "#3C51A1", color: "#fff" }}>
              {renderTableHeaders()}
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={Object.keys(filteredData[0] || {}).length || 4}
                    className="text-center text-muted"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                renderTableRows()
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Admin;
