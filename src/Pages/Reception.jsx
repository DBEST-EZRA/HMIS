import React, { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaHistory,
  FaBaby,
  FaCalendarCheck,
  FaAmbulance,
  FaProcedures,
  FaSearch,
} from "react-icons/fa";
import logo from "../assets/logo.jpg"; // Replace with actual path

const Reception = () => {
  const [activeSection, setActiveSection] = useState("newPatients");
  const [records, setRecords] = useState({
    newPatients: [],
    pastPatients: [],
    birthRecord: [],
    attendance: [],
    ambulance: [],
    ward: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    phone: "",
    assignee: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const openModal = (index = null) => {
    if (index !== null) {
      setFormData(records[activeSection][index]);
      setEditIndex(index);
    } else {
      setFormData({ name: "", id: "", phone: "", assignee: "" });
      setEditIndex(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: "", id: "", phone: "", assignee: "" });
    setEditIndex(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = [...records[activeSection]];
    if (editIndex !== null) {
      updated[editIndex] = formData;
    } else {
      updated.push(formData);
    }
    setRecords({ ...records, [activeSection]: updated });
    closeModal();
  };

  const handleDelete = (index) => {
    const updated = records[activeSection].filter((_, i) => i !== index);
    setRecords({ ...records, [activeSection]: updated });
  };

  const renderTable = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 style={{ color: "#3C51A1" }}>{sectionLabels[activeSection]}</h5>
        <button
          className="btn"
          style={{ backgroundColor: "#88C244", color: "#fff" }}
          onClick={() => openModal()}
        >
          + Add
        </button>
      </div>

      <div className="input-group mb-3">
        <span className="input-group-text">
          <FaSearch />
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead style={{ backgroundColor: "#3C51A1", color: "#fff" }}>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Phone</th>
              <th>Assignee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords().length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No records found.
                </td>
              </tr>
            ) : (
              filteredRecords().map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.id}</td>
                  <td>{item.phone}</td>
                  <td>{item.assignee}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => openModal(index)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(index)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );

  const filteredRecords = () => {
    return records[activeSection].filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const sectionLabels = {
    newPatients: "New Patients",
    pastPatients: "Past Patients",
    birthRecord: "Birth Record",
    attendance: "Attendance",
    ambulance: "Ambulance",
    ward: "Ward",
  };

  const sidebarItems = [
    { key: "newPatients", label: "New Patients", icon: <FaUserPlus /> },
    { key: "pastPatients", label: "Past Patients", icon: <FaHistory /> },
    { key: "birthRecord", label: "Birth Record", icon: <FaBaby /> },
    { key: "attendance", label: "Attendance", icon: <FaCalendarCheck /> },
    { key: "ambulance", label: "Ambulance", icon: <FaAmbulance /> },
    { key: "ward", label: "Ward", icon: <FaProcedures /> },
  ];

  return (
    <div className="vh-100 d-flex">
      {/* Sidebar */}
      <div className="bg-white border-end p-3" style={{ width: "240px" }}>
        <img
          src={logo}
          alt="Minto Logo"
          className="mb-3"
          style={{ height: "50px" }}
        />
        <ul className="list-unstyled">
          {sidebarItems.map(({ key, label, icon }) => (
            <li
              key={key}
              onClick={() => setActiveSection(key)}
              style={{
                cursor: "pointer",
                padding: "10px",
                borderRadius: "5px",
                backgroundColor:
                  activeSection === key ? "#3C51A1" : "transparent",
                color: activeSection === key ? "white" : "#3C51A1",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "5px",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#e7eaf9")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  activeSection === key ? "#3C51A1" : "transparent")
              }
            >
              {icon} {label}
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="flex-grow-1 d-flex flex-column bg-light">
        {/* Header */}
        <header
          className="d-flex align-items-center p-3 shadow-sm"
          style={{ backgroundColor: "#3C51A1" }}
        >
          <h4 className="text-white m-0">
            Minto Medical Center - Reception Desk
          </h4>
        </header>

        {/* Main Content */}
        <main className="container-fluid py-4 overflow-auto">
          {renderTable()}
        </main>
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
                <h5 className="modal-title">
                  {editIndex !== null ? "Edit Entry" : "Add Entry"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">ID</label>
                    <input
                      type="text"
                      className="form-control"
                      name="id"
                      value={formData.id}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Assignee</label>
                    <select
                      className="form-select"
                      name="assignee"
                      value={formData.assignee}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select Clinician --</option>
                      <option value="clinician1">Clinician 1</option>
                      <option value="clinician2">Clinician 2</option>
                      <option value="clinician3">Clinician 3</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn"
                    style={{ backgroundColor: "#3C51A1", color: "#fff" }}
                  >
                    {editIndex !== null ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reception;
