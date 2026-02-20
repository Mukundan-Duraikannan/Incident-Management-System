import "./raiseTicket.css";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Ticket } from "lucide-react";
import Swal from "sweetalert2";
 
function RaiseTicket() {
 
  const { projectId } = useParams();
  const navigate = useNavigate();
 
  const [email, setEmail] = useState("");
  const [issue, setIssue] = useState("");
  const [description, setDescription] = useState("");
 
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);
 
  async function handleSubmit(e) {
 
    e.preventDefault();
 
    const token = localStorage.getItem("token");
 
    if (!token) {
        Swal.fire({
    icon: "warning",
    title: "Login",
    text: "Please login again",
  });
  return;
    }
 
    try {
 
  const response = await fetch(
    `http://localhost:8000/issues/project/${projectId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        title: issue,
        description: description
    })
  }
);
 
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
          Swal.fire({
    icon: "error",
    text: "Failed to create ticket",
  });
  return;
      }
 
       const data = await response.json();
    Swal.fire({
  icon: "success",
  title: "Success",
  text: "Ticket created successfully",
  confirmButtonText: "Go to Home",
}).then(() => {
  navigate("/home ");
});
 
      setIssue("");
      setDescription("");
 
      navigate("/");
 
    } catch (error) {
 
      console.error(error);
     console.error("Error:", error);
    Swal.fire({
    icon: "error",
    title: "Server Error",
   
  });
  return;
 
    }
 
  }
 
  return (
    <div className='div-border'>
      <div className='raise-box'>
 
        <h2 className='ticket'>
          <Ticket size={28} color="#1e3a8a" />
          Raise Ticket
        </h2>
 
        <form onSubmit={handleSubmit}>
 
          <label className="raise-font">Email:</label><br/>
          <input
            type="text"
            value={email}
            className="raise-field"
            readOnly
          /><br/>
 
          <label className='raise-font'>Issue:</label><br/>
          <input
            placeholder="Issue"
            className="raise-field"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            required
          /><br/>
 
          <label className="raise-font">Description:</label><br/>
          <textarea
            placeholder="Description"
            className="raise-field"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          /><br/>
 
          <button className="raise-ticket-btn">
  <span>Raise Ticket</span>
</button>
 
        </form>
 
      </div>
    </div>
  );
 
}
 
export default RaiseTicket;