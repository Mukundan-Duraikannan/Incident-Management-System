import { useEffect, useState } from "react";
import "./viewProjects.css";
import { authFetch } from "../components/services/api";

function ViewProjects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("id");

  const fetchProjects = async () => {
    try {
      const res = await authFetch("http://localhost:8000/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");

      const data = await res.json();
      setProjects(data);

    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSearch = async () => {
    if (!search) return;

    try {
      const res = await authFetch(
        `http://localhost:8000/projects/search/${searchType}/${search}`
      );

      if (!res.ok) {
        setProjects([]);
        return;
      }
      const data = await res.json();
      setProjects(data);

    } catch (error) {
      console.error("Search error:", error);
      setProjects([]);
    }
  };

  return (
    <div className="view-projects-container">
      <h2 className="view-projects-title">View Projects</h2>
      <div className="search-section">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="id">Search By ID</option>
          <option value="name">Search By Name</option>
        </select>

        <input
          type="text"
          placeholder="Enter search value..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={handleSearch}>Search</button>
        <button onClick={fetchProjects}>Reset</button>
      </div>

      <div className="table-wrapper">
        <table className="project-table">
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Project Name</th>
              <th>Description</th>
            </tr>
          </thead>

          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-projects">
                  No projects found
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.id}</td>
                  <td>{project.name}</td>
                  <td>{project.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewProjects;
