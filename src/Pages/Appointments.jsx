import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../Configuration/Config";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [staffOptions, setStaffOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    idNumber: "",
    date: dateFilter,
    time: "",
    attendedBy: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAppointments();
    fetchStaff();
  }, []);

  const fetchAppointments = async () => {
    const snapshot = await getDocs(collection(db, "appointments"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setAppointments(data);
  };

  const fetchStaff = async () => {
    const roles = [
      "lab",
      "clinical officer",
      "doctor",
      "nurse",
      "dentist",
      "admin",
    ];
    const q = query(collection(db, "users"), where("role", "in", roles));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((doc) => doc.data().name);
    setStaffOptions(list);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (mode = "add", record = null) => {
    setModalMode(mode);
    if (record) {
      setForm(record);
      setEditingId(record.id);
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
        idNumber: "",
        date: dateFilter,
        time: "",
        attendedBy: "",
      });
      setEditingId(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ref = collection(db, "appointments");
    try {
      if (modalMode === "add") {
        await addDoc(ref, form);
      } else {
        await updateDoc(doc(db, "appointments", editingId), form);
      }
      fetchAppointments();
      closeModal();
    } catch (error) {
      alert("Error saving appointment: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await deleteDoc(doc(db, "appointments", id));
      fetchAppointments();
    } catch (error) {
      alert("Error deleting appointment: " + error.message);
    }
  };

  const filteredAppointments = appointments.filter(
    (item) =>
      item.date === dateFilter &&
      (item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.idNumber?.includes(searchTerm))
  );

  return (
    <div
      style={{ minHeight: "100vh", padding: 20, backgroundColor: "#f5f5f5" }}
    >
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <div className="d-flex gap-2">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="form-control"
          />
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              placeholder="Search by name or ID"
            />
          </div>
        </div>

        <button
          className="btn"
          style={{ backgroundColor: "#88C244", color: "#000" }}
          onClick={() => openModal("add")}
        >
          + New Appointment
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead style={{ backgroundColor: "#3C51A1", color: "white" }}>
            <tr style={{ backgroundColor: "#3C51A1", color: "white" }}>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>ID Number</th>
              <th>Date</th>
              <th>Time</th>
              <th>Attended By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  No records found
                </td>
              </tr>
            ) : (
              filteredAppointments.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>{item.idNumber}</td>
                  <td>{item.date}</td>
                  <td>{item.time}</td>
                  <td>{item.attendedBy}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => openModal("edit", item)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(item.id)}
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
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ backgroundColor: "#3C51A1", color: "white" }}
              >
                <h5 className="modal-title">
                  {modalMode === "add" ? "Add Appointment" : "Edit Appointment"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {[
                    { label: "Name", name: "name" },
                    { label: "Email", name: "email" },
                    { label: "Phone", name: "phone" },
                    { label: "ID Number", name: "idNumber" },
                    { label: "Date", name: "date", type: "date" },
                    { label: "Time", name: "time", type: "time" },
                  ].map(({ label, name, type = "text" }) => (
                    <div className="mb-3" key={name}>
                      <label className="form-label">{label}</label>
                      <input
                        type={type}
                        className="form-control"
                        name={name}
                        value={form[name] || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  ))}

                  <div className="mb-3">
                    <label className="form-label">Attended By</label>
                    <select
                      className="form-select"
                      name="attendedBy"
                      value={form.attendedBy}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select Staff --</option>
                      {staffOptions.map((staff, idx) => (
                        <option key={idx} value={staff}>
                          {staff}
                        </option>
                      ))}
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
                    style={{ backgroundColor: "#88C244" }}
                  >
                    {modalMode === "add" ? "Add" : "Update"}
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

export default Appointments;
