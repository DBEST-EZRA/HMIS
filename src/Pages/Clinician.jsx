import React, { useState, useEffect } from "react";
import { FaUserCheck, FaHistory, FaCalendarAlt, FaEdit } from "react-icons/fa";
import logo from "../assets/logo.jpg"; // replace with your actual logo path
import "bootstrap/dist/css/bootstrap.min.css";

const dummyData = {
  assignedPatients: [
    { id: "P001", name: "Alice Smith", phone: "123-456-7890" },
    { id: "P002", name: "Bob Johnson", phone: "987-654-3210" },
  ],
  pastPatients: [{ id: "P003", name: "Charlie Davis", phone: "555-555-5555" }],
  appointments: [
    { id: "A001", name: "Dana Lee", date: "2025-06-01", time: "10:00 AM" },
    { id: "A002", name: "Evan Kim", date: "2025-06-02", time: "2:00 PM" },
  ],
};

const Clinician = () => {
  const [activeTab, setActiveTab] = useState("assignedPatients");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(dummyData.assignedPatients);
  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

  // Form fields in modal
  const [formFields, setFormFields] = useState({
    signsSymptoms: "",
    doctorNotes: "",
    recommendedTests: "",
  });

  // Filter data when tab or search term changes
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
      signsSymptoms: "",
      doctorNotes: "",
      recommendedTests: "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditRecord(null);
    setFormFields({
      signsSymptoms: "",
      doctorNotes: "",
      recommendedTests: "",
    });
  };

  const handleFormChange = (e) => {
    setFormFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    // Placeholder for save logic
    alert("Record saved!");
    closeModal();
  };

  return (
    <div className="d-flex vh-100 bg-light">
      {/* Left Panel */}
      <aside
        className="d-flex flex-column p-3"
        style={{
          width: "250px",
          backgroundColor: "#3C51A1",
          color: "white",
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
            />
            <h5 className="m-0">Minto Medical Center</h5>
          </div>

          {/* Navigation */}
          <nav className="nav flex-column">
            <button
              className={`nav-link d-flex align-items-center text-white btn btn-link ${
                activeTab === "assignedPatients" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveTab("assignedPatients")}
            >
              <FaUserCheck className="me-2" /> Assigned Patients
            </button>

            <button
              className={`nav-link d-flex align-items-center text-white btn btn-link ${
                activeTab === "pastPatients" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveTab("pastPatients")}
            >
              <FaHistory className="me-2" /> Past Patients
            </button>

            <button
              className={`nav-link d-flex align-items-center text-white btn btn-link ${
                activeTab === "appointments" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveTab("appointments")}
            >
              <FaCalendarAlt className="me-2" /> Appointments
            </button>
          </nav>
        </div>

        {/* Footer */}
        <footer className="text-center" style={{ fontSize: 12, opacity: 0.7 }}>
          &copy; Beta Softwares 2025
        </footer>
      </aside>

      {/* Main Panel */}
      <main className="flex-grow-1 p-4 overflow-auto">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <h4>Hello Dr. Joe Doe</h4>
          <input
            type="search"
            placeholder="Search patients..."
            className="form-control w-auto"
            style={{ minWidth: 200 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={activeTab === "appointments" ? 5 : 4}
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
                    <td>
                      <button
                        className="btn btn-sm btn-outline-light"
                        style={{
                          backgroundColor: "#88C244",
                          borderColor: "#88C244",
                          color: "#000",
                        }}
                        onClick={() => openModal(rec)}
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
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div
                  className="modal-header"
                  style={{ backgroundColor: "#3C51A1", color: "#fff" }}
                >
                  <h5 className="modal-title">Edit Patient Record</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Signs & Symptoms</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        name="signsSymptoms"
                        value={formFields.signsSymptoms}
                        onChange={(e) => handleFormChange(e)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Doctor Notes</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        name="doctorNotes"
                        value={formFields.doctorNotes}
                        onChange={(e) => handleFormChange(e)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Recommended Tests</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        name="recommendedTests"
                        value={formFields.recommendedTests}
                        onChange={(e) => handleFormChange(e)}
                      />
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn"
                        style={{ backgroundColor: "#88C244", color: "#000" }}
                      >
                        Send to Lab
                      </button>
                      <button
                        type="button"
                        className="btn"
                        style={{ backgroundColor: "#88C244", color: "#000" }}
                      >
                        Send to Pharmacy
                      </button>
                      <button
                        type="button"
                        className="btn"
                        style={{ backgroundColor: "#88C244", color: "#000" }}
                      >
                        Send to Inject Room
                      </button>
                      <button
                        type="button"
                        className="btn"
                        style={{ backgroundColor: "#88C244", color: "#000" }}
                      >
                        Send to Ward
                      </button>
                      <button
                        type="button"
                        className="btn"
                        style={{ backgroundColor: "#88C244", color: "#000" }}
                      >
                        Send to Payment Room
                      </button>
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

export default Clinician;
