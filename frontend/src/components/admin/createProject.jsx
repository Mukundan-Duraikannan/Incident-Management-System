import { useState } from "react";
import './createProject.css'
import { useNavigate } from "react-router-dom";

function CreateProject() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/projects/create-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          description: description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const data = await response.json();
      console.log("Project Created:", data);
      localStorage.setItem("projectId", data.id);
      localStorage.setItem("projectName", data.name);
      localStorage.setItem("projectDescription", data.description);
      navigate("/project-member");

    } catch (error) {
      console.error("Error:", error);
      alert("Error creating project");
    }
  };

  return (
    <div className='project-elements'>
        <div className="box-project">
      <h2 className="login-font">Create Project</h2>

      <form onSubmit={handleSubmit}>
        <label className='project-font'>Project Name</label>
        <input type="text" value={name} className='text-font' onChange={(e) => setName(e.target.value)} required/>
        <br />
        <label className='project-font'>Project Description</label>
        <textarea value={description} className='text-font' onChange={(e) => setDescription(e.target.value)} required/>
        <br />
        <button type="submit" className='project-button'>Next</button>
      </form>
      </div>
    </div>
  );
}

export default CreateProject;
