import { useEffect, useState } from "react";
import "./viewProjectMembers.css";
import Swal from "sweetalert2";
function ViewProjectMembers() {
  const BASE_URL = "http://127.0.0.1:8000";

  const [projectList, setProjectList] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [searchField, setSearchField] = useState("id");
  const [searchValue, setSearchValue] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingUser, setEditingUser] = useState(null); 
  const [newRole, setNewRole] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${BASE_URL}/projects/view`);
      const data = await res.json();
      setProjectList(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleProjectSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    const filtered = projectList
      .map((project) => {
        if (searchField === "name") return project.name;
        if (searchField === "id") return project.id?.toString();
        return "";
      })
      .filter(
        (item) => item && item.toLowerCase().includes(value.toLowerCase())
      );

    setSuggestions([...new Set(filtered)]);
  };

  const handleProject = async (value = searchValue) => {
    if (!value) return;
    try {
      const res = await fetch(`${BASE_URL}/projects/search/${searchField}/${value}`);
      const data = await res.json();
      setProjectList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search error:", error);
      setProjectList([]);
    }
  };

  const handleOpen = async (project) => {
    try {
      const res = await fetch(`${BASE_URL}/project-members/${project.id}`);
      const data = await res.json();
      setProjectMembers(data);
      setSelectedProject(project);
    } catch (error) {
      console.error("Error fetching members:", error);
      setProjectMembers([]);
    }
  };

  const closeModal = () => {
    setSelectedProject(null);
    setProjectMembers([]);
    setEditingUser(null);
    setNewRole("");
  };

const handleDelete = async (projectId, userId) => {
  const result1 = await Swal.fire({
  title: "Are you sure?",
  text: "This will delete the member from the project.",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#d33",
  cancelButtonColor: "#3085d6",
  confirmButtonText: "Yes, delete it",
  cancelButtonText: "Cancel",
});

if (!result1.isConfirmed) return;

  try {
    console.log("Deleting member:", projectId, userId);

    const res = await fetch(
      `${BASE_URL}/project-members/delete/${projectId}/${userId}`,
      { method: "DELETE" }
    );

    if (!res.ok) {
      const errorData = await res.json();
     Swal.fire({
    icon: "error",
    title: "Delete Failed",
    
  });
  return;
    }

    Swal.fire({
      icon:"success",
      title: "Deleted Successfully",
    });
    return;
    handleOpen(selectedProject); 
  } catch (error) {
    console.error("Delete error:", error);
    Swal.fire({
      icon:"error",
      title:"Server Error",
    });
    return;
  }
};

  const handleDeleteProject = async (projectId) => {
  

const result = await Swal.fire({
  title: "Are you sure?",
  text: "This will delete the project and all its members.",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#d33",
  cancelButtonColor: "#3085d6",
  confirmButtonText: "Yes, delete it",
  cancelButtonText: "Cancel",
});

if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${BASE_URL}/projects/delete/${projectId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        Swal.fire({
          icon:"error",
          title:"Project Delete failed",
        });
        return;
      }

     Swal.fire({
      icon:"success",
      title:"Project Deleted Successfully",
     });
     return;
      fetchProjects(); 
      if (selectedProject?.id === projectId) closeModal();
    } catch (error) {
      console.error("Delete project error:", error);
     Swal.fire({
      icon:"error",
      title:"Server Error",
     });
     return;
    }
  };

  const handleUpdate = async (userId) => {
    if (!newRole) {
      Swal.fire({
        icon:"warning",
        title:"Please enter the role",
      });
      return;
    }

    try {
      const res = await fetch(
        `${BASE_URL}/project-members/update/${selectedProject.id}/${userId}?role=${newRole}`,
        { method: "PUT" }
      );

      if (!res.ok) {
        Swal.fire({
          icon:"error",
          title:"Update failed",
        });
        return;
      }
      setEditingUser(null);
      setNewRole("");
      handleOpen(selectedProject);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div className="view-members-container">
      <h2 className="view-members-title">View Project Members</h2>

      <div className="search-section">
        <select value={searchField} onChange={(e) => setSearchField(e.target.value)}>
          <option value="id">Search By ID</option>
          <option value="name">Search By Project Name</option>
        </select>

        <input
          type={searchField === "id" ? "number" : "text"}
          placeholder="Enter search value..."
          value={searchValue}
          onChange={handleProjectSearch}
        />

        {suggestions.length > 0 && (
          <ul className="suggestion-list">
            {suggestions.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  setSearchValue(item);
                  setSuggestions([]);
                  handleProject(item);
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        )}

        <button onClick={handleProject}>Search</button>
        <button onClick={fetchProjects}>Reset</button>
      </div>

      <div className="table-wrapper">
        <table className="members-table">
          <thead>
            <tr>
              <th>Project Id</th>
              <th>Project Name</th>
              <th>Project Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projectList.map((project) => (
              <tr key={project.id}>
                <td>{project.id}</td>
                <td>{project.name}</td>
                <td>{project.description ?? "N/A"}</td>
                <td>
                  <button className="open" onClick={() => handleOpen(project)}>
                    Open
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteProject(project.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedProject && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Members of Project: {selectedProject.name}</h3>
            <p>Description: {selectedProject.description ?? "N/A"}</p>
            <button className="close-btn" onClick={closeModal}>
              Close
            </button>

            <table className="members-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projectMembers.map((member) => {
                  const isEditing = editingUser === member.user_id;
                  const isUserActive = member.isActive ===true;

                  return (
                    <tr key={`${selectedProject.id}-${member.user_id}`}>
                      <td>{member.username ?? "Unknown"}</td>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="edit-input"
                          />
                        ) : (
                          member.role ?? "N/A"
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <>
    <button
        className="button4"
        onClick={() => handleUpdate(member.user_id)}
      >
        Save
      </button>
      <button
        className="button4"
        onClick={() => setEditingUser(null)}
      >
        Cancel
      </button>
    </>
  ) : isUserActive? (
    <>
      <button
        className="button4"
        onClick={() => {
          setEditingUser(member.user_id);
          setNewRole(member.role ?? "");
        }}
      >
        Edit
      </button>
      <button
        className="delete-btn"
        onClick={() =>
          handleDelete(selectedProject.id, member.user_id)
        }
      >
        Delete
      </button>
    </>
  ) : (
    <>
      <button className="button4" disabled >
        Inactive
      </button>

    </>
  )}
</td>
</tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewProjectMembers;
