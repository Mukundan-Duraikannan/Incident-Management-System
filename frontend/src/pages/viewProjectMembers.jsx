import { useEffect, useState } from "react";
import "./viewProjectMembers.css";

function ViewProjectMembers() {
  const BASE_URL = "http://localhost:8000";

  const [projectList, setProjectList] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [searchField, setSearchField] = useState("project");
  const [searchValue, setSearchValue] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${BASE_URL}/project-members/view`);
      const data = await res.json();
      setProjectList(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSearch = async () => {
    if (!searchValue) {
      fetchProjects();
      return;
    }

    try {
      const res = await fetch(
        `${BASE_URL}/project-members/search/${searchField}/${searchValue}`
      );

      if (!res.ok) {
        setProjectList([]);
        return;
      }

      const data = await res.json();
      setProjectList(data);
    } catch (error) {
      console.error("Search error:", error);
      setProjectList([]);
    }
  };

  const handleOpen = async (projectId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/project-members/${projectId}`
      );
      const data = await response.json();

      setProjectMembers(data);
      setSelectedProjectId(projectId);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  return (
    <div className="view-members-container">
      <h2 className="view-members-title">View Project Members</h2>

      <div className="search-section">
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
        >
          <option value="project">Project Name</option>
          <option value="id">Project Id</option>
          
        </select>

        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <button onClick={handleSearch}>Search</button>
        <button onClick={fetchProjects}>Reset</button>
      </div>

      <div className="table-wrapper">
        <table className="members-table">
          <thead>
            <tr>
              <th>Project Id</th>
              <th>Project Name</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {projectList.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-members">
                  No projects found
                </td>
              </tr>
            ) : (
              projectList.map((project) => (
                <tr key={project.id}>
                  <td>{project.id}</td>
                  <td>{project.name}</td>
                  <td>
                    <button
                      className="open"
                      onClick={() => handleOpen(project.id)}
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedProjectId && (
        <div className="members-section">
          <h3>Project Members</h3>

          <table className="members-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
              </tr>
            </thead>

            <tbody>
              {projectMembers.length === 0 ? (
                <tr>
                  <td colSpan="2">No members found</td>
                </tr>
              ) : (
                projectMembers.map((member, index) => (
                  <tr key={index}>
                    <td>{member.username}</td>
                    <td>{member.role}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ViewProjectMembers;
