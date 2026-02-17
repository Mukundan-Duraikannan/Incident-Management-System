import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

function Home() {

  const [projects, setProjects] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {

    try {

      const res = await fetch("http://localhost:8000/projects/", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();
      setProjects(data);

    } catch (error) {
      console.error(error);
    }

  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  // function viewMembers(projectId) {
  //   navigate(`/projects/${projectId}/members`);
  // }

  // function raiseTicket(projectId) {
  //   navigate(`/projects/${projectId}/raise-ticket`);
  // }
   function openProject(projectId) {
    navigate(`/projects/${projectId}`);
  }

  return (

   <div className="project-list">
      <button onClick={handleLogout}>Logout</button>
        {projects.map(project => (
          <div
            key={project.id}
            className="project-card"
            onClick={() => openProject(project.id)}
          >
            <div className="project-title">
              {project.name}
            </div>
            <div className="project-description">
              {project.description}
            </div>
          </div>
        ))}
      </div>
  );

}

export default Home;