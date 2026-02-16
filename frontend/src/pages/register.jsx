import React, { useState } from 'react'
import './register.css'
import { useNavigate } from "react-router-dom";
function Register() {
   const navigate = useNavigate();
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Select')
   async function handleRegister() {

  if (!name && !email && !password && role === "Select") {
    alert("Please fill all fields");
    return;
  }
  else if(!name){
    alert("Please enter name");
    return; 
  }
  else if(!email){
    alert("Please enter email");
    return; 
  }
  else if(!password){
    alert("Please enter password");
    return; 
  }
  else if(role === "Select"){
    alert("Please select role");
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
      alert(error.detail || "Registration failed");
      return;
    }

    alert("Registration successful");
    navigate("/");

  } catch (error) {
    alert("Server error");
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
