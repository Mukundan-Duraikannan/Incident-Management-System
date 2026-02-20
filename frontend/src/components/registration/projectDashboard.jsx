import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './projectDashboard.css'

function ProjectDashboard() {

  const { projectId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchMyRole();
  }, []);

  async function fetchMyRole() {

    const res = await fetch(
      `http://localhost:8000/projects/${projectId}/members`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    const myId = JSON.parse(atob(token.split(".")[1])).user_id;

    const me = data.find(m => m.user_id === myId);

    if (me)
      setRole(me.role);
  }

  return (
  <div className="dashboard-container">
    <div className="dashboard-header">
      <h2>Project Dashboard</h2>
    </div>
    <div className="dashboard-grid">
      <div
        className="dashboard-card card-blue"
        onClick={()=>navigate(`/projects/${projectId}/members`)}>
        <div className="card-title">Members</div>
        <div className="card-sub">View project team</div>
      </div>
      <div
        className="dashboard-card card-purple"
        onClick={()=>navigate(`/projects/${projectId}/raise-ticket`)}>
        <div className="card-title">Raise Ticket</div>
        <div className="card-sub">Create new issue</div>
      </div>
      <div
        className="dashboard-card card-orange"
        onClick={()=>navigate(`/projects/${projectId}/issues`)}
      >
        <div className="card-title">Issues</div>
        <div className="card-sub">Track project issues</div>
      </div>
      {role !== "manager" && (
        <div
          className="dashboard-card card-green"
          onClick={()=>navigate(`/projects/${projectId}/assigned-issues`)}
        >
          <div className="card-title">Assigned Issues</div>
          <div className="card-sub">Your tasks</div>
        </div>
      )}
    </div>
    {role === "manager" && (
      <div className="manager">Manager Access</div>
    )}
  </div>
);

}

export default ProjectDashboard;
