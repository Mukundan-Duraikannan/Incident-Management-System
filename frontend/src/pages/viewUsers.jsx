import React, { useEffect, useState } from "react";
import "./viewUsers.css";
import { authFetch } from "../components/services/api";
const ViewUser = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("id");
  const token = localStorage.getItem("token");
  const fetchUsers = async () => {
    try {
      const res = await authFetch("http://localhost:8000/user")

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data);

    } catch (err) {
      console.error("ERROR:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  const handleSearch = async () => {
    if (!search) return;

    try {
      const res = await authFetch(`http://localhost:8000/user/search/${searchType}/${search}`,);
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
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="id">Search By ID</option>
          <option value="name">Search By Name</option>
          <option value="email">Search By Email</option>
          <option value="role">Search By Role</option>
          <option value="status">Search By Status</option>
        </select>
        <input
          type="text"
          placeholder="Enter search value..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={handleSearch}>Search</button>
        <button onClick={fetchUsers}>Reset</button>
      </div>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-data">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`status ${
                      user.isActive ? "active" : "inactive"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>{user.role}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewUser;
