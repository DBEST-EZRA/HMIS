import React, { useEffect, useState } from "react";
import { db } from "../Configuration/Config";
import { collection, getDocs } from "firebase/firestore";
import { FaSearch } from "react-icons/fa";

const AllPatients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [filteredPatients, setFilteredPatients] = useState([]);

  const [loading, setLoading] = useState(false);

  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [searchTerm, filterDate, filterMonth, filterYear, patients]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters/search change
  }, [searchTerm, filterDate, filterMonth, filterYear]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "patients"));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPatients(list);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
    setLoading(false);
  };

  const filterPatients = () => {
    let filtered = patients.filter((p) => {
      const created = p.createdAt ? new Date(p.createdAt) : null;

      const matchSearch = Object.values(p)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchDate =
        filterDate === "all" ||
        (created && created.toISOString().split("T")[0] === filterDate);

      const matchMonth =
        filterMonth === "all" ||
        (created &&
          String(created.getMonth() + 1).padStart(2, "0") === filterMonth);

      const matchYear =
        filterYear === "all" ||
        (created && String(created.getFullYear()) === filterYear);

      return matchSearch && matchDate && matchMonth && matchYear;
    });

    setFilteredPatients(filtered);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredPatients.length / entriesPerPage);
  const displayedPatients = filteredPatients.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      if (direction === "prev" && prev > 1) return prev - 1;
      if (direction === "next" && prev < totalPages) return prev + 1;
      return prev;
    });
  };

  const uniqueYears = [
    ...new Set(
      patients
        .map((p) => (p.createdAt ? new Date(p.createdAt).getFullYear() : null))
        .filter(Boolean)
    ),
  ];

  return (
    <div
      style={{ padding: 20, backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <div
        style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}
      >
        <div style={{ position: "relative", maxWidth: 400, flexGrow: 1 }}>
          <input
            type="search"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 35px 10px 10px",
              fontSize: 16,
              borderRadius: 5,
              border: "1px solid #ccc",
            }}
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

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value || "all")}
          style={{
            padding: 10,
            fontSize: 16,
            borderRadius: 5,
            border: "1px solid #ccc",
          }}
        />

        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          style={{ padding: 10, fontSize: 16, borderRadius: 5 }}
        >
          <option value="all">All Months</option>
          {[...Array(12)].map((_, i) => {
            const month = String(i + 1).padStart(2, "0");
            return (
              <option key={month} value={month}>
                {month}
              </option>
            );
          })}
        </select>

        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          style={{ padding: 10, fontSize: 16, borderRadius: 5 }}
        >
          <option value="all">All Years</option>
          {uniqueYears.map((year) => (
            <option key={year}>{year}</option>
          ))}
        </select>

        <select
          value={entriesPerPage}
          onChange={(e) => setEntriesPerPage(Number(e.target.value))}
          style={{ padding: 10, fontSize: 16, borderRadius: 5 }}
        >
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#88C244", color: "white" }}>
              <th style={{ padding: 12, border: "1px solid #ddd" }}>
                Full Name
              </th>
              <th style={{ padding: 12, border: "1px solid #ddd" }}>
                ID Number
              </th>
              <th style={{ padding: 12, border: "1px solid #ddd" }}>Phone</th>
              <th style={{ padding: 12, border: "1px solid #ddd" }}>
                Assignee
              </th>
              <th style={{ padding: 12, border: "1px solid #ddd" }}>
                Created At
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
            ) : displayedPatients.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 20 }}>
                  No patients found.
                </td>
              </tr>
            ) : (
              displayedPatients.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: 12 }}>{p.fullName}</td>
                  <td style={{ padding: 12 }}>{p.idNumber}</td>
                  <td style={{ padding: 12 }}>{p.phone}</td>
                  <td style={{ padding: 12 }}>{p.assignee}</td>
                  <td style={{ padding: 12 }}>
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div
        style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div>
          Page {currentPage} of {totalPages || 1}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
            style={{
              padding: "8px 16px",
              backgroundColor: "#3C51A1",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages}
            style={{
              padding: "8px 16px",
              backgroundColor: "#3C51A1",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllPatients;
