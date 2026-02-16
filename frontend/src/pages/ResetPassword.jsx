import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password reset successful!");
        navigate("/login");
      } else {
        alert(data.detail || "Invalid OTP");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>

      <form onSubmit={handleSubmit}>
        <input type="email" value={email} disabled />

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default ResetPassword;
