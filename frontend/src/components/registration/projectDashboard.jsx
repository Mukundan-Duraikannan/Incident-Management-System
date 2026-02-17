import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


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

      <h2>Project Dashboard</h2>

      <div className="dashboard-buttons">

        <button
          onClick={() => navigate(`/projects/${projectId}/members`)}
        >
          View Members
        </button>

        <button
          onClick={() => navigate(`/projects/${projectId}/raise-ticket`)}
        >
          Raise Ticket
        </button>

        <button
          onClick={() => navigate(`/projects/${projectId}/issues`)}
        >
          View Issues
        </button>

        {role === "manager" && (
          <div className="manager-label">
            You are Manager
          </div>
        )}

      </div>

    </div>

  );

}

export default ProjectDashboard;
