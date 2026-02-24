import { useState } from "react";
import "./createProject.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FolderPlus } from "lucide-react";

function CreateProject() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all fields",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/projects/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const data = await response.json();

      localStorage.setItem("projectId", data.id);
      localStorage.setItem("projectName", data.name);
      localStorage.setItem("projectDescription", data.description);

      await Swal.fire({
        icon: "success",
        title: "Project Created Successfully!",
        text: "You can now add project members.",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/project-member");

    } catch (error) {
      console.error("Error:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error creating project",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="project-elements">
      <div className="box-project">
        <div className="folder-plus">
          <FolderPlus size={28} color="#1e3a8a" />
          <h2 className="project-login">Create Project</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="project-font">Project Name</label>
          <input
            type="text"
            value={name}
            className="project-text"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter project name"
            required
          />

          <label className="project-font">Project Description</label>
          <textarea
            value={description}
            className="project-text"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter project description"
            required
          />

          <button type="submit" className="project-button">

            Next
          </button>
        </form>

      </div>
    </div>
  );
}

export default CreateProject;
