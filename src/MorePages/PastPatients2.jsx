import React, { useEffect, useState } from "react";
import { db } from "../Configuration/Config";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { FaEdit, FaSearch } from "react-icons/fa";

const PastPatients2 = () => {
  const [patients, setPatients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formFields, setFormFields] = useState({
    notes: "",
    recommendedTest: "",
    testResult: "",
    symptoms: "",
    drugs: "",
    injection: "",
    charges: "",
    fee: "200",
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [patients, searchTerm, dateFilter, monthFilter, yearFilter]);

  const fetchPatients = async () => {
    const q = query(
      collection(db, "patients"),
      where("assignee", "==", "Doctor1")
    );
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPatients(list);
  };

  const filterPatients = () => {
    const filteredList = patients.filter((p) => {
      const matchesSearch =
        p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.idNumber?.includes(searchTerm);
      const matchesDate = !dateFilter || p.createdAt?.startsWith(dateFilter);
      const matchesMonth =
        !monthFilter ||
        (p.createdAt &&
          new Date(p.createdAt).getMonth() + 1 === parseInt(monthFilter));
      const matchesYear =
        !yearFilter ||
        (p.createdAt &&
          new Date(p.createdAt).getFullYear() === parseInt(yearFilter));
      return matchesSearch && matchesDate && matchesMonth && matchesYear;
    });

    setFiltered(filteredList);
    setCurrentPage(1);
  };

  const openModal = (patient) => {
    setSelectedPatient(patient);
    setFormFields({
      notes: patient.notes || "",
      recommendedTest: patient.recommendedTest || "",
      testResult: patient.testResult || "",
      symptoms: patient.symptoms || "",
      drugs: patient.drugs || "",
      injection: patient.injection || "",
      charges: patient.charges || "",
      fee: patient.fee || "200",
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, "patients", selectedPatient.id);
      await updateDoc(docRef, formFields);
      fetchPatients();
      setModalOpen(false);
    } catch (err) {
      alert("Failed to update record: " + err.message);
    }
  };

  const totalPages = Math.ceil(filtered.length / entriesPerPage);
  const paginatedData = filtered.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <div
      style={{ padding: 20, minHeight: "100vh", backgroundColor: "#f5f5f5" }}
    >
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="form-control"
          style={{ maxWidth: 200 }}
        />

        <select
          className="form-select"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          style={{ maxWidth: 120 }}
        >
          <option value="">Month</option>
          {[...Array(12).keys()].map((m) => (
            <option key={m + 1} value={m + 1}>
              {new Date(0, m).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          className="form-select"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          style={{ maxWidth: 100 }}
        >
          <option value="">Year</option>
          {Array.from(
            new Set(patients.map((p) => p.createdAt?.slice(0, 4)))
          ).map((year) => year && <option key={year}>{year}</option>)}
        </select>

        <div className="input-group" style={{ maxWidth: 300 }}>
          <span className="input-group-text">
            <FaSearch />
          </span>
          <input
            type="search"
            className="form-control"
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          Show{" "}
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(parseInt(e.target.value))}
            className="form-select d-inline-block"
            style={{ width: "auto" }}
          >
            {[10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>{" "}
          entries
        </div>
        <div>
          Page{" "}
          <strong>
            {currentPage} of {totalPages}
          </strong>{" "}
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead style={{ backgroundColor: "#3C51A1", color: "white" }}>
            <tr>
              <th>Full Name</th>
              <th>ID Number</th>
              <th>Phone</th>
              <th>Doctor Notes</th>
              <th>Recommended Test</th>
              <th>Test Result</th>
              <th>Signs & Symptoms</th>
              <th>Prescribed Drugs</th>
              <th>Prescribed Injection</th>
              <th>Clinical Charges</th>
              <th>Consultation Fee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="12" className="text-center text-muted">
                  No records found.
                </td>
              </tr>
            ) : (
              paginatedData.map((p) => (
                <tr key={p.id}>
                  <td>{p.fullName}</td>
                  <td>{p.idNumber}</td>
                  <td>{p.phone}</td>
                  <td>{p.notes || "-"}</td>
                  <td>{p.recommendedTest || "-"}</td>
                  <td>{p.testResult || "-"}</td>
                  <td>{p.symptoms || "-"}</td>
                  <td>{p.drugs || "-"}</td>
                  <td>{p.injection || "-"}</td>
                  <td>{p.charges || "-"}</td>
                  <td>{p.consultationFee || "200"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => openModal(p)}
                      aria-label="Edit record"
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

      <div className="d-flex justify-content-center align-items-center mt-3 gap-2 flex-wrap">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`btn ${
              currentPage === i + 1 ? "btn-primary" : "btn-outline-secondary"
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {modalOpen && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ backgroundColor: "#3C51A1", color: "white" }}
              >
                <h5 className="modal-title">Edit Outpatient Record</h5>
                <button
                  className="btn-close"
                  onClick={() => setModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                {[
                  { label: "CO Notes", name: "notes" },
                  { label: "Recommended Test", name: "recommendedTest" },
                  { label: "Test Result", name: "testResult" },
                  { label: "Sign & Symptoms", name: "symptoms" },
                  { label: "Prescribed Drugs", name: "drugs" },
                  { label: "Prescribed Injection", name: "injection" },
                  { label: "Clinical Charges", name: "charges" },
                ].map(({ label, name }) => (
                  <div className="mb-3" key={name}>
                    <label className="form-label">{label}</label>
                    <textarea
                      name={name}
                      className="form-control"
                      value={formFields[name]}
                      onChange={handleChange}
                    />
                  </div>
                ))}

                <div className="mb-3">
                  <label className="form-label">Consultation Fee</label>
                  <input
                    type="text"
                    className="form-control text-muted"
                    value={formFields.fee}
                    disabled
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn"
                  style={{ backgroundColor: "#88C244", color: "#000" }}
                  onClick={handleUpdate}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PastPatients2;
