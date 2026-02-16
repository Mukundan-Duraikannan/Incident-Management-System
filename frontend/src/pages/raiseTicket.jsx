import "./raiseTicket.css";
import React, { useState, useEffect } from "react";


function RaiseTicket() {

  const [email, setEmail] = useState("");
const [projecttitle, setProjectTitle] = useState("");
const [issue, setIssue] = useState("");
const [description, setDescription] = useState("");
const [category, setCategory] = useState("Select");
useEffect(() => {
  const storedEmail = localStorage.getItem("email");
  if (storedEmail) {
    setEmail(storedEmail);
  }
}, []);


  async function handleSubmit(e) {
  e.preventDefault();

  const token = localStorage.getItem("token");
  console.log("TOKEN SENT:", token);

  if (!token) {
    alert("Please login again");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/tickets/raise-ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
     body: JSON.stringify({
  project_title: projecttitle,   
  issue: issue,
  description: description,
  category: category
})

    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log("ERROR:", errorData);
      alert("Failed to create ticket");
      return;
    }

    const data = await response.json();
    alert("Ticket created successfully!");
  
    setProjectTitle("");
    setIssue("");
    setDescription("");
    setCategory("Select");

  } catch (error) {
    console.error("Error:", error);
    alert("Server error");
  }
}


  return (
    <div className='div-border'>
      <div className='raise-box'>
        <h2 className='header'>
          <img src='/ticket-icon.png' alt='ticket icon' className='ticket-icon'/>Raise Ticket</h2>
        <form onSubmit={handleSubmit}>
          <label>Email:</label><br/>
          <input type="text" value={email} className="input-field" readOnly /><br/>
          <label>Project Title:</label><br/>
          <input placeholder="Project Title" className="input-field" value={projecttitle} onChange={(e) => setProjectTitle(e.target.value)} required /><br/>
          <label>Issue:</label><br/>
          <input placeholder="Issue" className="input-field" value={issue} onChange={(e) => setIssue(e.target.value)} required /><br/>
          <label>Description:</label><br/>
          <textarea placeholder="Description" className="input-field" value={description} onChange={(e) => setDescription(e.target.value)} required/><br/>
          <label>Category:</label><br/>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field" required>
            <option value="Select">Select Category</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Network">Network</option>
          </select><br/>
          <button className='button' type="submit">Submit Ticket</button>
        </form>
      </div>
    </div>
  );
}

export default RaiseTicket;
