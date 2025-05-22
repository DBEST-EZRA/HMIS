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

const PharmacyInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState({
    medicineName: "",
    batchNo: "",
    category: "",
    quantity: "",
    unit: "",
    expiry: "",
    dosage: "",
    price: "",
    reorderLevel: "",
    prescribedFor: "",
    barcode: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const colRef = collection(db, "pharmacyinventory");
    const snapshot = await getDocs(colRef);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setInventory(data);
  };

  const openModal = (record = null) => {
    if (record) {
      setForm(record);
      setEditingId(record.id);
    } else {
      setForm({
        medicineName: "",
        batchNo: "",
        category: "",
        quantity: "",
        unit: "",
        expiry: "",
        dosage: "",
        price: "",
        reorderLevel: "",
        prescribedFor: "",
        barcode: "",
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
      await updateDoc(doc(db, "pharmacyinventory", editingId), form);
    } else {
      await addDoc(collection(db, "pharmacyinventory"), form);
    }
    fetchInventory();
    closeModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this record?")) {
      await deleteDoc(doc(db, "pharmacyinventory", id));
      fetchInventory();
    }
  };

  return (
    <div
      style={{ padding: 20, backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: "#3C51A1" }}>Pharmacy Inventory</h2>
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
          + Add Medicine
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead style={{ backgroundColor: "#3C51A1", color: "white" }}>
            <tr>
              <th>Medicine Name</th>
              <th>Batch No</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Expiry</th>
              <th>Dosage</th>
              <th>Price</th>
              <th>Reorder Level</th>
              <th>Prescribed For</th>
              <th>Barcode</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id}>
                <td>{item.medicineName}</td>
                <td>{item.batchNo}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
                <td>{item.expiry}</td>
                <td>{item.dosage}</td>
                <td>{item.price}</td>
                <td>{item.reorderLevel}</td>
                <td>{item.prescribedFor}</td>
                <td>{item.barcode}</td>
                <td>
                  <button
                    onClick={() => openModal(item)}
                    className="btn btn-sm text-primary"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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
                  {editingId ? "Edit Medicine" : "Add Medicine"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {Object.keys(form).map((key) => (
                    <div className="mb-3" key={key}>
                      <label>
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </label>
                      <input
                        className="form-control"
                        name={key}
                        type={
                          key === "expiry"
                            ? "date"
                            : key === "price" ||
                              key === "reorderLevel" ||
                              key === "quantity"
                            ? "number"
                            : "text"
                        }
                        value={form[key]}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  ))}
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

export default PharmacyInventory;
