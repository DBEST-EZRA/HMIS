import React, { useState, useEffect } from "react";
import {
  FaUserCheck,
  FaHistory,
  FaCalendarAlt,
  FaEdit,
  FaUserMd,
  FaNotesMedical,
  FaPrescriptionBottleAlt,
  FaPills,
  FaFileMedicalAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
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
      doctorNotes: "Patient in good health",
      signsSymptoms: "No complaints",
      prescribedDrugs: "Paracetamol",
      prescribedInjection: "Vitamin B12",
      clinicianCharges: 150,
      consultationFee: 200,
    },
    {
      id: "P002",
      name: "Bob Johnson",
      phone: "987-654-3210",
      recommendedTests: "X-Ray",
      testResult: "Fracture detected",
      doctorNotes: "Apply cast",
      signsSymptoms: "Swelling and pain",
      prescribedDrugs: "Ibuprofen",
      prescribedInjection: "Painkiller",
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
      doctorNotes: "Follow up in 6 months",
      signsSymptoms: "Headaches",
      prescribedDrugs: "None",
      prescribedInjection: "None",
      clinicianCharges: 160,
      consultationFee: 200,
    },
  ],
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
  const [formFields, setFormFields] = useState({
    signsSymptoms: "",
    doctorNotes: "",
    recommendedTests: "",
    testResult: "",
    prescribedDrugs: "",
    prescribedInjection: "",
    clinicianCharges: "",
    consultationFee: 200,
  });

  // Filter data when tab or search changes
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
    if (record) {
      setFormFields({
        signsSymptoms: record.signsSymptoms || "",
        doctorNotes: record.doctorNotes || "",
        recommendedTests: record.recommendedTests || "",
        testResult: record.testResult || "",
        prescribedDrugs: record.prescribedDrugs || "",
        prescribedInjection: record.prescribedInjection || "",
        clinicianCharges: record.clinicianCharges || "",
        consultationFee: record.consultationFee || 200,
      });
    } else {
      setFormFields({
        signsSymptoms: "",
        doctorNotes: "",
        recommendedTests: "",
        testResult: "",
        prescribedDrugs: "",
        prescribedInjection: "",
        clinicianCharges: "",
        consultationFee: 200,
      });
    }
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
    alert("Record saved (dummy)!");
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
        <h4>Hello Dr. Joe</h4>
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
          {/* <h4>Hello Dr. Joe Doe</h4> */}
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
                    <th>Doctor Notes</th>
                    <th>Signs & Symptoms</th>
                    <th>Prescribed Drugs</th>
                    <th>Prescribed Injection</th>
                    <th>Clinician Charges</th>
                    <th>Consultation Fee</th>
                  </>
                )}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={activeTab === "appointments" ? 9 : 14}
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
                        <td>{rec.doctorNotes}</td>
                        <td>{rec.signsSymptoms}</td>
                        <td>{rec.prescribedDrugs}</td>
                        <td>{rec.prescribedInjection}</td>
                        <td>{rec.clinicianCharges}</td>
                        <td>{rec.consultationFee}</td>
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
                  <h5 className="modal-title">Edit Patient Record</h5>
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
                      <label className="form-label">Signs & Symptoms</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        name="signsSymptoms"
                        value={formFields.signsSymptoms}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Doctor Notes</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        name="doctorNotes"
                        value={formFields.doctorNotes}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Recommended Tests</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        name="recommendedTests"
                        value={formFields.recommendedTests}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Test Result</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        name="testResult"
                        value={formFields.testResult}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Prescribed Drugs</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        name="prescribedDrugs"
                        value={formFields.prescribedDrugs}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Prescribed Injection</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        name="prescribedInjection"
                        value={formFields.prescribedInjection}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Clinician Charges</label>
                      <input
                        type="number"
                        className="form-control"
                        name="clinicianCharges"
                        value={formFields.clinicianCharges}
                        onChange={handleFormChange}
                        min="0"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Consultation Fee</label>
                      <input
                        type="number"
                        className="form-control"
                        name="consultationFee"
                        value={formFields.consultationFee}
                        onChange={handleFormChange}
                        min="0"
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
