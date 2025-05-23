import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../Configuration/Config";

const Ambulance = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    id: "",
    case: "",
    pickupLocation: "",
    charges: "",
  });
  const [editingDocId, setEditingDocId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchRecords();
  }, [filterDate]);

  const fetchRecords = async () => {
    const start = new Date(filterDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(filterDate);
    end.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, "ambulance"),
      where("timestamp", ">=", Timestamp.fromDate(start)),
      where("timestamp", "<=", Timestamp.fromDate(end))
    );

    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((d) => ({ docId: d.id, ...d.data() }));
    setRecords(list);
    setFilteredRecords(list);
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRecords(records);
    } else {
      const filtered = records.filter((r) =>
        Object.values(r)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredRecords(filtered);
    }
  }, [searchTerm, records]);

  const openModal = (mode = "add", record = null) => {
    setModalMode(mode);
    if (record) {
      setForm({
        name: record.name,
        phone: record.phone,
        id: record.id,
        case: record.case,
        pickupLocation: record.pickupLocation,
        charges: record.charges,
      });
      setEditingDocId(record.docId);
    } else {
      setForm({
        name: "",
        phone: "",
        id: "",
        case: "",
        pickupLocation: "",
        charges: "",
      });
      setEditingDocId(null);
    }
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      timestamp: Timestamp.fromDate(new Date(filterDate)),
    };

    try {
      if (modalMode === "edit" && editingDocId) {
        await updateDoc(doc(db, "ambulance", editingDocId), data);
        setSuccessMessage("Record updated successfully.");
      } else {
        await addDoc(collection(db, "ambulance"), data);
        setSuccessMessage("Record added successfully.");
      }
      setModalOpen(false);
      fetchRecords();
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const handleDelete = async (docId) => {
    if (window.confirm("Delete this record?")) {
      try {
        await deleteDoc(doc(db, "ambulance", docId));
        fetchRecords();
      } catch (error) {
        setErrorMessage("Failed to delete record.");
      }
    }
  };

  const inputStyle = {
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    border: "1px solid #ccc",
  };

  const cancelStyle = {
    backgroundColor: "#3C51A1",
    color: "white",
    padding: "10px 20px",
    borderRadius: 5,
    border: "none",
    cursor: "pointer",
  };

  const submitStyle = {
    backgroundColor: "#88C244",
    color: "white",
    padding: "10px 20px",
    borderRadius: 5,
    border: "none",
    cursor: "pointer",
  };

  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1200,
  };

  const alertBoxStyle = {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 8,
    maxWidth: 400,
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  };

  return (
    <div style={{ padding: 20, background: "#f5f5f5", minHeight: "100vh" }}>
      <h2 style={{ color: "#3C51A1", marginBottom: 20 }}>Ambulance Records</h2>

      <div
        style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}
      >
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          style={inputStyle}
        />

        <input
          type="search"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={inputStyle}
        />

        <button onClick={() => openModal("add")} style={submitStyle}>
          Add Record
        </button>
      </div>

      <div style={{ overflowX: "auto", background: "white", borderRadius: 8 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#3C51A1", color: "white" }}>
            <tr>
              <th style={{ padding: 12 }}>Name</th>
              <th style={{ padding: 12 }}>Phone</th>
              <th style={{ padding: 12 }}>ID</th>
              <th style={{ padding: 12 }}>Case</th>
              <th style={{ padding: 12 }}>Pickup Location</th>
              <th style={{ padding: 12 }}>Charges</th>
              <th style={{ padding: 12 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 20 }}>
                  No records found
                </td>
              </tr>
            ) : (
              filteredRecords.map((r) => (
                <tr key={r.docId}>
                  <td style={{ padding: 12 }}>{r.name}</td>
                  <td style={{ padding: 12 }}>{r.phone}</td>
                  <td style={{ padding: 12 }}>{r.id}</td>
                  <td style={{ padding: 12 }}>{r.case}</td>
                  <td style={{ padding: 12 }}>{r.pickupLocation}</td>
                  <td style={{ padding: 12 }}>{r.charges}</td>
                  <td style={{ padding: 12 }}>
                    <button
                      onClick={() => openModal("edit", r)}
                      style={{
                        marginRight: 10,
                        background: "none",
                        border: "none",
                        color: "#3C51A1",
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(r.docId)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#3C51A1",
                      }}
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

      {modalOpen && (
        <div onClick={() => setModalOpen(false)} style={modalStyle}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              padding: 30,
              borderRadius: 8,
              width: 400,
            }}
          >
            <h3 style={{ color: "#3C51A1", marginBottom: 20 }}>
              {modalMode === "edit" ? "Edit Record" : "Add Record"}
            </h3>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 15 }}
            >
              <input
                name="name"
                placeholder="Patient Name"
                value={form.name}
                onChange={handleFormChange}
                required
                style={inputStyle}
              />
              <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleFormChange}
                required
                style={inputStyle}
              />
              <input
                name="id"
                placeholder="ID"
                value={form.id}
                onChange={handleFormChange}
                required
                style={inputStyle}
              />
              <input
                name="case"
                placeholder="Case"
                value={form.case}
                onChange={handleFormChange}
                required
                style={inputStyle}
              />
              <input
                name="pickupLocation"
                placeholder="Pickup Location"
                value={form.pickupLocation}
                onChange={handleFormChange}
                required
                style={inputStyle}
              />
              <input
                name="charges"
                placeholder="Charges"
                type="number"
                value={form.charges}
                onChange={handleFormChange}
                required
                style={inputStyle}
              />
              <div
                style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
              >
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={cancelStyle}
                >
                  Cancel
                </button>
                <button type="submit" style={submitStyle}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {successMessage && (
        <div style={modalStyle} onClick={() => setSuccessMessage("")}>
          <div style={alertBoxStyle}>
            <h3 style={{ color: "#88C244", marginBottom: 20 }}>Success!</h3>
            <p>{successMessage}</p>
            <button onClick={() => setSuccessMessage("")} style={submitStyle}>
              Close
            </button>
          </div>
        </div>
      )}

      {errorMessage && (
        <div style={modalStyle} onClick={() => setErrorMessage("")}>
          <div style={alertBoxStyle}>
            <h3 style={{ color: "#e53935", marginBottom: 20 }}>Error!</h3>
            <p>{errorMessage}</p>
            <button onClick={() => setErrorMessage("")} style={cancelStyle}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ambulance;
