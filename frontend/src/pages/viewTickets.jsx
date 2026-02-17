import { useEffect, useState } from "react";
import "./viewTickets.css";
import Swal from "sweetalert2";
function ViewTickets() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("id");
  const [editTicket, setEditTicket] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const fetchTickets = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/tickets/view");
      const data = await res.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
      setTickets([]);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleDelete = async (id) => {
    await fetch(`http://127.0.0.1:8000/tickets/delete/${id}`, {
      method: "DELETE",
    });

    Swal.fire({
      icon:"success",
      title:"Ticket Deleted Successfully",
    });
    return;
    fetchTickets();
  };

 const handleUpdate = async () => {
  if (!editTicket) return;

  const payload = {
    project_title: editTicket.project_title,
    issue: editTicket.issue,
    category: editTicket.category,
    status: editTicket.status,
  };

  try {
    const res = await fetch(
      `http://127.0.0.1:8000/tickets/update/${editTicket.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.error("Update failed:", err);
      Swal.fire({
        icon:"error",
        title:"Update Failed",
      });
      return;
    }

    Swal.fire({
      icon:"success",
      title:"Update Successful",
    });
    return;
    setEditTicket(null);
    fetchTickets();
  } catch (error) {
    console.error("Update error:", error);
  }
};

 const handleSearchChange = (e) => {
  const value = e.target.value;
  setSearch(value);

  if (!value) {
    setSuggestions([]);
    return;
  }
const filtered = tickets
  .map((ticket) => {
    switch (searchType) {
      case "email":
        return ticket.email;
      case "project_title":
        return ticket.project_title;
      case "issue":
        return ticket.issue;
      case "category":
        return ticket.category;
      case "status":
        return ticket.status;
      case "created_at":
        return formatISTDate(ticket.created_at); 
      default:
        return ticket.id?.toString();
    }
  })
  .filter(
    (item) =>
      item &&
      item.toLowerCase().includes(value.toLowerCase())
  );

setSuggestions([...new Set(filtered)]);
ns([...new Set(filtered)]);
};

 const handleSearch = async (value = search) => {
  if (!value) return;

  try {
    const res = await fetch(
      `http://127.0.0.1:8000/tickets/search/${searchType}/${value}`
    );

    if (!res.ok) {
      setTickets([]);
      return;
    }

    const data = await res.json();
    setTickets(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Search error:", error);
    setTickets([]);
  }
};
const formatISTDate = (dateValue) => {
  if (!dateValue) return "-";
  const date = new Date(dateValue + "Z");
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};
  return (
    <div className="view-tickets-container">
      <h2 className="view-tickets-title">View Tickets</h2>

      <div className="search-section">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}>
          <option value="id">Search By ID</option>
          <option value="email">Search By Email</option>
          <option value="project_title">Search By Project Title</option>
          <option value="issue">Search By Issue</option>
          <option value="category">Search By Category</option>
          <option value="status">Search By Status</option>
            <option value="created_at">Search By Created Date</option>
        </select>

        <input
  type={searchType === "id" ? "number" : "text"}
  placeholder="Enter search value..."
  value={search}
  onChange={handleSearchChange}/>

{suggestions.length > 0 && (
  <ul className="suggestion-list">
    {suggestions.map((item, index) => (
      <li 
        key={index}
        onClick={() => {
          setSearch(item);
          setSuggestions([]);
           handleSearch(item);
        }}
      >
        {item}
      </li>
    ))}
  </ul>
)}


        <button onClick={handleSearch}>Search</button>
        <button onClick={fetchTickets}>Reset</button>
      </div>

      <div className="table-wrapper">
        <table className="ticket-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Project Title</th>
              <th>Issue</th>
              <th>Category</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
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
                  <td>{ticket.email}</td>
                  <td>
                    {editTicket?.id === ticket.id ? (
                      <input
                        value={editTicket.project_title}
                         className="edit-input"
                        onChange={(e) =>
                          setEditTicket({
                            ...editTicket,
                            project_title: e.target.value,
                          })
                        }
                      />
                    ) : (
                      ticket.project_title
                    )}
                  </td>
                  <td>
                    {editTicket?.id === ticket.id ? (
                      <input
                        value={editTicket.issue}
                         className="edit-input"
                        onChange={(e) =>
                          setEditTicket({
                            ...editTicket,
                            issue: e.target.value,
                          })
                        }
                      />
                    ) : (
                      ticket.issue
                    )}
                  </td>

                  <td>
                    {editTicket?.id === ticket.id ? (
                      <input
                        value={editTicket.category}
                         className="edit-input"
                        onChange={(e) =>
                          setEditTicket({
                            ...editTicket,
                            category: e.target.value,
                          })
                        }
                      />
                    ) : (
                      ticket.category
                    )}
                  </td>

                  <td>
                    {editTicket?.id === ticket.id ? (
                      <input
                        value={editTicket.status}
                         className="edit-input"
                        onChange={(e) =>
                          setEditTicket({
                            ...editTicket,
                            status: e.target.value,
                          })
                        }
                      />
                    ) : (
                      ticket.status
                    )}
                  </td>

                  <td>{formatISTDate(ticket.created_at)}</td>
                  <td>
                    {editTicket?.id === ticket.id ? (
                      <>
                        <button onClick={handleUpdate} className="button4">Save</button>
                        <button  className="button4" onClick={() => setEditTicket(null)}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="button4"  onClick={() =>
    setEditTicket({
      ...ticket, 
    })
  }>
                          Edit
                        </button>
                        <button  className="delete-btn" onClick={() => handleDelete(ticket.id)}>
                          Delete
                        </button>
                      </>
                    )}
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
