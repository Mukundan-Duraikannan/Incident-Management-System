import React, { useState } from 'react'
import './register.css'
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleRegister() {
    const token = localStorage.getItem("token");
    if (!name || !email || !password) {
      Swal.fire({icon: "error",title: "Registration failed",text: "Enter all the fields"});
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/user", {
        method: "POST",
        headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
        body: JSON.stringify({name: name,email: email,password: password})
      });

      const data = await response.json();

      if (!response.ok) {
        Swal.fire(data.detail || "Registration failed");
        return;
      }
      Swal.fire("Registration successful. Please reset your password from email.");
      navigate("/");
    }
    catch (error) {
      Swal.fire("Server error");
    }

  }

return (
    <div className="register-container">
      <div className="register-left-bg"></div>
      <div className="register-right-bg"></div>
      <div className="register-center">
        <div className="register-box">
         
          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">Sign up to get started</p>
 
          <label>
            Name
            <input
              type="text"
              className="register-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
 
          <label>
            Email
            <input
              type="email"
              className="register-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
 
          <label>
            Password
            <input
              type="password"
              className="register-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
 
          <button
            className="register-button"
            onClick={handleRegister}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
 
export default Register;
