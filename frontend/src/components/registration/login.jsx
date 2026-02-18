import React, { useState, useEffect } from 'react'
import './login.css'
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {

    const savedEmail = localStorage.getItem("rememberEmail");
    const savedPassword = localStorage.getItem("rememberPassword");

    if (savedEmail && savedPassword) {

      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);

    }

  }, []);

  async function handleLogin() {

    if (!email || !password) {

      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: "Enter email and password",
      });

      return;

    }

    try {

      const response = await fetch("http://localhost:8000/login", {

        method: "POST",

        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },

        body: new URLSearchParams({
          username: email,
          password: password
        })

      });

      const data = await response.json();

      if (!response.ok) {

        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: data.detail || "Invalid login"
        });

        return;

      }

      console.log("LOGIN RESPONSE:", data);
      if (data.first_login) {
        localStorage.setItem("resetEmail", email);
        Swal.fire({
          icon: "info",
          title: "Password Reset Required",
          text: "Check your mail for OTP."
        });
        navigate("/reset-password");
        return;
      }
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", data.email);
      if (rememberMe) {
        localStorage.setItem("rememberEmail", email);
        localStorage.setItem("rememberPassword", password);
      }
       else 
        {
        localStorage.removeItem("rememberEmail");
        localStorage.removeItem("rememberPassword");
      }
      if (data.role === "admin") {
        navigate("/admin-dashboard");
      }
       else 
        {
        navigate("/home");
      }

    }
    catch (error) {

      Swal.fire({
        icon: "error",
        title: "Server error",
        text: "Try again later"
      });

    }

  }

  return (

    <div className='div-elements'>

      <div className='box'>

        <h2 className='login-font'>Sign into your account</h2>

        <label className='label-font'>
          Email:
          <input
            type='email'
            className='input-font'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className='label-font'>
          Password:
          <input
            type='password'
            className='input-font'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <div className="options">

          <label className='label-font'>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember Me
          </label>

          <label
            className='p'
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </label>

        </div>

        <button
          type='button'
          className='button'
          onClick={handleLogin}
        >
          Login
        </button>

      </div>

    </div>

  );

}

export default Login;
