import React, { useState } from "react";
import { resetPassword } from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./resetPassword.css";
import { Lock } from "lucide-react";

function ResetPassword() {

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleReset = async () => {

    if (!email || !otp || !password) {
      Swal.fire("Please fill all fields");
      return;
    }
    try {
      await resetPassword(email, otp, password);

      await Swal.fire({
        icon: "success",
        title: "Password reset successful",
        timer: 1500,
        showConfirmButton: false
      });

      navigate("/login");
    }
    catch (error) {
      Swal.fire("Password reset failed");
    }

  };

  return (

    <div className="reset-container">

      <div className="reset-left-bg"></div>
      <div className="reset-right-bg"></div>

      <div className="reset-center">
        <div className="reset-box">

          <Lock className="lock-icon" size={48} />
          <h2 className="reset-title">Reset Password</h2>
          <p className="reset-subtitle">
            Enter OTP and new password
          </p>
          <input type="email" placeholder="Enter your email" className="reset-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="text" placeholder="Enter OTP" className="reset-input" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <input type="password" placeholder="Enter new password" className="reset-input" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button className="reset-button" onClick={handleReset}>
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;