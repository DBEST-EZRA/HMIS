import React, { useState, useEffect } from "react";
import { FaXRay, FaUserCheck, FaCalendarAlt, FaEdit } from "react-icons/fa";
import logo from "../assets/logo.jpg"; // Adjust the path if needed
import "bootstrap/dist/css/bootstrap.min.css";

const dummyXrayData = {
  pendingXrays: [
    {
      id: "XR001",
      name: "Alice Smith",
      phone: "123-456-7890",
      reason: "Leg injury",
      requestedBy: "Dr. Joe",
    },
    {
      id: "XR002",
      name: "Bob Johnson",
      phone: "987-654-3210",
      reason: "Chest pain",
      requestedBy: "Dr. Joe",
    },
  ],
  completedXrays: [
    {
      id: "XR003",
      name: "Charlie Davis",
      phone: "555-555-5555",
      reason: "Back pain",
      requestedBy: "Dr. Kim",
      result: "No fracture",
    },
  ],
};

const Xray = () => {
  const [activeTab, setActiveTab] = useState("pendingXrays");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formFields, setFormFields] = useState({
    result: "",
  });
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const data = dummyXrayData[activeTab] || [];
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
    setFormFields({ result: record.result || "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("X-ray result saved (dummy)!");
    closeModal();
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
              alt="Logo"
              style={{ height: 40, marginRight: 10 }}
              className="d-none d-sm-block"
            />
            <h5 className="m-0 d-none d-sm-block">X-Ray Dept</h5>
          </div>

          <nav className="nav flex-column">
            <button
              className={`nav-link btn btn-link text-white px-1 ${
                activeTab === "pendingXrays" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveTab("pendingXrays")}
            >
              <FaUserCheck className="me-2" />
              <span className="d-none d-sm-inline">Pending X-rays</span>
            </button>
            <button
              className={`nav-link btn btn-link text-white px-1 ${
                activeTab === "completedXrays" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveTab("completedXrays")}
            >
              <FaCalendarAlt className="me-2" />
              <span className="d-none d-sm-inline">Completed X-rays</span>
            </button>
          </nav>
        </div>

        <footer className="text-center" style={{ fontSize: 12, opacity: 0.7 }}>
          &copy; Beta Softwares 2025
        </footer>
      </aside>

      {/* Main Panel */}
      <main className="flex-grow-1 p-4" style={{ overflowY: "auto" }}>
        <h4>Hello Radiologist</h4>

        <div className="d-flex flex-wrap gap-3 mb-4">
          <div
            className="card text-white"
            style={{ backgroundColor: "#3C51A1", flex: "1 1 200px" }}
          >
            <div className="card-body">
              <FaXRay size={28} />
              <h5 className="card-title mt-2">Pending X-rays</h5>
              <p className="card-text fs-4">
                {dummyXrayData.pendingXrays.length}
              </p>
            </div>
          </div>

          <div
            className="card text-white"
            style={{ backgroundColor: "#88C244", flex: "1 1 200px" }}
          >
            <div className="card-body">
              <FaXRay size={28} />
              <h5 className="card-title mt-2">Completed X-rays</h5>
              <p className="card-text fs-4">
                {dummyXrayData.completedXrays.length}
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
            <thead style={{ backgroundColor: "#3C51A1", color: "#fff" }}>
              <tr>
                <th>Name</th>
                <th>ID</th>
                <th>Phone</th>
                <th>Reason</th>
                <th>Requested By</th>
                {activeTab === "completedXrays" && <th>Result</th>}
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
                    <td>{rec.reason}</td>
                    <td>{rec.requestedBy}</td>
                    {activeTab === "completedXrays" && <td>{rec.result}</td>}
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
                  style={{ backgroundColor: "#3C51A1", color: "#fff" }}
                >
                  <h5 className="modal-title">Edit X-ray Result</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <label className="form-label">Result</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="result"
                    value={formFields.result}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button
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

export default Xray;
