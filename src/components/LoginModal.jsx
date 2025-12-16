import React, { useState, useEffect } from "react";
import "./LoginModal.css";

const LoginModal = ({ onClose, onLoginSuccess, initialMode = "login" }) => {
  const [rocketY, setRocketY] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState(initialMode);
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
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
    // Validate form
    if (!authForm.email || !authForm.password) {
      alert("Please fill in all required fields");
      return;
    }

    if (authMode === "register" && !authForm.name) {
      alert("Please enter your full name");
      return;
    }

    setIsLoading(true);

    try {
      if (authMode === "login") {
        // Simulate login - replace with actual API call
        const userData = {
          id: 1,
          name: authForm.email.split("@")[0],
          email: authForm.email,
        };
        localStorage.setItem("auth_token", "fake-token-" + Date.now());
        localStorage.setItem("user", JSON.stringify(userData));
        onLoginSuccess(userData);
      } else {
        // Simulate registration - replace with actual API call
        const userData = {
          id: 1,
          name: authForm.name,
          email: authForm.email,
        };
        localStorage.setItem("auth_token", "fake-token-" + Date.now());
        localStorage.setItem("user", JSON.stringify(userData));
        onLoginSuccess(userData);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Authentication failed. Please try again.");
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
          <h1>{authMode === "login" ? "WELCOME BACK" : "CREATE ACCOUNT"}</h1>
        </div>

        {/* SIMPLE FORM */}
        <div className="simple-login-form">
          {authMode === "register" && (
            <div className="simple-form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={authForm.name}
                onChange={(e) =>
                  setAuthForm({ ...authForm, name: e.target.value })
                }
                placeholder="Enter your name"
                disabled={isLoading}
                required
              />
            </div>
          )}

          <div className="simple-form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={authForm.email}
              onChange={(e) =>
                setAuthForm({ ...authForm, email: e.target.value })
              }
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
              onChange={(e) =>
                setAuthForm({ ...authForm, password: e.target.value })
              }
              placeholder="Enter your password"
              disabled={isLoading}
              required
            />
          </div>

          {authMode === "login" && (
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
          )}

          <button
            onClick={handleSubmit}
            className="simple-login-btn"
            disabled={isLoading}
          >
            {isLoading
              ? authMode === "login"
                ? "LOGGING IN..."
                : "CREATING ACCOUNT..."
              : authMode === "login"
              ? "LOGIN"
              : "SIGN UP"}
          </button>
        </div>

        {/* Toggle between Login/Register */}
        <div className="simple-create-account">
          <button
            onClick={() => {
              setAuthMode(authMode === "login" ? "register" : "login");
              setAuthForm({ name: "", email: "", password: "" });
            }}
            className="simple-create-btn"
            disabled={isLoading}
          >
            {authMode === "login"
              ? "Create Account"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
