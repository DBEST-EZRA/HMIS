import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/logo.jpg";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../Configuration/Config";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

// Pages
import Laboratory from "../Pages/Laboratory";
import Clinician from "../Pages/Clinician";
import Reception from "../Pages/Reception";
import Admin from "../Pages/Admin";
import Pharmacy from "../Pages/Pharmacy";
import Xray from "../Pages/Xray";
import Accounts from "../Pages/Accounts";
import Emergency from "../Pages/Emergency";
import Nurse from "../Pages/Nurse";
import Doctor from "../Pages/Doctor";

const Login = () => {
  const [username, setUsername] = useState(""); // Email
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );
      const user = userCredential.user;

      // Query Firestore for user document with matching email field
      const q = query(
        collection(db, "users"),
        where("email", "==", user.email)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setRole(userData.role);
        setIsLoggedIn(true);
      } else {
        throw new Error("User role not found.");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      setErrorModal(true);
    }
  };

  const handlePasswordReset = async () => {
    if (!username) {
      alert("Please enter your email address to reset password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, username);
      alert("Password reset email sent.");
    } catch (error) {
      alert("Failed to send password reset email.");
    }
  };

  // Redirect based on role
  useEffect(() => {
    if (isLoggedIn && role) {
      switch (role) {
        case "clinical officer":
          navigate("/clinician");
          break;
        case "receptionist":
          navigate("/reception");
          break;
        case "admin":
          navigate("/admin");
          break;
        //to be handled
        case "lab":
          navigate("/lab");
          break;
        case "pharmacy":
          navigate("/pharmacy");
          break;

        case "xray":
          navigate("/xray");
          break;
        case "accounts":
          navigate("/accounts");
          break;
        case "emergency":
          navigate("/emergency");
          break;
        case "nurse":
          navigate("/nurse");
          break;
        case "doctor":
          navigate("/doctor");
          break;
        default:
          console.error("Unknown role:", role);
          break;
      }
    }
  }, [isLoggedIn, role, navigate]);

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
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="mb-2">
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
              required
            />
          </div>

          <div className="mb-3 text-end">
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={handlePasswordReset}
              style={{ fontSize: "14px", color: "#88c244" }}
            >
              Forgot Password?
            </button>
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

      {/* Fail Modal */}
      {errorModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">Login Failed</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setErrorModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Incorrect email or password, or role not found.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn"
                  style={{ backgroundColor: "#88c244", color: "#fff" }}
                  onClick={() => setErrorModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
