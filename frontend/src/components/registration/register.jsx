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
    <div className="div-elements">

      <div className="box1">

        <h2 className="login-font">Create Account</h2>

        <label className="label-font">
          Name:
          <input
            type="text"
            className="input-font"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="label-font">
          Email:
          <input
            type="email"
            className="input-font"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="label-font">
          Password:
          <input
            type="password"
            className="input-font"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button className="button" onClick={handleRegister}>
          Register
        </button>

      </div>

    </div>

  )

}

export default Register;
