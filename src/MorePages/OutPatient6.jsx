import React, { useEffect, useState } from "react";
import { db } from "../Configuration/Config";
import { collection, getDocs, query, updateDoc, doc } from "firebase/firestore";
import { FaEdit } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const OutPatient6 = () => {
  const [patients, setPatients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formFields, setFormFields] = useState({
    pharmacyCharges: "",
    labCharges: "",
    fee: "200",
    charges: "500",
    paymentMethod: "",
    accountDescription: "",
    paymentStatus: "unpaid",
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const filteredList = patients.filter(
      (p) =>
        (p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.idNumber?.includes(searchTerm)) &&
        (p.createdAt?.startsWith(dateFilter) || false)
    );
    setFiltered(filteredList);
  }, [searchTerm, dateFilter, patients]);

  const fetchPatients = async () => {
    const q = query(collection(db, "patients"));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPatients(list);
  };

  const openModal = (patient) => {
    setSelectedPatient(patient);
    setFormFields({
      pharmacyCharges: patient.pharmacyCharges || "",
      labCharges: patient.labCharges || "",
      fee: patient.fee || "200",
      charges: patient.charges || "500",
      paymentMethod: patient.paymentMethod || "",
      accountDescription: patient.accountDescription || "",
      paymentStatus: patient.paymentStatus || "unpaid",
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const parseNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  const total =
    parseNumber(formFields.pharmacyCharges) +
    parseNumber(formFields.labCharges) +
    parseNumber(formFields.fee) +
    parseNumber(formFields.charges);

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

  const exportToExcel = () => {
    if (filtered.length === 0) {
      alert("No data to export");
      return;
    }

    // Map data to export format
    const dataToExport = filtered.map((p) => {
      const pPharmacyCharges = parseNumber(p.pharmacyCharges);
      const pLabCharges = parseNumber(p.labCharges);
      const pFee = parseNumber(p.fee || "200");
      const pCharges = parseNumber(p.charges || "500");
      const pTotal = pPharmacyCharges + pLabCharges + pFee + pCharges;

      return {
        "Full Name": p.fullName || "",
        "ID Number": p.idNumber || "",
        Phone: p.phone || "",
        "Pharmacy Charges": p.pharmacyCharges || "",
        "Lab Charges": p.labCharges || "",
        "Consultation Fee": p.fee || "200",
        "Clinical Charges": p.charges || "500",
        Total: pTotal,
        "Payment Method": p.paymentMethod || "",
        "Payment Status": p.paymentStatus || "",
        "Account Description": p.accountDescription || "",
      };
    });

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");

    // Generate buffer
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });

    // Save file
    saveAs(
      blob,
      `patients_export_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

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

        <div className="input-group" style={{ maxWidth: 300 }}>
          <input
            type="search"
            className="form-control"
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="btn btn-success" onClick={exportToExcel}>
          Export to Excel
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead style={{ backgroundColor: "#3C51A1", color: "white" }}>
            <tr>
              <th>Full Name</th>
              <th>ID Number</th>
              <th>Phone</th>
              <th>Pharmacy Charges</th>
              <th>Lab Charges</th>
              <th>Consultation Fee</th>
              <th>Clinical Charges</th>
              <th>Total</th>
              <th>Payment Method</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center text-muted">
                  No records found.
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const pPharmacyCharges = parseNumber(p.pharmacyCharges);
                const pLabCharges = parseNumber(p.labCharges);
                const pFee = parseNumber(p.fee || "200");
                const pCharges = parseNumber(p.charges || "500");
                const pTotal = pPharmacyCharges + pLabCharges + pFee + pCharges;

                return (
                  <tr key={p.id}>
                    <td>{p.fullName || "-"}</td>
                    <td>{p.idNumber || "-"}</td>
                    <td>{p.phone || "-"}</td>
                    <td>{p.pharmacyCharges || "-"}</td>
                    <td>{p.labCharges || "-"}</td>
                    <td>{p.fee || "200"}</td>
                    <td>{p.charges || "500"}</td>
                    <td style={{ fontWeight: "bold" }}>{pTotal}</td>
                    <td>{p.paymentMethod || "-"}</td>
                    <td>{p.paymentStatus || "unpaid"}</td>
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
                );
              })
            )}
          </tbody>
        </table>
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
                  {
                    label: "Pharmacy Charges",
                    name: "pharmacyCharges",
                    type: "text",
                  },
                  { label: "Lab Charges", name: "labCharges", type: "text" },
                  {
                    label: "Consultation Fee",
                    name: "fee",
                    type: "text",
                    disabled: true,
                  },
                  { label: "Clinical Charges", name: "charges", type: "text" },
                ].map(({ label, name, type, disabled }) => (
                  <div className="mb-3" key={name}>
                    <label className="form-label">{label}</label>
                    <input
                      type={type}
                      name={name}
                      className="form-control"
                      value={formFields[name]}
                      onChange={handleChange}
                      disabled={disabled}
                    />
                  </div>
                ))}

                <div className="mb-3">
                  <label className="form-label">Total</label>
                  <input
                    type="text"
                    className="form-control"
                    value={total}
                    readOnly
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Payment Method</label>
                  <select
                    name="paymentMethod"
                    className="form-select"
                    value={formFields.paymentMethod}
                    onChange={handleChange}
                  >
                    <option value="">Select...</option>
                    <option value="cash">Cash</option>
                    <option value="mpesa">MPESA</option>
                    <option value="sha">SHA</option>
                    <option value="multiple">Multiple</option>
                  </select>
                </div>

                {formFields.paymentMethod === "multiple" && (
                  <div className="mb-3">
                    <label className="form-label">Account Description</label>
                    <textarea
                      name="accountDescription"
                      className="form-control"
                      value={formFields.accountDescription}
                      onChange={handleChange}
                      placeholder="E.g. 2000 mpesa, 1000 cash"
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Payment Status</label>
                  <select
                    name="paymentStatus"
                    className="form-select"
                    value={formFields.paymentStatus}
                    onChange={handleChange}
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                  </select>
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

export default OutPatient6;
