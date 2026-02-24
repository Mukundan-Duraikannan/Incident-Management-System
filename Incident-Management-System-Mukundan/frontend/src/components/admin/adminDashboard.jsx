import "./adminDashboard.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderPlus, Folder, Ticket, Users, UserCog, LogOut } from "lucide-react";

import CreateProject from "./createProject";
import ViewProjects from "../../pages/viewProjects";
import ViewTickets from "../../pages/viewTickets";
import ViewUsers from "../../pages/viewUsers";
import ManageUser from "../registration/register";
import ViewProjectMember from "../../pages/viewProjectMembers";

function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const renderContent = () => {
    switch (activePage) {
      case "createProject":
        return <CreateProject />;
      case "viewProjects":
        return <ViewProjects />;
      case "viewTickets":
        return <ViewTickets />;
      case "viewUsers":
        return <ViewUsers />;
      case "manageUser":
        return <ManageUser />;
      case "viewProjectMember":
        return <ViewProjectMember />;
      default:
        return <h2 className="welcome-text">Welcome to Admin Dashboard</h2>;
    }
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">Admin</h2>

        <button
          className="sidebar-btn"
          onClick={() => setActivePage("createProject")}
        >
          <FolderPlus size={18} />
          Create Project
        </button>

        <button
          className="sidebar-btn"
          onClick={() => setActivePage("viewProjects")}
        >
          <Folder size={18} />
          View Projects
        </button>

        <button
          className="sidebar-btn"
          onClick={() => setActivePage("viewTickets")}
        >
          <Ticket size={18} />
          View Tickets
        </button>

        <button
          className="sidebar-btn"
          onClick={() => setActivePage("viewProjectMember")}
        >
          <Users size={18} />
          Project Members
        </button>

        <button
          className="sidebar-btn"
          onClick={() => setActivePage("viewUsers")}
        >
          <Users size={18} />
          View Users
        </button>

        <button
          className="sidebar-btn"
          onClick={() => setActivePage("manageUser")}
        >
          <UserCog size={18} />
          Manage User
        </button>
      </div>

      {/* Main Section */}
      <div className="main">
        <div className="topbar">
          <h1>Admin Dashboard</h1>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div className="content">{renderContent()}</div>
      </div>
    </div>
  );
}

export default AdminDashboard;
