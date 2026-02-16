import { useEffect, useState } from "react";
import "./viewTickets.css";

function ViewTickets() {

  const [tickets, setTickets] = useState([]);
  const [searchId, setSearchId] = useState("");

  const token = localStorage.getItem("token");
  const fetchTickets = async () => {

    if (!token) {
      alert("Please login first");
      return;
    }

    try {

      const res = await fetch("http://localhost:8000/issues/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        console.log("Error fetching tickets");
        setTickets([]);
        return;
      }

      const data = await res.json();

      console.log("All tickets:", data);

      setTickets(Array.isArray(data) ? data : []);

    }
    catch (error) {
      console.error(error);
      setTickets([]);
    }

  };

  const handleSearch = async () => {

    if (!searchId) {
      fetchTickets();
      return;
    }

    try {

      const res = await fetch(
        `http://localhost:8000/issues/${searchId}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (!res.ok) {
        alert("Issue not found");
        setTickets([]);
        return;
      }

      const data = await res.json();

      setTickets([data]);

    }
    catch (error) {
      console.error(error);
      setTickets([]);
    }

  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (

    <div className="view-tickets-container">

      <h2 className="view-tickets-title">View Tickets</h2>

      <div className="search-section">

        <input
          type="number"
          placeholder="Enter Issue ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />

        <button onClick={handleSearch}>
          Search
        </button>

        <button onClick={fetchTickets}>
          Reset
        </button>

      </div>
      <div className="table-wrapper">

        <table className="ticket-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Project ID</th>
              <th>Raised By</th>
              <th>Assigned To</th>
            </tr>
          </thead>

          <tbody>

            {tickets.length === 0 ? (

              <tr>
                <td colSpan="7" className="no-tickets">
                  No tickets found
                </td>
              </tr>

            ) : (

              tickets.map((ticket) => (

                <tr key={ticket.id}>

                  <td>{ticket.id}</td>

                  <td>{ticket.title}</td>

                  <td>{ticket.description}</td>

                  <td>{ticket.status}</td>

                  <td>{ticket.project_id}</td>

                  <td>{ticket.raised_by}</td>

                  <td>
                    {ticket.assigned_to
                      ? ticket.assigned_to
                      : "Not assigned"}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default ViewTickets;
