import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./viewTickets.css";

function ViewTickets() {

  const { projectId } = useParams();

  const [tickets, setTickets] = useState([]);
  const [members, setMembers] = useState([]);
  const [myRole, setMyRole] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {

    if (projectId) {
      fetchTickets();
      fetchMembers();
    }

  }, [projectId]);

  async function fetchTickets() {

    try {

      const res = await fetch(
        `http://localhost:8000/issues/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      setTickets(Array.isArray(data) ? data : []);

    } catch (err) {

      console.error(err);
      setTickets([]);

    }

  }
  async function fetchMembers() {

    try {

      const res = await fetch(
        `http://localhost:8000/projects/${projectId}/members`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      const memberList = Array.isArray(data) ? data : [];

      setMembers(memberList);
      const payload = JSON.parse(atob(token.split(".")[1]));

      const me = memberList.find(
        m => m.user_id === payload.user_id
      );

      if (me) {
        setMyRole(me.role.toLowerCase());
      }

    } catch (err) {

      console.error(err);
      setMembers([]);

    }

  }
  async function assignIssue(issueId) {

    const userId =
      document.getElementById(`user-${issueId}`).value;

    const priority =
      document.getElementById(`priority-${issueId}`).value;

      const payload = JSON.parse(atob(token.split(".")[1]));

    if (!userId || !priority) {

      alert("Select user and priority");
      return;

    }


    try {

      const res = await fetch(
        `http://localhost:8000/issues/${issueId}/assign?project_id=${projectId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
    body: JSON.stringify({
      user_id: parseInt(userId),
      manager_id: payload.user_id,
      priority: priority.toLowerCase()
      })
        }
      );


      if (res.ok) {

        alert("Issue assigned successfully");

        fetchTickets();

      } else {

        const err = await res.json();

        alert(err.detail || "Assignment failed");

      }

    } catch (err) {

      console.error(err);
      alert("Server error");

    }

  }


  return (

    <div className="tickets-container">

      <h2>Project Issues</h2>

      <table className="tickets-table">

        <thead>

          <tr>

            <th>Title</th>
            <th>Status</th>
            <th>Select User</th>
            <th>Priority</th>
            <th>Assign</th>

          </tr>

        </thead>

        <tbody>

          {tickets.length === 0 ? (

            <tr>
              <td colSpan="4">No Issues Found</td>
            </tr>

          ) : (

            tickets.map(ticket => (

              <tr key={ticket.id}>

                <td>{ticket.title}</td>

                <td>{ticket.status}</td>

                <td>{ticket.priority}</td>

                <td>

  {myRole === "manager" ? (

    <div className="assign-box">

      <select
        id={`user-${ticket.id}`}
        defaultValue=""
        disabled={ticket.status === "Assigned"}
      >
        <option value="" disabled>
          Select User
        </option>

        {members.map(member => (
          <option
            key={member.user_id}
            value={member.user_id}
          >
            {member.name} (ID: {member.user_id})
          </option>
        ))}

      </select>

      <select
        id={`priority-${ticket.id}`}
        defaultValue=""
        disabled={ticket.status === "Assigned"}
      >
        <option value="" disabled>
          Select Priority
        </option>

        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>

      </select>

      <button
        className="assign-btn"
        disabled={ticket.status === "Assigned"}
        onClick={() => assignIssue(ticket.id)}
      >
        {ticket.status === "Assigned" ? "Assigned" : "Assign"}
      </button>

    </div>

  ) : (

    <span className="manager-only">
      Manager Only
    </span>

  )}

</td>


              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );

}

export default ViewTickets;
