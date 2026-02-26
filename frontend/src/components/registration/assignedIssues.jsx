import React, { useEffect, useState } from "react";
import './assignedIssues.css'
import { Search, RotateCcw, Pencil, Trash2, Save, X } from "lucide-react";
import { authFetch } from "../services/api";
function AssignedIssues() {
  const [issues, setIssues] = useState([]);
const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("title");
  useEffect(() => {
    fetchAssignedIssues();
  }, []);
 
  async function fetchAssignedIssues() {
    try {
      const res = await authFetch("http://localhost:8000/issues/assigned/me");
      const data = await res.json();
      setIssues(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }
 
  async function handleStatusChange(issueId, newStatus) {
    try {
     const res = await authFetch(
  `http://localhost:8000/issues/${issueId}/status`,
  {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus })
  }
);
 
      if (!res.ok) throw new Error("Status update failed");
 
     
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === issueId ? { ...issue, status: newStatus } : issue
        )
      );
 
 
      console.log("Manager notified about status change");
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  }
const filteredIssues = issues.filter((issue) => {
    if (!search) return true;
 
    if (searchType === "title") {
      return issue.title
        ?.toLowerCase()
        .includes(search.toLowerCase());
    }
 
    if (searchType === "status") {
      return issue.status
        ?.toLowerCase()
        .includes(search.toLowerCase());
    }
 
    if (searchType === "priority") {
      return issue.priority
        ?.toLowerCase()
        .includes(search.toLowerCase());
    }
 
    return true;
  });
 
 
  return (
    <div className="assigned-container">
      <h2>My Assigned Issues</h2>
<div className="assigned-search-bar">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="title">Search by Title</option>
          <option value="status">Search by Status</option>
          <option value="priority">Search by Priority</option>
        </select>
 
        <div className="search-input-assign">
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
 
 
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Priority</th>
          </tr>
        </thead>
 
        <tbody>
          {filteredIssues.length === 0 ? (
            <tr>
              <td colSpan="4">No assigned issues</td>
            </tr>
          ) : (
            filteredIssues.map((issue) => (
              <tr key={issue.id}>
                <td>{issue.title}</td>
                <td>{issue.description}</td>
 
                <td>
                  <select className="status-select" value={issue.status} onChange={(e) =>
                  handleStatusChange(issue.id, e.target.value)
                }
              >
  <option value="Assigned">Assigned</option>
  <option value="Open">Open</option>
  <option value="InProgress">InProgress</option>
  <option value="Resolved">Resolved</option>
  <option value="Closed">Closed</option>
</select>
                </td>
 
                <td className="priority">{issue.priority}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
 
export default AssignedIssues;