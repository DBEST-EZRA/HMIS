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
import { FaEdit, FaTrash } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WardRecords = () => {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    patient: "",
    reason: "",
    admissionDate: "",
    dischargeDate: "",
    charges: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const colRef = collection(db, "ward");
    const snapshot = await getDocs(colRef);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setRecords(data);
  };

  const openModal = (record = null) => {
    if (record) {
      setForm(record);
      setEditingId(record.id);
    } else {
      setForm({
        patient: "",
        reason: "",
        admissionDate: "",
        dischargeDate: "",
        charges: "",
      });
      setEditingId(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateDoc(doc(db, "ward", editingId), form);
    } else {
      await addDoc(collection(db, "ward"), form);
    }
    fetchRecords();
    closeModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this record?")) {
      await deleteDoc(doc(db, "ward", id));
      fetchRecords();
    }
  };

  const filteredRecords = filterDate
    ? records.filter((r) => r.admissionDate === filterDate)
    : records;

  const chartData = {
    labels: filteredRecords.map((r) => r.patient),
    datasets: [
      {
        label: "Ward Charges",
        data: filteredRecords.map((r) => parseFloat(r.charges)),
        backgroundColor: "#88C244",
      },
    ],
  };

  return (
    <div
      style={{ padding: 20, backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: "#3C51A1" }}>Ward Records</h2>
        <button
          onClick={() => openModal()}
          style={{
            backgroundColor: "#88C244",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: 5,
          }}
        >
          + Add Record
        </button>
      </div>

      <div className="mb-3">
        <label style={{ color: "#3C51A1", fontWeight: "bold" }}>
          Filter by Admission Date:
        </label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="form-control"
          style={{ maxWidth: 250, marginTop: 5 }}
        />
      </div>

      <div className="mb-4">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: true, text: "Ward Charges per Patient" },
            },
          }}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead style={{ backgroundColor: "#3C51A1", color: "white" }}>
            <tr>
              <th>Patient </th>
              <th>Reason</th>
              <th>Admission Date</th>
              <th>Discharge Date</th>
              <th>Charges</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((rec) => (
              <tr key={rec.id}>
                <td>{rec.patientName}</td>
                <td>{rec.reason}</td>
                <td>{rec.admissionDate}</td>
                <td>{rec.dischargeDate}</td>
                <td>{rec.charges}</td>
                <td>
                  <button
                    onClick={() => openModal(rec)}
                    className="btn btn-sm text-primary"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(rec.id)}
                    className="btn btn-sm text-danger"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={closeModal}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ backgroundColor: "#3C51A1", color: "white" }}
              >
                <h5 className="modal-title">
                  {editingId ? "Edit Record" : "Add Record"}
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
                    <label>Patient</label>
                    <input
                      className="form-control"
                      name="patientName"
                      value={form.patientName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Reason</label>
                    <input
                      className="form-control"
                      name="reason"
                      value={form.reason}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Admission Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="admissionDate"
                      value={form.admissionDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Discharge Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="dischargeDate"
                      value={form.dischargeDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Ward Charges</label>
                    <input
                      type="number"
                      className="form-control"
                      name="charges"
                      value={form.charges}
                      onChange={handleChange}
                      required
                    />
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
                  <button type="submit" className="btn btn-success">
                    {editingId ? "Update" : "Add"}
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

export default WardRecords;
