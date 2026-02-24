import { useEffect, useState } from "react";
import { Search, RotateCcw, Pencil, Trash2, Save, X, Users } from "lucide-react";
import "./viewProjects.css";
import { useNavigate } from "react-router-dom";

function ViewProjects() {
  const BASE_URL = "http://127.0.0.1:8000";

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("access_token");
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([]);

  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("id");

  const [editingProject, setEditingProject] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjects = async () => {
    const res = await fetch(`${BASE_URL}/projects/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setProjects(data);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    await fetch(`${BASE_URL}/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchProjects();
  };

  const handleUpdate = async () => {
    await fetch(`${BASE_URL}/projects/${editingProject}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: editName,
        description: editDescription,
      }),
    });

    setEditingProject(null);
    fetchProjects();
  };

  /* ================= USERS ================= */

  const fetchUsers = async () => {
    const res = await fetch(`${BASE_URL}/user/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
  };

  /* ================= MEMBERS ================= */

  const refreshMembers = async () => {
    if (!selectedProject) return;

    const res = await fetch(
      `${BASE_URL}/projects/${selectedProject}/members`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.ok) {
      const data = await res.json();
      setMembers(data);
    }
  };

  const openMemberModal = async (projectId) => {
    setSelectedProject(projectId);
    setShowMemberModal(true);
    await fetchUsers();

    const res = await fetch(
      `${BASE_URL}/projects/${projectId}/members`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.ok) {
      const data = await res.json();
      setMembers(data);
    }
  };

  const handleAddMember = async (userId) => {
    const res = await fetch(
      `${BASE_URL}/projects/${selectedProject}/members`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          role: "TeamMember",
        }),
      }
    );

    if (res.ok) {
      await refreshMembers();
    }
  };

  const handleRemoveMember = async (userId) => {
    const res = await fetch(
      `${BASE_URL}/projects/${selectedProject}/members?user_id=${userId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.ok) {
      await refreshMembers();
    }
  };

  const handleUpdateRole = async (userId, role) => {
    const res = await fetch(
      `${BASE_URL}/projects/${selectedProject}/members`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          role: role,
        }),
      }
    );

    if (res.ok) {
      await refreshMembers();
    }
  };

  const filteredProjects = projects.filter((project) => {
    if (!search) return true;

    if (searchType === "id") {
      return project.id.toString().includes(search);
    }

    return project.name
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  return (
    <div className="view-projects-container">
      <div className="header-row">
        <h2 className="page-title">View Projects</h2>

        <button className="create-project-btn" onClick={() => navigate("/admin/createProject")}>
          + Create Project
        </button>
      </div>

      <div className="search-bar">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="id">Search by ID</option>
          <option value="name">Search by Name</option>
        </select>

        <div className="search-input-wrapper">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="reset-btn" onClick={() => setSearch("")}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <div className="table-wrapper">
        <table className="project-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.id}>
                <td>{project.id}</td>
                <td>
                  {editingProject === project.id ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    project.name
                  )}
                </td>
                <td>
                  {editingProject === project.id ? (
                    <input
                      value={editDescription}
                      onChange={(e) =>
                        setEditDescription(e.target.value)
                      }
                    />
                  ) : (
                    project.description
                  )}
                </td>
                <td className="action-buttons">
                  <button
                    onClick={() => {
                      setEditingProject(project.id);
                      setEditName(project.name);
                      setEditDescription(project.description);
                    }}
                  >
                    <Pencil size={16} />
                  </button>

                  <button onClick={() => handleDelete(project.id)}>
                    <Trash2 size={16} />
                  </button>

                  <button onClick={() => openMemberModal(project.id)}>
                    <Users size={16} />
                  </button>

                  {editingProject === project.id && (
                    <>
                      <button onClick={handleUpdate}>
                        <Save size={16} />
                      </button>
                      <button onClick={() => setEditingProject(null)}>
                        <X size={16} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showMemberModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Manage Project Members</h3>

            <div className="member-container">
              {users.map((user) => {
                const assigned = members.find(
                  (m) => m.user_id === user.id
                );

                return (
                  <div key={user.id} className="member-row">
                    <input
                      type="checkbox"
                      checked={!!assigned}
                      onChange={() =>
                        assigned
                          ? handleRemoveMember(user.id)
                          : handleAddMember(user.id)
                      }
                    />

                    <span>{user.email}</span>

                    {assigned && (
                      <select
                        value={assigned.role}
                        onChange={(e) =>
                          handleUpdateRole(
                            user.id,
                            e.target.value
                          )
                        }
                      >
                        <option value="Manager">Manager</option>
                        <option value="TeamMember">
                          TeamMember
                        </option>
                      </select>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              className="close-btn"
              onClick={() => setShowMemberModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewProjects;