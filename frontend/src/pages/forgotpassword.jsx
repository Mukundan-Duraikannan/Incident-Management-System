import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/password/forgot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("OTP sent to your email");
        navigate("/reset-password", { state: { email } });
      } else {
        alert(data.detail || "Something went wrong");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Send OTP</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
