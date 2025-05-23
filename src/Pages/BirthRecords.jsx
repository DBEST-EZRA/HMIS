import React, { useEffect, useState } from "react";
import { db } from "../Configuration/Config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const BirthRecords = () => {
  const [births, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterDate, setFilterDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [modalLoading, setModalLoading] = useState(false);

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    childName: "",
    fathersName: "",
    mothersName: "",
    birthWeight: "",
    birthDate: "",
    idNumber: "",
    phone: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    let filtered = births;
    if (filterDate) {
      filtered = filtered.filter((p) => p.createdAt?.startsWith(filterDate));
    }
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((p) =>
        Object.values(p)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
    setFilteredPatients(filtered);
  }, [searchTerm, births, filterDate]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const colRef = collection(db, "birthrecords");
      const snapshot = await getDocs(colRef);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPatients(list);
    } catch (error) {
      showError("Failed to fetch Birth Records: " + error.message);
    }
    setLoading(false);
  };

  const showError = (msg) => {
    setErrorMessage(msg);
    setErrorModalOpen(true);
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setSuccessModalOpen(true);
  };

  const openAddModal = () => {
    setModalMode("add");
    setForm({
      childName: "",
      fathersName: "",
      mothersName: "",
      birthWeight: "",
      birthDate: "",
      idNumber: "",
      phone: "",
    });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEditModal = (patient) => {
    setModalMode("edit");
    setForm({
      childName: patient.childName || "",
      fathersName: patient.fathersName || "",
      mothersName: patient.mothersName || "",
      birthWeight: patient.birthWeight || "",
      birthDate: patient.birthDate || "",
      idNumber: patient.idNumber || "",
      phone: patient.phone || "",
    });
    setEditingId(patient.id);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (modalLoading) return;
    setModalOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?"))
      return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "birthrecords", id));
      showSuccess("Patient deleted successfully");
      fetchPatients();
    } catch (error) {
      showError("Failed to delete patient: " + error.message);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    if (!form.childName.trim() || !form.idNumber.trim() || !form.phone.trim()) {
      showError("Please fill in all required fields.");
      setModalLoading(false);
      return;
    }

    try {
      const colRef = collection(db, "birthrecords");
      if (modalMode === "add") {
        await addDoc(colRef, {
          ...form,
          createdAt: new Date().toISOString(),
        });
        showSuccess("Birth Record added successfully");
      } else {
        await updateDoc(doc(db, "birthrecords", editingId), form);
        showSuccess("Birth Record updated successfully");
      }
      fetchPatients();
      setModalOpen(false);
    } catch (error) {
      showError("Failed to save patient: " + error.message);
    }
    setModalLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 20,
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* <h1 style={{ color: "#3C51A1", marginBottom: 20 }}>Manage Patients</h1> */}
      {/* Filter Date */}
      <div style={{ marginBottom: 15 }}>
        <label style={{ fontWeight: "bold", color: "#3C51A1" }}>
          Filter by Date:{" "}
        </label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          style={{
            marginLeft: 10,
            padding: 6,
            borderRadius: 5,
            border: "1px solid #ccc",
          }}
        />
      </div>
      {/* Search and Add */}
      <div
        style={{
          display: "flex",
          marginBottom: 20,
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            flexGrow: 1,
            maxWidth: 400,
          }}
        >
          <input
            type="search"
            placeholder="Search Birth Records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 35px 10px 10px",
              fontSize: 16,
              borderRadius: 5,
              border: "1px solid #ccc",
            }}
            aria-label="Search patients"
          />
          <FaSearch
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#888",
            }}
          />
        </div>

        <button
          onClick={openAddModal}
          style={{
            backgroundColor: "#88C244",
            color: "white",
            border: "none",
            borderRadius: 5,
            padding: "10px 20px",
            fontSize: 16,
            cursor: "pointer",
          }}
          aria-label="Add patient"
        >
          Add Birth
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", flexGrow: 1 }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgb(0 0 0 / 0.1)",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#88C244", color: "white" }}>
              <th
                style={{ padding: 12, border: "1px solid #ddd", minWidth: 140 }}
              >
                Child Name
              </th>
              <th
                style={{ padding: 12, border: "1px solid #ddd", minWidth: 120 }}
              >
                Father
              </th>
              <th
                style={{ padding: 12, border: "1px solid #ddd", minWidth: 120 }}
              >
                Mother
              </th>
              <th
                style={{ padding: 12, border: "1px solid #ddd", minWidth: 150 }}
              >
                Weight (kg)
              </th>
              <th
                style={{ padding: 12, border: "1px solid #ddd", minWidth: 150 }}
              >
                Date
              </th>
              <th
                style={{ padding: 12, border: "1px solid #ddd", minWidth: 150 }}
              >
                ID Number
              </th>
              <th
                style={{ padding: 12, border: "1px solid #ddd", minWidth: 150 }}
              >
                Phone
              </th>
              <th
                style={{ padding: 12, border: "1px solid #ddd", minWidth: 100 }}
                aria-label="Actions"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 20 }}>
                  Loading...
                </td>
              </tr>
            ) : filteredPatients.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 20 }}>
                  No patients found
                </td>
              </tr>
            ) : (
              filteredPatients.map((patient) => (
                <tr key={patient.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: 12 }}>{patient.childName}</td>
                  <td style={{ padding: 12 }}>{patient.fathersName}</td>
                  <td style={{ padding: 12 }}>{patient.mothersName}</td>
                  <td style={{ padding: 12 }}>{patient.birthWeight}</td>
                  <td style={{ padding: 12 }}>{patient.birthDate}</td>
                  <td style={{ padding: 12 }}>{patient.idNumber}</td>
                  <td style={{ padding: 12 }}>{patient.phone}</td>

                  <td
                    style={{
                      padding: 12,
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      gap: 15,
                    }}
                  >
                    <button
                      onClick={() => openEditModal(patient)}
                      aria-label={`Edit patient ${patient.fullName}`}
                      title="Edit"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#3C51A1",
                      }}
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(patient.id)}
                      aria-label={`Delete patient ${patient.fullName}`}
                      title="Delete"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#e53935",
                      }}
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="patient-modal-title"
          tabIndex={-1}
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1100,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              borderRadius: 8,
              padding: 24,
              width: "100%",
              maxWidth: 480,
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h2
              id="patient-modal-title"
              style={{ color: "#3C51A1", marginBottom: 20 }}
            >
              {modalMode === "add" ? "Add Patient" : "Edit Patient"}
            </h2>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 15 }}
            >
              <label style={{ fontWeight: "bold" }}>
                Child Name <span style={{ color: "red" }}>*</span>
                <input
                  name="childName"
                  value={form.childName}
                  onChange={handleFormChange}
                  type="text"
                  required
                  style={{
                    width: "100%",
                    padding: 10,
                    fontSize: 16,
                    borderRadius: 5,
                    border: "1px solid #ccc",
                    marginTop: 6,
                  }}
                  autoFocus
                />
              </label>

              <label style={{ fontWeight: "bold" }}>
                Fathers Name <span style={{ color: "red" }}>*</span>
                <input
                  name="fathersName"
                  value={form.fathersName}
                  onChange={handleFormChange}
                  type="text"
                  required
                  style={{
                    width: "100%",
                    padding: 10,
                    fontSize: 16,
                    borderRadius: 5,
                    border: "1px solid #ccc",
                    marginTop: 6,
                  }}
                  autoFocus
                />
              </label>

              <label style={{ fontWeight: "bold" }}>
                Mothers Name <span style={{ color: "red" }}>*</span>
                <input
                  name="mothersName"
                  value={form.mothersName}
                  onChange={handleFormChange}
                  type="text"
                  required
                  style={{
                    width: "100%",
                    padding: 10,
                    fontSize: 16,
                    borderRadius: 5,
                    border: "1px solid #ccc",
                    marginTop: 6,
                  }}
                  autoFocus
                />
              </label>

              <label style={{ fontWeight: "bold" }}>
                Birth Weight <span style={{ color: "red" }}>*</span>
                <input
                  name="birthWeight"
                  value={form.birthWeight}
                  onChange={handleFormChange}
                  type="text"
                  required
                  style={{
                    width: "100%",
                    padding: 10,
                    fontSize: 16,
                    borderRadius: 5,
                    border: "1px solid #ccc",
                    marginTop: 6,
                  }}
                  autoFocus
                />
              </label>

              <label style={{ fontWeight: "bold" }}>
                Birth Date <span style={{ color: "red" }}>*</span>
                <input
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleFormChange}
                  type="text"
                  required
                  style={{
                    width: "100%",
                    padding: 10,
                    fontSize: 16,
                    borderRadius: 5,
                    border: "1px solid #ccc",
                    marginTop: 6,
                  }}
                  autoFocus
                />
              </label>

              <label style={{ fontWeight: "bold" }}>
                ID Number <span style={{ color: "red" }}>*</span>
                <input
                  name="idNumber"
                  value={form.idNumber}
                  onChange={handleFormChange}
                  type="text"
                  required
                  style={{
                    width: "100%",
                    padding: 10,
                    fontSize: 16,
                    borderRadius: 5,
                    border: "1px solid #ccc",
                    marginTop: 6,
                  }}
                />
              </label>

              <label style={{ fontWeight: "bold" }}>
                Phone <span style={{ color: "red" }}>*</span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleFormChange}
                  type="tel"
                  required
                  style={{
                    width: "100%",
                    padding: 10,
                    fontSize: 16,
                    borderRadius: 5,
                    border: "1px solid #ccc",
                    marginTop: 6,
                  }}
                />
              </label>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  marginTop: 10,
                }}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={modalLoading}
                  style={{
                    backgroundColor: "#e53935",
                    color: "white",
                    padding: "10px 20px",
                    fontSize: 16,
                    borderRadius: 5,
                    border: "none",
                    cursor: modalLoading ? "not-allowed" : "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  style={{
                    backgroundColor: "#88C244",
                    color: "white",
                    padding: "10px 20px",
                    fontSize: 16,
                    borderRadius: 5,
                    border: "none",
                    cursor: modalLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {modalLoading
                    ? modalMode === "add"
                      ? "Adding..."
                      : "Updating..."
                    : modalMode === "add"
                    ? "Add Birth Record"
                    : "Update Birth Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successModalOpen && (
        <div
          role="alertdialog"
          aria-modal="true"
          tabIndex={-1}
          onClick={() => setSuccessModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1200,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              padding: 30,
              borderRadius: 8,
              maxWidth: 400,
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ color: "#88C244", marginBottom: 20 }}>Success!</h3>
            <p>{successMessage}</p>
            <button
              onClick={() => setSuccessModalOpen(false)}
              style={{
                marginTop: 20,
                backgroundColor: "#3C51A1",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: 5,
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModalOpen && (
        <div
          role="alertdialog"
          aria-modal="true"
          tabIndex={-1}
          onClick={() => setErrorModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1200,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              padding: 30,
              borderRadius: 8,
              maxWidth: 400,
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ color: "#e53935", marginBottom: 20 }}>Error!</h3>
            <p>{errorMessage}</p>
            <button
              onClick={() => setErrorModalOpen(false)}
              style={{
                marginTop: 20,
                backgroundColor: "#3C51A1",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: 5,
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BirthRecords;
