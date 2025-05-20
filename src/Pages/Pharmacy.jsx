import React, { useState, useEffect } from "react";
import {
  FaUserInjured,
  FaCapsules,
  FaEdit,
  FaPlus,
  FaSearch,
} from "react-icons/fa";
import logo from "../assets/logo.jpg"; // your logo path
import "bootstrap/dist/css/bootstrap.min.css";

const dummyData = {
  patients: [
    {
      id: "P001",
      name: "Alice Smith",
      phone: "123-456-7890",
      prescribedDrugs: "Paracetamol",
      prescribedInjection: "Vitamin B12",
      doctorNotes: "Take with food",
      pharmacyBill: 50,
    },
    {
      id: "P002",
      name: "Bob Johnson",
      phone: "987-654-3210",
      prescribedDrugs: "Ibuprofen",
      prescribedInjection: "Painkiller",
      doctorNotes: "Avoid driving",
      pharmacyBill: 75,
    },
  ],
  inventory: [
    {
      id: "M001",
      name: "Paracetamol",
      quantity: 120,
      sellingPrice: 10,
    },
    {
      id: "M002",
      name: "Ibuprofen",
      quantity: 80,
      sellingPrice: 15,
    },
  ],
};

const Pharmacy = () => {
  const [activeTab, setActiveTab] = useState("patients");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(dummyData.patients);
  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [formFields, setFormFields] = useState({});

  // Update filtered data on tab or search change
  useEffect(() => {
    const data = dummyData[activeTab] || [];
    if (!searchTerm.trim()) {
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

  const openModal = (record = null) => {
    setEditRecord(record);
    if (record) {
      setFormFields({ ...record });
    } else {
      // Reset form for adding new record
      setFormFields({});
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditRecord(null);
    setFormFields({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("Record saved (dummy)!");
    closeModal();
  };

  return (
    <div className="d-flex vh-100 bg-light">
      {/* Left Panel */}
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
          {/* Logo and title */}
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
              type="button"
              className={`nav-link d-flex align-items-center text-white btn btn-link px-1 ${
                activeTab === "patients" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveTab("patients")}
            >
              <FaUserInjured className="me-2" />
              <span className="d-none d-sm-inline">Patients</span>
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
        {/* Header with Add + Search */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h4 className="mb-0 text-truncate">
            {activeTab === "patients" ? "Patients" : "Inventory"}
          </h4>
          <div className="d-flex gap-2 flex-wrap">
            <button
              className="btn"
              style={{ backgroundColor: "#88C244", color: "#000" }}
              onClick={() => openModal()}
              aria-label="Add new record"
            >
              <FaPlus /> Add
            </button>
            <input
              type="search"
              placeholder="Search..."
              className="form-control"
              style={{ minWidth: 200 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search records"
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead style={{ backgroundColor: "#3C51A1", color: "#fff" }}>
              {activeTab === "patients" && (
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Prescribed Drugs</th>
                  <th>Prescribed Injection</th>
                  <th>Doctor Notes</th>
                  <th>Pharmacy Bill</th>
                  <th>Actions</th>
                </tr>
              )}
              {activeTab === "inventory" && (
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Selling Price</th>
                  <th>Actions</th>
                </tr>
              )}
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={activeTab === "patients" ? 7 : 4}
                    className="text-center text-muted"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, idx) => (
                  <tr key={idx}>
                    {activeTab === "patients" ? (
                      <>
                        <td>{item.name}</td>
                        <td>{item.phone}</td>
                        <td>{item.prescribedDrugs}</td>
                        <td>{item.prescribedInjection}</td>
                        <td>{item.doctorNotes}</td>
                        <td>{item.pharmacyBill}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-light"
                            style={{
                              backgroundColor: "#88C244",
                              borderColor: "#88C244",
                              color: "#000",
                            }}
                            onClick={() => openModal(item)}
                            aria-label={`Edit record for ${item.name}`}
                          >
                            <FaEdit />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.sellingPrice}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-light"
                            style={{
                              backgroundColor: "#88C244",
                              borderColor: "#88C244",
                              color: "#000",
                            }}
                            onClick={() => openModal(item)}
                            aria-label={`Edit inventory item ${item.name}`}
                          >
                            <FaEdit />
                          </button>
                        </td>
                      </>
                    )}
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
                  <h5 className="modal-title">
                    {editRecord ? "Edit" : "Add"}{" "}
                    {activeTab === "patients" ? "Patient" : "Inventory Item"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                    aria-label="Close modal"
                  ></button>
                </div>
                <div className="modal-body">
                  <form>
                    {activeTab === "patients" ? (
                      <>
                        <div className="mb-3">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={formFields.name || ""}
                            onChange={handleFormChange}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Phone</label>
                          <input
                            type="text"
                            name="phone"
                            className="form-control"
                            value={formFields.phone || ""}
                            onChange={handleFormChange}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Prescribed Drugs</label>
                          <input
                            type="text"
                            name="prescribedDrugs"
                            className="form-control"
                            value={formFields.prescribedDrugs || ""}
                            onChange={handleFormChange}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">
                            Prescribed Injection
                          </label>
                          <input
                            type="text"
                            name="prescribedInjection"
                            className="form-control"
                            value={formFields.prescribedInjection || ""}
                            onChange={handleFormChange}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Doctor Notes</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            name="doctorNotes"
                            value={formFields.doctorNotes || ""}
                            onChange={handleFormChange}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Pharmacy Bill</label>
                          <input
                            type="number"
                            name="pharmacyBill"
                            className="form-control"
                            value={formFields.pharmacyBill || ""}
                            onChange={handleFormChange}
                            min="0"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mb-3">
                          <label className="form-label">Medicine Name</label>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={formFields.name || ""}
                            onChange={handleFormChange}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Quantity</label>
                          <input
                            type="number"
                            name="quantity"
                            className="form-control"
                            value={formFields.quantity || ""}
                            onChange={handleFormChange}
                            min="0"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Selling Price</label>
                          <input
                            type="number"
                            name="sellingPrice"
                            className="form-control"
                            value={formFields.sellingPrice || ""}
                            onChange={handleFormChange}
                            min="0"
                          />
                        </div>
                      </>
                    )}
                  </form>
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

export default Pharmacy;
