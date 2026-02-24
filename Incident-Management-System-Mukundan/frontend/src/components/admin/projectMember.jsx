import React, { useEffect, useState } from "react";
import "./projectMember.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function ProjectMember() {
  const BASE_URL = "http://127.0.0.1:8000";
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");

  const [selectedManager, setSelectedManager] = useState("");
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);

  useEffect(() => {
    const storedProjectId = localStorage.getItem("projectId");
    const storedProjectName = localStorage.getItem("projectName");

    if (storedProjectId) setProjectId(storedProjectId);
    if (storedProjectName) setProjectName(storedProjectName);

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("access_token");

      const response = await fetch(`${BASE_URL}/user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch users:", response.status);
        setUsers([]);
        return;
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("Unexpected response format:", data);
        setUsers([]);
      }

    } catch (error) {
      console.error("Fetch error:", error);
      setUsers([]);
    }
  };

  const handleTeamMember = (userId) => {
    if (selectedTeamMembers.includes(userId)) {
      setSelectedTeamMembers(
        selectedTeamMembers.filter((id) => id !== userId)
      );
    } else {
      setSelectedTeamMembers([...selectedTeamMembers, userId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token");

    if (!projectId) {
      Swal.fire("Error", "Project not found", "error");
      return;
    }

    try {

      if (selectedManager) {
        await fetch(`${BASE_URL}/projects/${projectId}/members`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: parseInt(selectedManager),
            role: "Manager",
          }),
        });
      }

      for (let id of selectedTeamMembers) {
        await fetch(`${BASE_URL}/projects/${projectId}/members`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: parseInt(id),
            role: "TeamMember",
          }),
        });
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Members assigned successfully",
      }).then(() => {
        navigate("/admin-dashboard");
      });

      setSelectedManager("");
      setSelectedTeamMembers([]);

    } catch (error) {
      console.error("Submission error:", error);
      Swal.fire("Error", "Failed to assign members", "error");
    }
  };

  return (
    <div className="projectmember-elements">
      <div className="box-projectmember">
        <h2>Assign Project Members</h2>

        <form onSubmit={handleSubmit} className="projectmember-form">

          <label>Project Name</label>
          <input type="text" value={projectName || ""} readOnly />

          <label>Select Manager</label>
          <select
            value={selectedManager}
            onChange={(e) => setSelectedManager(e.target.value)}
            required
          >
            <option value="">Select Manager</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.email}
              </option>
            ))}
          </select>

          <label>Select Team Members</label>
          <div className="user-list">
            {users
              .filter((u) => u.id !== parseInt(selectedManager))
              .map((u) => (
                <div key={u.id} className="user-row">
                  <input
                    type="checkbox"
                    checked={selectedTeamMembers.includes(u.id)}
                    onChange={() => handleTeamMember(u.id)}
                  />
                  <span>{u.email}</span>
                </div>
              ))}
          </div>

          <button type="submit">Assign Members</button>

        </form>
      </div>
    </div>
  );
}

export default ProjectMember;
