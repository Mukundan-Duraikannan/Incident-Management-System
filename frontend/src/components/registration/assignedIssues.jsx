import React, { useEffect, useState } from "react";

function AssignedIssues() {

  const [issues, setIssues] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchAssignedIssues();
  }, []);
  async function fetchAssignedIssues() {
    try {
      const res = await fetch(
        "http://localhost:8000/issues/assigned/me",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await res.json();
      setIssues(Array.isArray(data) ? data : []);
    } 
    catch (err) {
      console.error(err);
    }
  }
  return (
    <div className="assigned-container">
      <h2>My Assigned Issues</h2>
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
          {issues.length === 0 ? (
            <tr>
              <td colSpan="4">No assigned issues</td>
            </tr>) : (
            issues.map(issue => (
              <tr key={issue.id}>
                <td>{issue.title}</td>
                <td>{issue.description}</td>
                <td>{issue.status}</td>
                <td>{issue.priority}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AssignedIssues;
