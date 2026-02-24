import React, { useState } from "react";
import { forgotPassword } from "../services/api";
import Swal from "sweetalert2";
import "./forgotPassword.css";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";

function ForgotPassword() {

  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handleForgot = async () => {
    if (!email) {
      Swal.fire("Please enter your email");
      return;
    }
    try {
      const data = await forgotPassword(email);
      await Swal.fire({
        icon: "success",
        title: data.message || "OTP sent",
        timer: 1500,
        showConfirmButton: false
      });
      navigate("/reset-password", { state: { email } });
    }
    catch (error) {
      Swal.fire("Failed to send OTP");
    }
  };
  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <Mail className="forgot-icon" size={48} />
        <h2 className="forgot-title">
          Forgot Password
        </h2>
        <p className="forgot-subtitle">
          Enter your email to receive OTP
        </p>
        <input
          type="email"
          placeholder="Enter your email"
          className="forgot-input"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="forgot-button"
          onClick={handleForgot}
        >
          Send OTP
        </button>
      </div>
    </div>

  );

}

export default ForgotPassword;
