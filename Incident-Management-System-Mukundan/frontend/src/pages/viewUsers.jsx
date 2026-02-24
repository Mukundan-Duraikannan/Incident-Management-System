import { useEffect, useState } from "react";
import { Search, RotateCcw, Pencil, Trash2, Save, X, } from "lucide-react";
import Swal from "sweetalert2";
import "./viewUsers.css";

function ViewUser() {
  const BASE_URL = "http://127.0.0.1:8000";

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("access_token");

  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("id");


  const fetchUsers = async () => {
    const res = await fetch(`${BASE_URL}/user/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will change user status.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#0284c7",
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    await fetch(`${BASE_URL}/user/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchUsers();
  };


  const handleUpdate = async () => {
    try {
      const res = await fetch(`${BASE_URL}/user/${editingUser}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName || undefined,
          email: editEmail || undefined,
        }),
      });

      const errorData = await res.json();

      if (!res.ok) {

        console.error(errorData);
        Swal.fire("Error", "Update failed", "error");
        return;
      }

      Swal.fire("Success", "User updated successfully", "success")

      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Update error:", err);
    }
  };


  const filteredUsers = users.filter((user) => {
    if (!search) return true;

    if (searchType === "id") {
      return user.id.toString().includes(search);
    }

    if (searchType === "name") {
      return user.name
        .toLowerCase()
        .includes(search.toLowerCase());
    }

    if (searchType === "email") {
      return user.email
        .toLowerCase()
        .includes(search.toLowerCase());
    }

    return true;
  });

  return (
    <div className="view-users-container">
      <h2 className="page-title">View Users</h2>

      {/* ===== SEARCH BAR (Like ViewProjects) ===== */}
      <div className="search-bar">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="id">Search by ID</option>
          <option value="name">Search by Name</option>
          <option value="email">Search by Email</option>
        </select>

        <div className="search-input-wrapper">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          className="reset-btn"
          onClick={() => setSearch("")}
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {/* ===== TABLE ===== */}

      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>

                <td>
                  {editingUser === user.id ? (
                    <input
                      value={editName}
                      onChange={(e) =>
                        setEditName(e.target.value)
                      }
                    />
                  ) : (
                    user.name
                  )}
                </td>

                <td>
                  {editingUser === user.id ? (
                    <input
                      value={editEmail}
                      onChange={(e) =>
                        setEditEmail(e.target.value)
                      }
                    />
                  ) : (
                    user.email
                  )}
                </td>

                <td>
                  {user.isActive ? "Active" : "Inactive"}
                </td>

                <td className="action-buttons">
                  <button
                    onClick={() => {
                      setEditingUser(user.id);
                      setEditName(user.name);
                      setEditEmail(user.email);
                    }}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 size={16} />
                  </button>

                  {editingUser === user.id && (
                    <>
                      <button onClick={handleUpdate}>
                        <Save size={16} />
                      </button>

                      <button
                        onClick={() =>
                          setEditingUser(null)
                        }
                      >
                        <X size={16} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewUser;