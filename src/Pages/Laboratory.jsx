import React, { useState, useEffect } from "react";
import { FaUserCheck, FaHistory, FaCalendarAlt, FaEdit } from "react-icons/fa";
import logo from "../assets/logo.jpg"; // replace with your actual logo path
import "bootstrap/dist/css/bootstrap.min.css";

const dummyData = {
  assignedPatients: [
    {
      id: "P001",
      name: "Alice Smith",
      phone: "123-456-7890",
      recommendedTests: "Blood Test",
      testResult: "Normal",
      labCharges: 300,
      clinicianCharges: 150,
      consultationFee: 200,
    },
    {
      id: "P002",
      name: "Bob Johnson",
      phone: "987-654-3210",
      recommendedTests: "X-Ray",
      testResult: "Fracture detected",
      labCharges: 400,
      clinicianCharges: 180,
      consultationFee: 200,
    },
  ],
  pastPatients: [
    {
      id: "P003",
      name: "Charlie Davis",
      phone: "555-555-5555",
      recommendedTests: "MRI",
      testResult: "No issues",
      labCharges: 500,
      clinicianCharges: 160,
      consultationFee: 200,
    },
  ],
  appointments: [
    { id: "A001", name: "Dana Lee", date: "2025-06-01", time: "10:00 AM" },
    { id: "A002", name: "Evan Kim", date: "2025-06-02", time: "2:00 PM" },
  ],
};

const Laboratory = () => {
  const [activeTab, setActiveTab] = useState("assignedPatients");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(dummyData.assignedPatients);
  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [formFields, setFormFields] = useState({
    testResult: "",
    labCharges: "",
  });

  useEffect(() => {
    const data = dummyData[activeTab] || [];
    if (searchTerm.trim() === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.id && item.id.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredData(filtered);
    }
  }, [activeTab, searchTerm]);

  const openModal = (record) => {
    setEditRecord(record);
    setFormFields({
      testResult: record?.testResult || "",
      labCharges: record?.labCharges || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditRecord(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("Lab record saved (dummy)!");
    closeModal();
  };

  // Summary cards data
  const totalAssigned = dummyData.assignedPatients.length;
  const totalPast = dummyData.pastPatients.length;
  const totalAppointments = dummyData.appointments.length;

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

        {/* Summary Cards */}
        <div className="d-flex flex-wrap gap-3 mb-4">
          <div
            className="card text-white"
            style={{ backgroundColor: "#3C51A1", flex: "1 1 200px" }}
          >
            <div className="card-body">
              <FaUserCheck size={28} />
              <h5 className="card-title mt-2">Assigned Patients</h5>
              <p className="card-text fs-4">{totalAssigned}</p>
            </div>
          </div>

          <div
            className="card text-white"
            style={{ backgroundColor: "#88C244", flex: "1 1 200px" }}
          >
            <div className="card-body">
              <FaHistory size={28} />
              <h5 className="card-title mt-2">Past Patients</h5>
              <p className="card-text fs-4">{totalPast}</p>
            </div>
          </div>

          <div
            className="card text-white"
            style={{ backgroundColor: "#3C51A1", flex: "1 1 200px" }}
          >
            <div className="card-body">
              <FaCalendarAlt size={28} />
              <h5 className="card-title mt-2">Appointments</h5>
              <p className="card-text fs-4">{totalAppointments}</p>
            </div>
          </div>
        </div>

        {/* Search and greeting */}
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

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead style={{ backgroundColor: "#3C51A1", color: "#fff" }}>
              <tr>
                <th>Name</th>
                {activeTab !== "appointments" && <th>ID</th>}
                {activeTab === "appointments" && (
                  <>
                    <th>Appointment Date</th>
                    <th>Appointment Time</th>
                  </>
                )}
                <th>Phone</th>
                {activeTab !== "appointments" && (
                  <>
                    <th>Recommended Test</th>
                    <th>Test Result</th>
                    <th>Lab Charges</th>
                  </>
                )}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={activeTab === "appointments" ? 7 : 10}
                    className="text-center text-muted"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                filteredData.map((rec, idx) => (
                  <tr key={idx}>
                    <td>{rec.name}</td>
                    {activeTab !== "appointments" ? (
                      <td>{rec.id}</td>
                    ) : (
                      <>
                        <td>{rec.date}</td>
                        <td>{rec.time}</td>
                      </>
                    )}
                    <td>{rec.phone}</td>
                    {activeTab !== "appointments" && (
                      <>
                        <td>{rec.recommendedTests}</td>
                        <td>{rec.testResult}</td>
                        <td>{rec.labCharges}</td>
                      </>
                    )}
                    <td>
                      <button
                        className="btn btn-sm btn-outline-light"
                        style={{
                          backgroundColor: "#88C244",
                          borderColor: "#88C244",
                          color: "#000",
                        }}
                        onClick={() => openModal(rec)}
                        aria-label={`Edit record for ${rec.name}`}
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {showModal && (
          <div
            className="modal d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            aria-modal="true"
            role="dialog"
          >
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
              <div className="modal-content">
                <div
                  className="modal-header"
                  style={{ backgroundColor: "#3C51A1", color: "#fff" }}
                >
                  <h5 className="modal-title">Edit Lab Record</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                    aria-label="Close modal"
                  ></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Test Result</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        name="testResult"
                        value={formFields.testResult}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Lab Charges</label>
                      <input
                        type="number"
                        className="form-control"
                        name="labCharges"
                        value={formFields.labCharges}
                        onChange={handleFormChange}
                        min="0"
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn"
                    style={{ backgroundColor: "#3C51A1", color: "#fff" }}
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Laboratory;
