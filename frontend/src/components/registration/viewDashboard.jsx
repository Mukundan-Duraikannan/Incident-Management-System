import React, { useEffect, useState } from "react";
import "./viewDashboard.css";
 
const ViewDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("id");
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const adminId = 1;
 
    fetch(`http://localhost:8000/dashboard/admin/${adminId}`)
      .then((res) => {
        console.log("Response Status:", res.status);
        if (!res.ok) {
          throw new Error("Failed to fetch dashboard");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Dashboard Response:", data);
 
        if (!data || !data.projects) {
          console.log("No projects found in response");
          setLoading(false);
          return;
        }
 
        let allIssues = [];
 
        data.projects.forEach((project) => {
          if (!project.issues) return;
 
          project.issues.forEach((issue) => {
            allIssues.push({
              issue_id: issue.issue_id,
              title: issue.title,
              status: issue.status,
              priority: issue.priority,
              project_name: project.project_name || "-",
              raised_by: issue.raised_by?.name || "-",
              assigned_to: issue.assigned_to?.name || "-"
            });
          });
        });
 
        console.log("Flattened Issues:", allIssues);
 
        setIssues(allIssues);
        setFilteredIssues(allIssues);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
        setLoading(false);
      });
 
  }, []);
 
  const handleSearch = () => {
    const filtered = issues.filter((issue) => {
      if (searchType === "id") {
        return issue.issue_id?.toString().includes(search);
      }
 
      if (searchType === "project") {
        return issue.project_name
          ?.toLowerCase()
          .includes(search.toLowerCase());
      }
 
      if (searchType === "raised") {
        return issue.raised_by
          ?.toLowerCase()
          .includes(search.toLowerCase());
      }
 
      if (searchType === "assigned") {
        return issue.assigned_to
          ?.toLowerCase()
          .includes(search.toLowerCase());
      }
 
      return false;
    });
 
    setFilteredIssues(filtered);
  };
 
  const handleReset = () => {
    setSearch("");
    setFilteredIssues(issues);
  };
 
  const getPriorityClass = (priority) => {
    if (!priority) return "";
    const p = priority.toLowerCase();
 
    if (p === "high") return "priority-high";
    if (p === "medium") return "priority-medium";
    if (p === "low") return "priority-low";
 
    return "";
  };
 
  return (
    <div className="admin-wrapper">
      <div className="admin-container">
        <h1 className="admin-title">Admin Dashboard</h1>
 
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="admin-search-section">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="id">Search By ID</option>
                <option value="project">Search By Project</option>
                <option value="raised">Search By Raised By</option>
                <option value="assigned">Search By Assigned To</option>
              </select>
 
              <input
                type="text"
                placeholder="Enter search value..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
 
              <button onClick={handleSearch}>Search</button>
              <button className="reset-btn" onClick={handleReset}>
                Reset
              </button>
            </div>
 
            <div className="admin-table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Issue ID</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Project</th>
                    <th>Raised By</th>
                    <th>Assigned To</th>
                  </tr>
                </thead>
 
                <tbody>
                  {filteredIssues.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="no-data">
                        No issues found
                      </td>
                    </tr>
                  ) : (
                    filteredIssues.map((issue) => (
                      <tr key={issue.issue_id}>
                        <td>{issue.issue_id}</td>
                        <td>{issue.title}</td>
                        <td>{issue.status}</td>
                        <td>
                          <span
                            className={`priority ${getPriorityClass(issue.priority)}`}
                          >
                            {issue.priority}
                          </span>
                        </td>
                        <td>{issue.project_name}</td>
                        <td>{issue.raised_by}</td>
                        <td>{issue.assigned_to}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
 
export default ViewDashboard;