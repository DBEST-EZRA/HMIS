import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Laboratory from "../Pages/Laboratory";
import Clinician from "../Pages/Clinician";
import Reception from "../Pages/Reception";
import Admin from "../Pages/Admin";
import Pharmacy from "../Pages/Pharmacy";
import Xray from "../Pages/Xray";
import Accounts from "../Pages/Accounts";
import Emergency from "../Pages/Emergency";
import logo from "../assets/logo.jpg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  if (isLoggedIn && role === "lab") return <Laboratory />;
  if (isLoggedIn && role === "clinician") return <Clinician />;
  if (isLoggedIn && role === "pharmacy") return <Pharmacy />;
  if (isLoggedIn && role === "reception") return <Reception />;
  if (isLoggedIn && role === "admin") return <Admin />;
  if (isLoggedIn && role === "xray") return <Xray />;
  if (isLoggedIn && role === "accounts") return <Accounts />;
  if (isLoggedIn && role === "emergency") return <Emergency />;

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100 w-100"
      style={{ backgroundColor: "#f4f7fb", minHeight: "100vh" }}
    >
      <div
        className="card shadow p-4"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="Minto Medical Center"
            style={{ width: "80px", marginBottom: "10px" }}
          />
          <h4 style={{ color: "#3C51A1" }}>Minto Medical Center</h4>
          <p className="text-muted" style={{ fontSize: "14px" }}>
            Secure HMIS Access
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="role" className="form-label">
              Select Role
            </label>
            <select
              className="form-select"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">-- Choose Role --</option>
              <option value="lab">Lab</option>
              <option value="clinician">Clinician</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="reception">Reception</option>
              <option value="admin">Admin</option>
              <option value="xray">Physiotherapy</option>
              <option value="accounts">Accounts</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn w-100"
            style={{ backgroundColor: "#3C51A1", color: "#fff" }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
