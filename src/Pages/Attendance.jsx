import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../Configuration/Config";
import { FaEdit, FaSearch, FaCalendarAlt } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Attendance = () => {
  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", checkIn: "", checkOut: "" });
  const [editingId, setEditingId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchAttendanceByDate();
  }, [selectedDate]);

  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const names = snapshot.docs.map((doc) => doc.data().name);
    setUsers(names);
  };

  const fetchAttendanceByDate = async () => {
    const targetDate = new Date(selectedDate);
    targetDate.setHours(0, 0, 0, 0);
    const dayStart = Timestamp.fromDate(targetDate);
    const dayEnd = Timestamp.fromDate(
      new Date(targetDate.getTime() + 86400000 - 1)
    );

    const q = query(
      collection(db, "attendance"),
      where("timestamp", ">=", dayStart),
      where("timestamp", "<=", dayEnd)
    );

    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setAttendance(list);
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const openModal = () => {
    setForm({ name: "", checkIn: "", checkOut: "" });
    setEditingId(null);
    setModalOpen(true);
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setForm({
      name: entry.name,
      checkIn: entry.checkIn,
      checkOut: entry.checkOut || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: form.name,
      checkIn: form.checkIn,
      checkOut: form.checkOut || "",
      timestamp: Timestamp.fromDate(new Date(selectedDate)),
    };

    if (editingId) {
      await updateDoc(doc(db, "attendance", editingId), data);
    } else {
      await addDoc(collection(db, "attendance"), data);
    }

    setModalOpen(false);
    fetchAttendanceByDate();
  };

  const chartData = {
    labels: users,
    datasets: [
      {
        label: "Attendance",
        data: users.map(
          (name) =>
            attendance.filter((a) => a.name === name && a.checkIn).length
        ),
        backgroundColor: "#88C244",
      },
    ],
  };

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Arial",
        background: "#f4f6f8",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h2 style={{ color: "#3C51A1" }}>
          <FaCalendarAlt style={{ marginRight: 8 }} /> Attendance for{" "}
          {new Date(selectedDate).toDateString()}
        </h2>
        <button
          onClick={openModal}
          style={{
            backgroundColor: "#88C244",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 5,
            border: "none",
            fontSize: 16,
          }}
        >
          Record Attendance
        </button>
      </div>

      {/* Date Filter */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontWeight: "bold", marginRight: 10 }}>
          Filter by Date:
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            padding: 10,
            fontSize: 16,
            borderRadius: 5,
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", background: "white", borderRadius: 8 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#88C244", color: "#fff" }}>
            <tr>
              <th style={{ padding: 12, border: "1px solid #ddd" }}>Name</th>
              <th style={{ padding: 12, border: "1px solid #ddd" }}>
                Check In
              </th>
              <th style={{ padding: 12, border: "1px solid #ddd" }}>
                Check Out
              </th>
              <th style={{ padding: 12, border: "1px solid #ddd" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: 20, textAlign: "center" }}>
                  No records for this day.
                </td>
              </tr>
            ) : (
              attendance.map((a) => (
                <tr key={a.id}>
                  <td style={{ padding: 12 }}>{a.name}</td>
                  <td style={{ padding: 12 }}>{a.checkIn}</td>
                  <td style={{ padding: 12 }}>{a.checkOut || "Pending"}</td>
                  <td style={{ padding: 12 }}>
                    <button
                      onClick={() => handleEdit(a)}
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "#3C51A1",
                        cursor: "pointer",
                      }}
                      title="Edit"
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

      {/* Chart */}
      <div style={{ marginTop: 40 }}>
        <h4 style={{ color: "#3C51A1", marginBottom: 10 }}>Attendance Chart</h4>
        <Bar data={chartData} />
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              padding: 30,
              borderRadius: 8,
              width: "100%",
              maxWidth: 400,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ color: "#3C51A1", marginBottom: 20 }}>
              {editingId ? "Edit Attendance" : "Record Attendance"}
            </h3>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 15 }}
            >
              <select
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                style={{
                  padding: 10,
                  fontSize: 16,
                  borderRadius: 5,
                  border: "1px solid #ccc",
                }}
              >
                <option value="">-- Select Name --</option>
                {users.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <input
                type="time"
                name="checkIn"
                value={form.checkIn}
                onChange={handleChange}
                required
                placeholder="Check In Time"
                style={{
                  padding: 10,
                  fontSize: 16,
                  borderRadius: 5,
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="time"
                name="checkOut"
                value={form.checkOut}
                onChange={handleChange}
                placeholder="Check Out Time"
                style={{
                  padding: 10,
                  fontSize: 16,
                  borderRadius: 5,
                  border: "1px solid #ccc",
                }}
              />
              <div
                style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
              >
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    backgroundColor: "#e53935",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: 5,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#88C244",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: 5,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {editingId ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
