import React, { useState, useEffect } from "react";
import "./LoginModal.css";
import { apiService } from "../services/api";

const ForgotPasswordModal = ({ onClose, onBackToLogin }) => {
  const [rocketY, setRocketY] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: Code & New Password
  const [formData, setFormData] = useState({
    email: "",
    code: "",
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

  const handleSendCode = async () => {
    setError("");
    setSuccess("");

    if (!formData.email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiService.forgotPassword(formData.email);
      
      if (response.success) {
        setSuccess("Reset code sent to your email! Please check your inbox.");
        setStep(2);
      } else {
        setError(response.message || "Failed to send reset code");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setError(error.message || "Failed to send reset code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError("");
    setSuccess("");

    if (!formData.code || !formData.password || !formData.password_confirmation) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiService.resetPassword({
        email: formData.email,
        code: formData.code,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });

      if (response.success) {
        setSuccess("Password reset successful! You can now login.");
        setTimeout(() => {
          onBackToLogin();
        }, 2000);
      } else {
        setError(response.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError(error.message || "Failed to reset password. Please try again.");
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
            🔐
          </div>
        </div>

        {/* SIMPLE TITLE ONLY */}
        <div className="simple-login-header">
          <h1>{step === 1 ? "FORGOT PASSWORD" : "RESET PASSWORD"}</h1>
        </div>

        {/* SIMPLE FORM */}
        <div className="simple-login-form">
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

          {success && (
            <div style={{
              backgroundColor: '#44ff44',
              color: '#000',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '15px',
              fontSize: '14px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              {success}
            </div>
          )}

          {step === 1 ? (
            <>
              <div className="simple-form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setError("");
                  }}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  required
                />
              </div>

              <button
                onClick={handleSendCode}
                className="simple-login-btn"
                disabled={isLoading}
              >
                {isLoading ? "SENDING..." : "SEND RESET CODE"}
              </button>
            </>
          ) : (
            <>
              <div className="simple-form-group">
                <label>Reset Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => {
                    setFormData({ ...formData, code: e.target.value });
                    setError("");
                  }}
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="simple-form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setError("");
                  }}
                  placeholder="Enter new password"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="simple-form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={formData.password_confirmation}
                  onChange={(e) => {
                    setFormData({ ...formData, password_confirmation: e.target.value });
                    setError("");
                  }}
                  placeholder="Confirm new password"
                  disabled={isLoading}
                  required
                />
              </div>

              <button
                onClick={handleResetPassword}
                className="simple-login-btn"
                disabled={isLoading}
              >
                {isLoading ? "RESETTING..." : "RESET PASSWORD"}
              </button>
            </>
          )}
        </div>

        {/* Back to Login */}
        <div className="simple-create-account">
          <button
            onClick={onBackToLogin}
            className="simple-create-btn"
            disabled={isLoading}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
