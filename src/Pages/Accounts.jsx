import React, { useState, useEffect } from "react";
import {
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaMoneyCheckAlt,
  FaEdit,
} from "react-icons/fa";
import logo from "../assets/logo.jpg";
import "bootstrap/dist/css/bootstrap.min.css";

const dummyAccountsData = {
  paid: [
    {
      id: "AC001",
      patient: "Tony Stark",
      summary: "X-Ray, Consultation",
      total: 3000,
      paymentMethod: "mpesa",
      description: "",
    },
  ],
  unpaid: [
    {
      id: "AC002",
      patient: "Steve Rogers",
      summary: "Surgery, Medication",
      total: 12000,
      paymentMethod: "multiple",
      description: "5000 cash, 7000 sha",
    },
  ],
};

const Accounts = () => {
  const [activeTab, setActiveTab] = useState("paid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formFields, setFormFields] = useState({
    summary: "",
    total: 0,
    paymentMethod: "",
    description: "",
  });

  useEffect(() => {
    const data = dummyAccountsData[activeTab] || [];
    setFilteredData(
      searchTerm.trim()
        ? data.filter(
            (item) =>
              item.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.id.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : data
    );
  }, [activeTab, searchTerm]);

  const openModal = (record) => {
    setSelectedRecord(record);
    setFormFields({
      summary: record.summary,
      total: record.total,
      paymentMethod: record.paymentMethod,
      description: record.description || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSave = () => {
    alert("Billing record updated (dummy)!");
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
            <h5 className="m-0 d-none d-sm-block">Accounts</h5>
          </div>

          <nav className="nav flex-column">
            <button
              className={`nav-link btn btn-link text-white px-1 ${
                activeTab === "paid" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveTab("paid")}
            >
              <FaMoneyBillWave className="me-2" />
              <span className="d-none d-sm-inline">Paid</span>
            </button>
            <button
              className={`nav-link btn btn-link text-white px-1 ${
                activeTab === "unpaid" ? "fw-bold" : ""
              }`}
              onClick={() => setActiveTab("unpaid")}
            >
              <FaMoneyCheckAlt className="me-2" />
              <span className="d-none d-sm-inline">Unpaid</span>
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
              <h5 className="card-title mt-2">Paid</h5>
              <p className="card-text fs-4">{dummyAccountsData.paid.length}</p>
            </div>
          </div>

          <div
            className="card text-white"
            style={{ backgroundColor: "#88c244", flex: "1 1 200px" }}
          >
            <div className="card-body">
              <FaMoneyCheckAlt size={28} />
              <h5 className="card-title mt-2">Unpaid</h5>
              <p className="card-text fs-4">
                {dummyAccountsData.unpaid.length}
              </p>
            </div>
          </div>

          <div
            className="card text-white"
            style={{ backgroundColor: "#6c757d", flex: "1 1 200px" }}
          >
            <div className="card-body">
              <FaFileInvoiceDollar size={28} />
              <h5 className="card-title mt-2">Total Invoices</h5>
              <p className="card-text fs-4">
                {dummyAccountsData.paid.length +
                  dummyAccountsData.unpaid.length}
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
                <th>Patient</th>
                <th>ID</th>
                <th>Summary</th>
                <th>Total (KES)</th>
                <th>Payment Method</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No billing records found.
                  </td>
                </tr>
              ) : (
                filteredData.map((rec, idx) => (
                  <tr key={idx}>
                    <td>{rec.patient}</td>
                    <td>{rec.id}</td>
                    <td>{rec.summary}</td>
                    <td>{rec.total}</td>
                    <td>{rec.paymentMethod}</td>
                    <td>
                      {rec.paymentMethod === "multiple" ? rec.description : "-"}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm"
                        style={{ backgroundColor: "#88c244", color: "#fff" }}
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
                  <h5 className="modal-title">Edit Billing Record</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Bill Summary</label>
                    <input
                      type="text"
                      className="form-control"
                      name="summary"
                      value={formFields.summary}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Total (KES)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="total"
                      value={formFields.total}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Payment Method</label>
                    <select
                      className="form-select"
                      name="paymentMethod"
                      value={formFields.paymentMethod}
                      onChange={handleFormChange}
                    >
                      <option value="">Select...</option>
                      <option value="cash">Cash</option>
                      <option value="mpesa">MPESA</option>
                      <option value="sha">SHA</option>
                      <option value="multiple">Multiple</option>
                    </select>
                  </div>
                  {formFields.paymentMethod === "multiple" && (
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows="3"
                        value={formFields.description}
                        onChange={handleFormChange}
                        placeholder="E.g. 2000 mpesa, 1000 cash"
                      />
                    </div>
                  )}
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
                    Save Changes
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

export default Accounts;
