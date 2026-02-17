import React, { useEffect, useState } from "react";
import "./viewUsers.css";
import Swal from "sweetalert2";
function ViewUser() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [suggestions, setSuggestions] = useState([]);

  const token = localStorage.getItem("token");


  const fetchUsers = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/view-users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  

  const handleDelete = async (id) => {
  const result1 = await Swal.fire({
    title: "Are you sure?",
    text: "This will disable the User.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
  });
  
  if (!result1.isConfirmed) return;

  await fetch(`http://127.0.0.1:8000/user/delete/${id}`, {
    method: "DELETE",
  });

  Swal.fire({
    icon:"success",
    title:"User Disabled successfully",
  });
  return;
  fetchUsers();
};

  const handleChange = (e) => {
  const value = e.target.value;
  setSearch(value);

  if (!value) {
    setSuggestions([]);
    return;
  }

  const filtered = users
    .map((user) => {
      switch (searchType) {
        case "email":
          return user.email;
        case "role":
          return user.role;
        case "name":
          return user.name;
        default:
          return user.id?.toString();
      }
    })
    .filter(
      (item) =>
        item &&
        item.toLowerCase().includes(value.toLowerCase())
    );

  setSuggestions([...new Set(filtered)]);
};

  const handleUpdate = async () => {
    await fetch(`http://127.0.0.1:8000/user/${editUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editUser),
    });

    setEditUser(null);
    fetchUsers();
  };

const handleSearchUser = async (value = search) => {
  if (!value) return;

  try {
    const res = await fetch(
      `http://127.0.0.1:8000/user/search/${searchType}/${value}`
    );

    if (!res.ok) {
      setUsers([]);
      return;
    }

    const data = await res.json();
    setUsers(data);
  } catch (error) {
    console.error("Search error:", error);
    setUsers([]);
  }
};

  return (
  <div className="view-users-container">
  <h2 className="users-title">View Users</h2>

  <div className="search-section">
    <select
      className="search-select"
      value={searchType}
      onChange={(e) => {
        setSearchType(e.target.value);
        
      }}
    >
      <option value="name">Search by Name</option>
      <option value="email">Search by Email</option>
      <option value="role">Search by Role</option>
    </select>

    <input
      className="search-input"
      type="text"
      placeholder="Enter search value..."
      value={search}
      onChange={handleChange}
    />

    {suggestions.length > 0 && (
      <ul className="suggestion-list">
        {suggestions.map((item, index) => (
          <li
            className="suggestion-item"
            key={index}
            onClick={() => {
              setSearch(item);
              setSuggestions([]);
              handleSearchUser(item);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    )}
    
        <button onClick={handleSearchUser}>Search</button>
        <button onClick={fetchUsers}>Reset</button>
      </div>


  <table className="users-table">
    <thead>
      <tr>
        <th>Id</th>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
        <th>IsActive</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  

          <td>
            {editUser?.id === user.id ? (
              <input
                className="edit-input"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
              />
            ) : (
              user.email
            )}
          </td>

          <td>{user.role}</td>
          <td>
  {user.isActive ? "Active" : "Disabled"}
</td>

          <td>
            {editUser?.id === user.id ? (
              <>
                <button className="button4" onClick={handleUpdate}>
                  Save
                </button>
                <button
                  className="button4"
                  onClick={() => setEditUser(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  className="button4"
                  onClick={() => setEditUser(user)}
                >
                  Edit
                </button>
                <button
  className="delete-btn"
  disabled={!user.isActive}
  onClick={() => handleDelete(user.id)}
>
  {user.isActive ? "Delete" : "Disabled"}
</button>

              </>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
}

export default ViewUser;
