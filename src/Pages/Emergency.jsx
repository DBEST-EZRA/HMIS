import React, { useState, useEffect } from "react";
import { FaHeartbeat, FaHistory, FaEdit } from "react-icons/fa";
import logo from "../assets/logo.jpg";
import "bootstrap/dist/css/bootstrap.min.css";

const dummyEmergencyData = {
  activeCases: [
    {
      id: "EM001",
      name: "Diana Prince",
      phone: "111-222-3333",
      condition: "Severe bleeding",
      admittedBy: "Nurse Allen",
    },
    {
      id: "EM002",
      name: "Clark Kent",
      phone: "222-333-4444",
      condition: "Concussion",
      admittedBy: "Dr. Wayne",
    },
  ],
  pastCases: [
    {
      id: "EM003",
      name: "Bruce Wayne",
      phone: "999-888-7777",
      condition: "Fractured arm",
      admittedBy: "Dr. Kyle",
      outcome: "Discharged",
    },
  ],
};

const Emergency = () => {
  const [activeTab, setActiveTab] = useState("activeCases");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formFields, setFormFields] = useState({ outcome: "" });
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const data = dummyEmergencyData[activeTab] || [];
    setFilteredData(
      searchTerm.trim()
        ? data.filter(
            (item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.id.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : data
    );
  }, [activeTab, searchTerm]);

  const openModal = (record) => {
    setSelectedRecord(record);
    setFormFields({ outcome: record.outcome || "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  const handleFormChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("Emergency case updated (dummy)!");
    closeModal();
  };

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
            <h5 className="m-0 d-none d-sm-block">Emergency Dept</h5>
          </div>

          <nav className="nav flex-column">
            <button
              className={`nav-link btn btn-link text-white px-1 ${
                activeTab === "activeCases" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveTab("activeCases")}
            >
              <FaHeartbeat className="me-2" />
              <span className="d-none d-sm-inline">Active Cases</span>
            </button>
            <button
              className={`nav-link btn btn-link text-white px-1 ${
                activeTab === "pastCases" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveTab("pastCases")}
            >
              <FaHistory className="me-2" />
              <span className="d-none d-sm-inline">Past Cases</span>
            </button>
          </nav>
        </div>

        <footer className="text-center" style={{ fontSize: 12, opacity: 0.7 }}>
          &copy; Beta Softwares 2025
        </footer>
      </aside>

      {/* Main Panel */}
      <main className="flex-grow-1 p-4" style={{ overflowY: "auto" }}>
        <h4>Hello Emergency Team</h4>

        <div className="d-flex flex-wrap gap-3 mb-4">
          <div
            className="card text-white"
            style={{ backgroundColor: "#3c51a1", flex: "1 1 200px" }}
          >
            <div className="card-body">
              <FaHeartbeat size={28} />
              <h5 className="card-title mt-2">Active Cases</h5>
              <p className="card-text fs-4">
                {dummyEmergencyData.activeCases.length}
              </p>
            </div>
          </div>

          <div
            className="card text-white"
            style={{ backgroundColor: "#88c244", flex: "1 1 200px" }}
          >
            <div className="card-body">
              <FaHistory size={28} />
              <h5 className="card-title mt-2">Past Cases</h5>
              <p className="card-text fs-4">
                {dummyEmergencyData.pastCases.length}
              </p>
            </div>
          </div>
        </div>

        <input
          type="search"
          placeholder="Search patients..."
          className="form-control w-auto mb-3"
          style={{ minWidth: 200 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead style={{ backgroundColor: "#3c51a1", color: "#fff" }}>
              <tr>
                <th>Name</th>
                <th>ID</th>
                <th>Phone</th>
                <th>Condition</th>
                <th>Admitted By</th>
                {activeTab === "pastCases" && <th>Outcome</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No records found.
                  </td>
                </tr>
              ) : (
                filteredData.map((rec, idx) => (
                  <tr key={idx}>
                    <td>{rec.name}</td>
                    <td>{rec.id}</td>
                    <td>{rec.phone}</td>
                    <td>{rec.condition}</td>
                    <td>{rec.admittedBy}</td>
                    {activeTab === "pastCases" && <td>{rec.outcome}</td>}
                    <td>
                      <button
                        className="btn btn-sm"
                        style={{
                          backgroundColor: "#88c244",
                          borderColor: "#88c244",
                          color: "#fff",
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

        {/* Modal */}
        {showModal && (
          <div
            className="modal d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div
                  className="modal-header"
                  style={{ backgroundColor: "#3c51a1", color: "#fff" }}
                >
                  <h5 className="modal-title">Edit Emergency Case</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <label className="form-label">Outcome</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="outcome"
                    value={formFields.outcome}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button
                    className="btn"
                    style={{ backgroundColor: "#3c51a1", color: "#fff" }}
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

export default Emergency;
