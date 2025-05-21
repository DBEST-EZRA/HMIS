import React, { useEffect, useState } from "react";
import { auth, db } from "../Configuration/Config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const roles = [
  "lab",
  "clinical officer",
  "doctor",
  "nurse",
  "dentist",
  "accountant",
  "receptionist",
  "security",
  "cleaner",
  "physiotherapist",
  "other",
];

const defaultPassword = "12345678";

const EditIcon = ({ color = "#3C51A1", size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    width={size}
    height={size}
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

const DeleteIcon = ({ color = "#e53935", size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    width={size}
    height={size}
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);

const AddEmployee = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: roles[0],
    qualification: "",
    specialization: "",
    salary: "",
  });

  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const colRef = collection(db, "users");
      const snapshot = await getDocs(colRef);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEmployees(list);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      role: roles[0],
      qualification: "",
      specialization: "",
      salary: "",
    });
    setEditingId(null);
  };

  const addEmployee = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        defaultPassword
      );
      const uid = userCredential.user.uid;

      await addDoc(collection(db, "users"), {
        uid,
        name: form.name,
        email: form.email,
        role: form.role,
        qualification: form.qualification,
        specialization: form.specialization,
        salary: form.salary,
        createdAt: new Date().toISOString(),
      });

      setShowSuccessModal(true);
      resetForm();
      fetchEmployees();
      setFormOpen(false); // auto close form after adding
    } catch (error) {
      alert("Error adding employee: " + error.message);
      console.error(error);
    }
    setLoading(false);
  };

  const updateEmployee = async () => {
    if (!editingId) return;
    setLoading(true);
    try {
      const docRef = doc(db, "users", editingId);
      await updateDoc(docRef, {
        name: form.name,
        email: form.email,
        role: form.role,
        qualification: form.qualification,
        specialization: form.specialization,
        salary: form.salary,
      });
      setShowSuccessModal(true);
      resetForm();
      fetchEmployees();
      setFormOpen(false); // auto close form after updating
    } catch (error) {
      alert("Error updating employee: " + error.message);
      console.error(error);
    }
    setLoading(false);
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "users", id));
      fetchEmployees();
    } catch (error) {
      alert("Error deleting employee: " + error.message);
      console.error(error);
    }
    setLoading(false);
  };

  const startEdit = (employee) => {
    setEditingId(employee.id);
    setForm({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      qualification: employee.qualification,
      specialization: employee.specialization,
      salary: employee.salary,
    });
    setFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateEmployee();
    } else {
      addEmployee();
    }
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "auto",
        padding: 20,
        fontFamily: "Arial",
      }}
    >
      {/* Toggle button */}
      <button
        onClick={() => setFormOpen((open) => !open)}
        style={{
          marginBottom: 15,
          backgroundColor: "#88C244",
          color: "white",
          padding: "10px 20px",
          fontSize: 16,
          borderRadius: 5,
          border: "none",
          cursor: "pointer",
        }}
        aria-expanded={formOpen}
        aria-controls="employee-form"
      >
        {formOpen
          ? "Hide Employee Form"
          : editingId
          ? "Edit Employee"
          : "Add Employee"}
      </button>

      {/* Collapsible Form */}
      <div
        id="employee-form"
        style={{
          maxHeight: formOpen ? "1000px" : "0",
          overflow: "hidden",
          transition: "max-height 0.4s ease",
          marginBottom: formOpen ? 30 : 0,
        }}
      >
        <h2 style={{ color: "#3C51A1" }}>
          {editingId ? "Edit Employee" : "Add Employee"}
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 15,
          }}
        >
          <input
            required
            type="text"
            name="name"
            placeholder="Employee Name"
            value={form.name}
            onChange={handleChange}
            style={{ padding: 8, fontSize: 16, gridColumn: "span 2" }}
          />
          <input
            required
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={{ padding: 8, fontSize: 16 }}
            disabled={!!editingId}
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            style={{ padding: 8, fontSize: 16 }}
            required
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="qualification"
            placeholder="Qualification"
            value={form.qualification}
            onChange={handleChange}
            style={{ padding: 8, fontSize: 16 }}
          />
          <input
            type="text"
            name="specialization"
            placeholder="Specialization"
            value={form.specialization}
            onChange={handleChange}
            style={{ padding: 8, fontSize: 16 }}
          />
          <input
            type="number"
            name="salary"
            placeholder="Salary"
            value={form.salary}
            onChange={handleChange}
            style={{ padding: 8, fontSize: 16 }}
            min={0}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              gridColumn: "span 2",
              backgroundColor: "#88C244",
              color: "white",
              padding: 12,
              fontSize: 18,
              border: "none",
              cursor: "pointer",
              borderRadius: 5,
            }}
          >
            {editingId
              ? loading
                ? "Updating..."
                : "Update Employee"
              : loading
              ? "Adding..."
              : "Add Employee"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                resetForm();
                setFormOpen(false);
              }}
              disabled={loading}
              style={{
                gridColumn: "span 2",
                backgroundColor: "#3C51A1",
                color: "white",
                padding: 12,
                fontSize: 18,
                border: "none",
                cursor: "pointer",
                borderRadius: 5,
                marginTop: 5,
              }}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* Employees Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 16,
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#3C51A1", color: "white" }}>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Name</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Email</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Role</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>
              Qualification
            </th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>
              Specialization
            </th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Salary</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ padding: 20, textAlign: "center" }}>
                No employees found
              </td>
            </tr>
          ) : (
            employees.map((emp) => (
              <tr key={emp.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: 10 }}>{emp.name}</td>
                <td style={{ padding: 10 }}>{emp.email}</td>
                <td style={{ padding: 10 }}>{emp.role}</td>
                <td style={{ padding: 10 }}>{emp.qualification}</td>
                <td style={{ padding: 10 }}>{emp.specialization}</td>
                <td style={{ padding: 10 }}>{emp.salary}</td>
                <td style={{ padding: 10, textAlign: "center" }}>
                  <button
                    onClick={() => startEdit(emp)}
                    title="Edit"
                    style={{
                      marginRight: 8,
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                    aria-label="Edit"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => deleteEmployee(emp.id)}
                    title="Delete"
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                    aria-label="Delete"
                  >
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          onClick={() => setShowSuccessModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
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
            <p>Employee record saved successfully.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
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

export default AddEmployee;
