import React, { useState, useEffect } from "react";
import "./LoginModal.css";
import { apiService } from "../services/api";

const RegisterModal = ({ onClose, onRegisterSuccess, onSwitchToLogin }) => {
  const [rocketY, setRocketY] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  // Simple rocket animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRocketY((prev) => {
        if (prev >= 15) return -15;
        return prev + 0.5;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    // Clear previous errors
    setError("");

    // Validate form
    if (!authForm.name || !authForm.email || !authForm.password || !authForm.password_confirmation) {
      setError("Please fill in all required fields");
      return;
    }

    if (authForm.password !== authForm.password_confirmation) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // Real API call for registration
      const response = await apiService.register({
        name: authForm.name,
        email: authForm.email,
        password: authForm.password,
        password_confirmation: authForm.password,
      });

      if (response.success && response.token) {
        onRegisterSuccess(response.user, response.token);
      } else if (response.errors) {
        // Handle validation errors
        const errorMessages = Object.values(response.errors).flat().join(', ');
        setError(errorMessages);
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="simple-login-overlay" onClick={onClose}>
      <div
        className="simple-login-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MOVING ROCKET ABOVE */}
        <div className="simple-rocket-container">
          <div
            className="simple-rocket"
            style={{ transform: `translateY(${rocketY}px)` }}
          >
            🚀
          </div>
        </div>

        {/* SIMPLE TITLE ONLY */}
        <div className="simple-login-header">
          <h1>CREATE ACCOUNT</h1>
        </div>

        {error && (
            <div style={{
              backgroundColor: '#ff4444',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '15px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
        )}

        {/* SIMPLE FORM */}
        <div className="simple-login-form">
          <div className="simple-form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={authForm.name}
              onChange={(e) => {
                setAuthForm({ ...authForm, name: e.target.value });
                setError("");
              }}
              placeholder="Enter your name"
              disabled={isLoading}
              required
            />
          </div>

          <div className="simple-form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={authForm.email}
              onChange={(e) => {
                setAuthForm({ ...authForm, email: e.target.value });
                setError("");
              }}
              placeholder="Enter your email"
              disabled={isLoading}
              required
            />
          </div>

          <div className="simple-form-group">
            <label>Password</label>
            <input
              type="password"
              value={authForm.password}
              onChange={(e) => {
                setAuthForm({ ...authForm, password: e.target.value });
                setError("");
              }}
              placeholder="Enter your password"
              disabled={isLoading}
              required
            />
          </div>

          <div className="simple-form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={authForm.password_confirmation}
              onChange={(e) => {
                setAuthForm({ ...authForm, password_confirmation: e.target.value });
                setError("");
              }}
              placeholder="Confirm your password"
              disabled={isLoading}
              required
            />
          </div>

          <button
            onClick={handleSubmit}
            className="simple-login-btn"
            disabled={isLoading}
          >
            {isLoading ? "CREATING ACCOUNT..." : "SIGN UP"}
          </button>
        </div>

        {/* Toggle to Login */}
        <div className="simple-create-account">
          <button
            onClick={onSwitchToLogin}
            className="simple-create-btn"
            disabled={isLoading}
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
