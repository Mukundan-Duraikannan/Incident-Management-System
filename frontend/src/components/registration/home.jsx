import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import { FiSearch } from "react-icons/fi";
 
function Home() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
 
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
 
  useEffect(() => {
    fetchProjects();
  }, []);
 
  async function fetchProjects() {
    try {
      const res = await fetch("http://localhost:8000/projects/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
 
  function openProject(projectId) {
    navigate(`/projects/${projectId}`);
  }
 
  // Filtered projects based on search input
  const filteredProjects =
    search.trim() === ""
      ? projects
      : projects.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );
 
  return (
    <div className="home-container">
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
 
      <h2 className="welcome-text">
        Welcome{username ? `, ${username}` : ""}
      </h2>
 
      <div className="search-wrapper">
        <span className="search-icon">
          <FiSearch />
        </span>
        <input
          type="text"
          className="search-input"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
 
      {filteredProjects.length === 0 ? (
        <p className="empty-text">No projects found</p>
      ) : (
        <div className="project-list">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="project-card"
              onClick={() => openProject(project.id)}
            >
              <div className="project-name">{project.name}</div>
              <div className="project-description">{project.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
 
export default Home;