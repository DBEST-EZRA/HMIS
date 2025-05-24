import React from "react";
import { useLocation } from "react-router-dom";

const ViewMore = () => {
  const location = useLocation();
  const { patientName, inpatientNumber } = location.state || {};

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: "#3C51A1" }}>Patient Details</h2>
      <p>
        <strong>Patient Name:</strong> {patientName}
      </p>
      <p>
        <strong>Inpatient Number:</strong> {inpatientNumber}
      </p>
      <hr />
      <p>
        🔍 Additional patient info (notes, labs, medication, charges...) will be
        shown here later.
      </p>
    </div>
  );
};

export default ViewMore;
