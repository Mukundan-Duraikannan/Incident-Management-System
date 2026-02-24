import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./projectDashboard.css";

function ProjectDashboard() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchMyRole();
  }, []);

  async function fetchMyRole() {
    try {
      const res = await fetch(
        `http://localhost:8000/projects/${projectId}/members`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

      if (token) {
        const myId = JSON.parse(atob(token.split(".")[1])).user_id;
        const me = data.find((m) => m.user_id === myId);
        if (me) setRole(me.role);
      }
    } catch (error) {
      console.error("Error fetching role:", error);
    }
  }

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="logo">Project</div>

        <button className="sidebar-btn" onClick={() => navigate(`/projects/${projectId}/members`)}>
          Members
        </button>

        <button className="sidebar-btn" onClick={() => navigate(`/projects/${projectId}/raise-ticket`)}>
          Raise Ticket
        </button>

        <button className="sidebar-btn" onClick={() => navigate(`/projects/${projectId}/issues`)}>
          Issues
        </button>

        {role !== "manager" && (
          <button className="sidebar-btn" onClick={() => navigate(`/projects/${projectId}/assigned-issues`)}>
            Assigned Issues
          </button>
        )}
      </div>

      {/* MAIN */}
      <div className="main">

        {/* HEADER */}
        <div className="topbar">
          <h1>Project Dashboard</h1>

          {role === "manager" && (
            <div className="manager-badge">MANAGER</div>
          )}
        </div>

        {/* CONTENT */}
        <div className="content">
          <div className="dashboard-grid">

            <div className="dashboard-card" onClick={() => navigate(`/projects/${projectId}/members`)}>
              <div className="card-title">Members</div>
              <div className="card-sub">View project team</div>
            </div>

            <div className="dashboard-card" onClick={() => navigate(`/projects/${projectId}/raise-ticket`)}>
              <div className="card-title">Raise Ticket</div>
              <div className="card-sub">Create new issue</div>
            </div>

            <div className="dashboard-card" onClick={() => navigate(`/projects/${projectId}/issues`)}>
              <div className="card-title">Issues</div>
              <div className="card-sub">Track project issues</div>
            </div>

            {role !== "manager" && (
              <div className="dashboard-card" onClick={() => navigate(`/projects/${projectId}/assigned-issues`)}>
                <div className="card-title">Assigned Issues</div>
                <div className="card-sub">Your tasks</div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default ProjectDashboard;