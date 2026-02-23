import React, { useEffect, useState } from "react";
import './assignedIssues.css'
import Swal from "sweetalert2";
function AssignedIssues() {
  const [issues, setIssues] = useState([]);
  const token = localStorage.getItem("token");
 
  useEffect(() => {
    fetchAssignedIssues();
  }, []);
 
  async function fetchAssignedIssues() {
    try {
      const res = await fetch("http://localhost:8000/issues/assigned/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setIssues(Array.isArray(data) ? data : []);
    } 
    catch (err) {
      console.error(err);
    }
  }
 
  async function handleStatusChange(issueId, newStatus) {
    try {
      const res = await fetch(`http://localhost:8000/issues/${issueId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        status: newStatus
      })
    });
 
      if (!res.ok) 
          throw new Error("Status update failed");

      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === issueId ? { ...issue, status: newStatus } : issue
        )
      );
      console.log("Manager notified about status change");
    } 
    catch (error) 
    {
      console.error(error);
      Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: "Failed to update status"
    });
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
            </tr>
          ) : (
            issues.map((issue) => (
              <tr key={issue.id}>
                <td>{issue.title}</td>
                <td>{issue.description}</td>
 
                <td>
                  <select
                    className="status-select"
                    value={issue.status}
                    onChange={(e) =>
                      handleStatusChange(issue.id, e.target.value)
                    }
                  >
                     <option value="Open">Open</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
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