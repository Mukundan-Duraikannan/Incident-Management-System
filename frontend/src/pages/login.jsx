import React, { useState, useEffect } from 'react'
import './login.css'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Select');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    const savedPassword = localStorage.getItem("rememberPassword");
    const savedRole = localStorage.getItem("rememberRole");
    if (savedEmail && savedPassword && savedRole) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRole(savedRole);
      setRememberMe(true);
    }
  }, []);
  async function handleLogin() {
    if (!email && !password && role === "Select") {
  Swal.fire({
    icon: "error",
    title: "Missing fields",
    text: "Please enter all fields",
  });
  return;
}
else if (!email) {
  Swal.fire({
    icon: "warning",
    title: "Email required",
    text: "Please enter email",
  });
  return;
}
else if (!password) {
  Swal.fire({
    icon: "warning",
    title: "Password required",
    text: "Please enter password",
  });
  return;
}
else if (role === "Select") {
  Swal.fire({
    icon: "warning",
    title: "Role required",
    text: "Please select role",
  });
  return;
}

else{
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
           username: email,
           password: password,
           role: role
})

      });


if (!response.ok) {
  Swal.fire({
    icon: "error",
    title: "Login failed",
    text: "Invalid login",
  });
  return;
}

     const data = await response.json();

console.log("LOGIN RESPONSE:", data);

localStorage.setItem("token", data.accessToken);

localStorage.setItem("role", data.role);
localStorage.setItem("email", email);



      
      if (data.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/raise-ticket");
      }

      if (rememberMe) {
        localStorage.setItem("rememberEmail", email);
        localStorage.setItem("rememberPassword", password);
        localStorage.setItem("rememberRole", role);
      } else {
        localStorage.removeItem("rememberEmail");
        localStorage.removeItem("rememberPassword");
        localStorage.removeItem("rememberRole");
      }

    } catch (error) {
      Swal.fire({
    icon: "error",
    title: "Server error",
    
  });
  return;
    }
  }
  }
  function handleEmail(e) {
    setEmail(e.target.value);
  }

  function handlePassword(e) {
    setPassword(e.target.value);
  }

  function handleRole(e) {
    setRole(e.target.value);
  }

  function handleRemember(e) {
    setRememberMe(e.target.checked);
  }

 
  return (
    <div className='div-elements'>
      <div className='box'>
        <img src='/user icon.png' alt='User Icon' className='user-icon' /><br />
        <h2 className='login-font'>Sign into your account</h2>
        
        <label className='label-font'>UserName:<input type='email' className='input-font' value={email} onChange={handleEmail}/></label><br />
        <label className='label-font'>Password:<input type='password' className='input-font' value={password} onChange={handlePassword}/></label><br />
        <label className='label-font'>Role:<br/><select value={role} onChange={handleRole} className='input-font'>
            <option value="Select">Select</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </label>
        <div className="options">
          <label className='label-font'><input type="checkbox" checked={rememberMe} onChange={handleRemember} />Remember Me</label>
          <label className='p'  onClick={() => navigate("/forgot-password")}> Forgot Password?</label>
        </div>
        <button type='button' className='button' onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;
