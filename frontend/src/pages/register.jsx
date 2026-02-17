import React, { useState } from 'react'
import './register.css'
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
function Register() {
   const navigate = useNavigate();
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Select')
   async function handleRegister() {

  if (!name && !email && !password && role === "Select") {
    Swal.fire({
    icon: "error",
    title: "Missing fields",
    text: "Please enter all fields",
  });
  return;
  }
  else if(!name){
    Swal.fire({
    icon: "warning",
    title: "Name required",
    text: "Please enter name",
  });
  return; 
  }
  else if(!email){
    Swal.fire({
    icon: "warning",
    title: "Email required",
    text: "Please enter email",
  });
  return;
  }
  else if(!password){
Swal.fire({
    icon: "warning",
    title: "Password required",
    text: "Please enter password",
  });
  return;
  }
  else if(role === "Select"){
    Swal.fire({
    icon: "warning",
    title: "Role required",
    text: "Please select role",
  });
  return;
  }
  else{
  try {
    const response = await fetch("http://127.0.0.1:8000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        role: role
      })
    });

    if (!response.ok) {
      const error = await response.json();
      Swal.fire({
  icon: "error",
  title: "Registration failed",
});
return;
    }

    Swal.fire({
  icon: "success",
  title: " successful",
  timer: 2000,
  showConfirmButton: false,
});
    navigate("/");

  } catch (error) {
    Swal.fire({
    icon: "error",
    title: "Server Error",
    
  });
  return;
  }
}
   }

  return (
    <div className="div-elements">
      <div className="box1">
        <h2 className="login-font">Create Account</h2>
        <label className="label-font">Name:<input type="text" className="input-font" value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label className="label-font">Email:<input type="email" className="input-font" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </label>

        <label className="label-font">Password:<input type="password" className="input-font" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        <label className="label-font">Role:<br/><select className="input-font" value={role} onChange={(e) => setRole(e.target.value)}>
            <option>Select</option>
            <option>Admin</option>
            <option>User</option>
          </select>
        </label>

        <button className="button" onClick={handleRegister}>
          Register
        </button>

      </div>
    </div>
  )
}

export default Register
