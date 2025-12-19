import React, { useState, useEffect } from "react";
import "./LoginModal.css";
import { apiService } from "../services/api";

const LoginModal = ({ onClose, onLoginSuccess, onSwitchToRegister }) => {
  const [rocketY, setRocketY] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
  });

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
    setError("");

    if (!authForm.email || !authForm.password) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiService.login({
        email: authForm.email,
        password: authForm.password,
      });

      if (response.success && response.token) {
        localStorage.setItem("auth_token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        onLoginSuccess(response.user);
      } else {
        setError(
          response.message ||
            "Invalid credentials. Please check your email and password."
        );
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setError(error.message || "Authentication failed. Please try again.");
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
        <div className="simple-rocket-container">
          <div
            className="simple-rocket"
            style={{ transform: `translateY(${rocketY}px)` }}
          >
            🚀
          </div>
        </div>

        <div className="simple-login-header">
          <h1>WELCOME BACK</h1>
        </div>

        <div className="simple-login-form">
          {error && (
            <div
              style={{
                backgroundColor: "#ff4444",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
                marginBottom: "15px",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

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

          <div className="simple-remember-forgot">
            <div className="simple-remember">
              <input type="checkbox" id="remember" disabled={isLoading} />
              <label htmlFor="remember">Remember me</label>
            </div>
            <button
              type="button"
              onClick={() => alert("Password reset coming soon!")}
              className="simple-forgot"
              disabled={isLoading}
            >
              Forgot Password?
            </button>
          </div>

          <button
            onClick={handleSubmit}
            className="simple-login-btn"
            disabled={isLoading}
          >
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </div>

        <div className="simple-create-account">
          <button
            onClick={onSwitchToRegister}
            className="simple-create-btn"
            disabled={isLoading}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
