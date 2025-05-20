import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import logo from "../assets/logo.jpg"; // Replace with actual path

const Reception = () => {
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    phone: "",
    assignee: "",
  });

  const openModal = (index = null) => {
    if (index !== null) {
      setFormData(patients[index]);
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
    if (editIndex !== null) {
      const updated = [...patients];
      updated[editIndex] = formData;
      setPatients(updated);
    } else {
      setPatients([...patients, formData]);
    }
    closeModal();
  };

  const handleDelete = (index) => {
    const updated = patients.filter((_, i) => i !== index);
    setPatients(updated);
  };

  return (
    <div className="vh-100 d-flex flex-column bg-light">
      {/* Header */}
      <header
        className="d-flex align-items-center p-3 shadow-sm"
        style={{ backgroundColor: "#3C51A1" }}
      >
        <img
          src={logo}
          alt="Minto Logo"
          style={{ height: "50px", marginRight: "15px" }}
        />
        <h4 className="text-white m-0">
          Minto Medical Center - Reception Desk
        </h4>
      </header>

      {/* Main Content */}
      <main className="flex-grow-1 container-fluid py-4 overflow-auto">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 style={{ color: "#3C51A1" }}>Patient Records</h5>
          <button
            className="btn"
            style={{ backgroundColor: "#88C244", color: "#fff" }}
            onClick={() => openModal()}
          >
            + Add Patient
          </button>
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
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No patient records found.
                  </td>
                </tr>
              ) : (
                patients.map((patient, index) => (
                  <tr key={index}>
                    <td>{patient.name}</td>
                    <td>{patient.id}</td>
                    <td>{patient.phone}</td>
                    <td>{patient.assignee}</td>
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
      </main>

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
                  {editIndex !== null ? "Edit Patient" : "Add Patient"}
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
