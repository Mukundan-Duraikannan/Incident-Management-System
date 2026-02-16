import "./raiseTicket.css";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
      alert("Please login again");
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
        alert("Failed to create ticket");
        return;
      }

      alert("Ticket created successfully!");

      setIssue("");
      setDescription("");

      navigate("/");

    } catch (error) {

      console.error(error);
      alert("Server error");

    }

  }

  return (
    <div className='div-border'>
      <div className='raise-box'>

        <h2 className='header'>
          Raise Ticket
        </h2>

        <form onSubmit={handleSubmit}>

          <label>Email:</label><br/>
          <input 
            type="text"
            value={email}
            className="input-field"
            readOnly
          /><br/>

          <label>Issue:</label><br/>
          <input
            placeholder="Issue"
            className="input-field"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            required
          /><br/>

          <label>Description:</label><br/>
          <textarea
            placeholder="Description"
            className="input-field"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          /><br/>

          <button className='button' type="submit">
            Submit Ticket
          </button>

        </form>

      </div>
    </div>
  );

}

export default RaiseTicket;
