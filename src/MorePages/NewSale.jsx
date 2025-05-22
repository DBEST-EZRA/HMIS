import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../Configuration/Config";
import { FaSearch, FaPlus, FaEdit } from "react-icons/fa";

const NewSale = () => {
  const [sales, setSales] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const paymentOptions = ["Cash", "Mpesa", "SHA", "Multiple"];

  useEffect(() => {
    fetchInventory();
    fetchSales();
  }, []);

  const fetchInventory = async () => {
    const snapshot = await getDocs(collection(db, "pharmacyinventory"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setInventory(data);
  };

  const fetchSales = async () => {
    const snapshot = await getDocs(collection(db, "sales"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setSales(data);
  };

  const openModal = (item = null) => {
    setModalMode(item ? "edit" : "add");
    setForm(item ? { ...item } : {});
    setEditingId(item?.id || null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setForm({});
    setEditingId(null);
    setModalOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "quantity" && prev.price) {
        updated.total = parseFloat(value) * parseFloat(prev.price);
      }
      return updated;
    });
  };

  const handleMedicineSelect = async (e) => {
    const selectedId = e.target.value;
    const med = inventory.find((item) => item.id === selectedId);
    if (!med || parseInt(med.quantity) <= 0) {
      setErrorMessage("This medicine is out of stock");
      return;
    }
    setForm({
      ...med,
      medicineId: selectedId,
      quantity: "",
      total: "",
      paymentMethod: "Cash",
      description: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { medicineId, quantity, ...saleData } = form;
      const qty = parseInt(quantity);

      const medRef = doc(db, "pharmacyinventory", medicineId);
      const medSnap = await getDoc(medRef);
      if (!medSnap.exists()) throw new Error("Medicine not found");

      const currentQty = parseInt(medSnap.data().quantity);
      if (qty > currentQty) {
        setErrorMessage("Insufficient stock");
        return;
      }

      const saleEntry = {
        ...saleData,
        quantity: qty,
        total: qty * parseFloat(saleData.price),
        createdAt: new Date().toISOString(),
      };

      if (modalMode === "add") {
        await addDoc(collection(db, "sales"), saleEntry);
        await updateDoc(medRef, { quantity: currentQty - qty });
        setSuccessMessage("Sale recorded successfully");
      } else if (modalMode === "edit" && editingId) {
        await updateDoc(doc(db, "sales", editingId), saleEntry);
        setSuccessMessage("Sale updated successfully");
      }

      fetchSales();
      fetchInventory();
      closeModal();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const filteredSales = sales.filter(
    (s) => s.createdAt && s.createdAt.startsWith(filterDate)
  );

  return (
    <div className="p-4" style={{ minHeight: "100vh" }}>
      <h4 style={{ color: "#3C51A1" }}>Pharmacy Sales</h4>

      <div className="d-flex justify-content-between align-items-center my-3">
        <input
          type="search"
          placeholder="Search by drug or prescribed for..."
          className="form-control w-50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="d-flex align-items-center gap-2">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="form-control"
          />
          <button
            onClick={() => openModal()}
            className="btn"
            style={{ backgroundColor: "#88C244", color: "white" }}
          >
            <FaPlus className="me-1" /> Record Sale
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead style={{ backgroundColor: "#3C51A1", color: "white" }}>
            <tr>
              <th>Medicine</th>
              <th>Prescribed For</th>
              <th>Dosage</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Expiry</th>
              <th>Price</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((s, idx) => (
              <tr key={idx}>
                <td>{s.medicineName}</td>
                <td>{s.prescribedFor}</td>
                <td>{s.dosage}</td>
                <td>{s.quantity}</td>
                <td>{s.unit}</td>
                <td>{s.expiry}</td>
                <td>{s.price}</td>
                <td>{s.total}</td>
                <td>{s.paymentMethod}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => openModal(s)}
                  >
                    <FaEdit />
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
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ backgroundColor: "#3C51A1", color: "#fff" }}
              >
                <h5 className="modal-title">
                  {modalMode === "add" ? "New Sale" : "Edit Sale"}
                </h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {modalMode === "add" && (
                    <div className="mb-3">
                      <label className="form-label">Select Medicine</label>
                      <select
                        className="form-select"
                        onChange={handleMedicineSelect}
                        required
                      >
                        <option value="">-- Select --</option>
                        {inventory.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.medicineName} - Qty: {item.quantity}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {form.medicineName && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Quantity</label>
                        <input
                          type="number"
                          name="quantity"
                          className="form-control"
                          value={form.quantity || ""}
                          onChange={handleFormChange}
                          min="1"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Payment Method</label>
                        <select
                          name="paymentMethod"
                          className="form-select"
                          value={form.paymentMethod || "Cash"}
                          onChange={handleFormChange}
                        >
                          {paymentOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                      {form.paymentMethod === "Multiple" && (
                        <div className="mb-3">
                          <label className="form-label">Description</label>
                          <textarea
                            name="description"
                            className="form-control"
                            value={form.description || ""}
                            onChange={handleFormChange}
                          />
                        </div>
                      )}
                    </>
                  )}
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
                    style={{ backgroundColor: "#88C244", color: "#fff" }}
                  >
                    Save Sale
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success mt-3" role="alert">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="alert alert-danger mt-3" role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default NewSale;
