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

  function viewMembers(projectId) {
    navigate(`/projects/${projectId}/members`);
  }

  function raiseTicket(projectId) {
    navigate(`/projects/${projectId}/raise-ticket`);
  }

  return (

    <div className="home-container">

      <div className="home-header">
        <h2>My Projects</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {projects.length === 0 ? (

        <p className="no-projects">No projects assigned</p>

      ) : (

        <div className="project-list">

          {projects.map(project => (

            <div key={project.id} className="project-card">

              <div className="project-title">
                {project.name}
              </div>

              <div className="project-description">
                {project.description}
              </div>

              <div className="project-buttons">

                <button
                  className="btn members-btn"
                  onClick={() => viewMembers(project.id)}
                >
                  View Members
                </button>

                <button
                  className="btn ticket-btn"
                  onClick={() => raiseTicket(project.id)}
                >
                  Raise Ticket
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default Home;
