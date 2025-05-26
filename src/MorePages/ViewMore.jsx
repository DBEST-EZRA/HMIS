import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../Configuration/Config";
import {
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  Container,
} from "react-bootstrap";

const ViewMore = () => {
  const { id } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalInfo, setModalInfo] = useState({
    show: false,
    section: "",
    isEditing: false,
    currentRecord: null,
  });
  const [formData, setFormData] = useState({ date: "", value: "" });

  useEffect(() => {
    const fetchPatientData = async () => {
      const docRef = doc(db, "ward", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPatientData({
          ...data,
          dailyNotes: data.dailyNotes || [],
          observations: data.observations || [],
          labRequests: data.labRequests || [],
          medication: data.medication || [],
          additionalCharges: data.additionalCharges || [],
        });
      }
      setLoading(false);
    };

    fetchPatientData();
  }, [id]);

  const openModal = (section, record = null) => {
    setModalInfo({
      show: true,
      section,
      isEditing: !!record,
      currentRecord: record,
    });

    setFormData({
      date: record?.date || "",
      value:
        record?.note ||
        record?.observation ||
        record?.request ||
        record?.medication ||
        record?.charge ||
        record?.amount ||
        "",
    });
  };

  const closeModal = () => {
    setModalInfo({
      show: false,
      section: "",
      isEditing: false,
      currentRecord: null,
    });
    setFormData({ date: "", value: "" });
  };

  const handleSave = async () => {
    const { section, isEditing, currentRecord } = modalInfo;
    const fieldMap = {
      dailyNotes: "note",
      observations: "observation",
      labRequests: "request",
      medication: "medication",
      additionalCharges: "charge",
    };

    const data = {
      date: formData.date,
      [fieldMap[section]]: formData.value,
    };

    if (section === "additionalCharges") {
      data.amount = formData.value;
    }

    const docRef = doc(db, "ward", id);

    if (isEditing) {
      await updateDoc(docRef, {
        [section]: arrayRemove(currentRecord),
      });
    }

    await updateDoc(docRef, {
      [section]: arrayUnion(data),
    });

    setPatientData((prev) => {
      const updated = isEditing
        ? prev[section].map((item) => (item === currentRecord ? data : item))
        : [...prev[section], data];
      return { ...prev, [section]: updated };
    });

    closeModal();
  };

  const handleDelete = async (section, record) => {
    const docRef = doc(db, "ward", id);
    await updateDoc(docRef, {
      [section]: arrayRemove(record),
    });

    setPatientData((prev) => ({
      ...prev,
      [section]: prev[section].filter((i) => i !== record),
    }));
  };

  const mergeByDate = () => {
    const map = {};

    const process = (section, key, isCharge = false) => {
      patientData[section].forEach((item) => {
        const date = item.date;
        if (!map[date]) map[date] = { date };
        if (isCharge) {
          map[date][key] = item.charge + " (KES " + item.amount + ")";
        } else {
          map[date][key] = item[key];
        }
        map[date][`${key}Record`] = item;
        map[date][`${key}Section`] = section;
      });
    };

    process("dailyNotes", "note");
    process("observations", "observation");
    process("labRequests", "request");
    process("medication", "medication");
    process("additionalCharges", "charge", true);

    return Object.values(map).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!patientData) {
    return <div>No patient data found.</div>;
  }

  const {
    patientName,
    inpatientNumber,
    charges = "0",
    additionalCharges,
  } = patientData;

  const baseCharges = parseInt(charges);
  const additionalTotal = additionalCharges.reduce(
    (sum, item) => sum + (parseInt(item.amount) || 0),
    0
  );
  const totalCharges = baseCharges + additionalTotal;

  const mergedRows = mergeByDate();

  return (
    <Container className="py-4">
      <h2 style={{ color: "#3C51A1" }}>Patient Details</h2>
      <p>
        <strong>Patient Name:</strong> {patientName}
      </p>
      <p>
        <strong>Inpatient Number:</strong> {inpatientNumber}
      </p>
      <p>
        <strong>Base Charges:</strong> KES {baseCharges}
      </p>
      <p style={{ color: "#88c244", fontWeight: "bold" }}>
        Total Charges: KES {totalCharges}
      </p>

      <div className="mb-3 d-flex gap-2 flex-wrap">
        {[
          "dailyNotes",
          "observations",
          "labRequests",
          "medication",
          "additionalCharges",
        ].map((section) => (
          <Button
            key={section}
            style={{ backgroundColor: "#88c244", border: "none" }}
            onClick={() => openModal(section)}
          >
            + Add {section}
          </Button>
        ))}
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr style={{ backgroundColor: "#3C51A1", color: "#fff" }}>
            <th>Date</th>
            <th>Daily Notes</th>
            <th>Observations</th>
            <th>Lab Requests</th>
            <th>Medication</th>
            <th>Additional Charges</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mergedRows.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center text-muted">
                No records available
              </td>
            </tr>
          ) : (
            mergedRows.map((row, idx) => (
              <tr key={idx}>
                <td>{row.date}</td>
                <td>{row.note || ""}</td>
                <td>{row.observation || ""}</td>
                <td>{row.request || ""}</td>
                <td>{row.medication || ""}</td>
                <td>{row.charge || ""}</td>
                <td>
                  {[
                    "note",
                    "observation",
                    "request",
                    "medication",
                    "charge",
                  ].map((key) =>
                    row[key] ? (
                      <div key={key} className="mb-1">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          className="me-1"
                          onClick={() =>
                            openModal(row[`${key}Section`], row[`${key}Record`])
                          }
                        >
                          Edit {key}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() =>
                            handleDelete(
                              row[`${key}Section`],
                              row[`${key}Record`]
                            )
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    ) : null
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={modalInfo.show} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#3C51A1" }}>
            {modalInfo.isEditing ? "Edit" : "Add"} {modalInfo.section}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>
                {modalInfo.section === "additionalCharges"
                  ? "Amount"
                  : "Description"}
              </Form.Label>
              <Form.Control
                type={
                  modalInfo.section === "additionalCharges" ? "number" : "text"
                }
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ backgroundColor: "#3C51A1", border: "none" }}
            onClick={handleSave}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ViewMore;
