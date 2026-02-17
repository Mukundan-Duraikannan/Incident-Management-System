import React, { useEffect, useState } from "react";
import "./projectmember.css";
import Swal from "sweetalert2";

function ProjectMember() {
  const BASE_URL = "http://127.0.0.1:8000";

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
const [projectName, setProjectName] = useState("");

useEffect(() => {
  setProjectId(localStorage.getItem("projectId"));
  setProjectName(localStorage.getItem("projectName"));
}, []);

  const [selectedManager, setSelectedManager] = useState("");
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);

  const fetchUsers = async () => {
    const res = await fetch(`${BASE_URL}/auth/view-users`);
    const data = await res.json();
    setUsers(data);
  };

  const fetchProjects = async () => {
    const res = await fetch(`${BASE_URL}/projects/create`);
    const data = await res.json();
    setProjects(data);
  };

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

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
    const members = [];
    if (selectedManager) {
      members.push({
        user_id: parseInt(selectedManager),
        role: "Manager",
      });
    }

    selectedTeamMembers.forEach((id) => {
      members.push({
        user_id: parseInt(id),
        role: "TeamMember",
      });
    });

    await fetch(`${BASE_URL}/project-members/member`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_id: parseInt(projectId),
        members: members,
      }),
    });

   Swal.fire({
  icon: "success",
  title: "Success",
  text: "Members assigned successfully",
  confirmButtonText: "Go to Dashboard",
}).then(() => {
  navigate("/admin-dashboard");
});

    setSelectedManager("");
    setSelectedTeamMembers([]);
  };

  return (
    <div className="projectmember-elements">
      <div className="box-projectmember">
        <h2>Assign Project Members</h2>
        <form onSubmit={handleSubmit} className="projectmember-form">
          <label>Project Name</label>
          <input type="text" value={projectName} className="font" readOnly/>
          <label>Select Manager</label>
          <select
            value={selectedManager}
            onChange={(e) => setSelectedManager(e.target.value)}
            required>
            <option value="">Select Manager</option>
            {users.filter((u)=> u.isActive===true)
            .map((u) => (
              <option key={u.id} value={u.id}>
                {u.email}
              </option>
            ))}
          </select>

          <label>Select Team Members</label>
<div className="user-list">
  {users
    .filter((u) => u.isActive=== true && u.id !== parseInt(selectedManager))
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
