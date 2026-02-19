import React, { useState } from "react";
import { resetPassword } from "../services/api";
import Swal from "sweetalert2";
import "./resetPassword.css";
 
function ResetPassword() {
 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
 
  const handleReset = async () => {
 
    if (!email || !otp || !password) {
      Swal.fire("Please fill all fields");
      return;
    }
 
    try {
      const data = await resetPassword(email, otp, password);
      Swal.fire("Password reset successfull");
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
 
          <img src="lock.png" alt="lock" className="lock-icon" />
 
          <h2 className="reset-title">Reset Password</h2>
 
          <p className="reset-subtitle">
            Enter OTP and new password
          </p>
 
          <input type="email" placeholder="Enter your email" className="reset-input" />
          <input type="text" placeholder="Enter OTP" className="reset-input" />
          <input type="password" placeholder="Enter new password" className="reset-input" />
 
          <button className="reset-button" onClick={handleReset}>
            Reset Password
          </button>
 
        </div>
      </div>
 
    </div>
 
 
  );
 
}
 
export default ResetPassword;