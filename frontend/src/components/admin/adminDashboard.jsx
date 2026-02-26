import './adminDashboard.css';
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const manageUser = () => {
    navigate("/register");
  };

  const createProject = () => {
    navigate("/create-project");
  };
  const viewtickets = () => {
    navigate("/view-tickets");
  }
  const viewusers = () => {
    navigate("/view-users");
  } 
  const viewprojects =() => {
    navigate("/view-projects");
  }
  const viewprojectmember=() => {
    navigate("/view-project-member");
  }
  const handleLogout=()=>{
    localStorage.clear();
    navigate("/login")
  }
  const analytics=()=>{
    navigate("/analytics")
  }
  return (
    <div className="dash">
      <button onClick={handleLogout}>
        Logout 
      </button>
      <h1 className="admin-dashboard">Admin Dashboard</h1>

      <div className="dashboard-container">
        <button className="dashboard-card" onClick={createProject}>Create Project</button>
        <button className="dashboard-card" onClick={viewprojects} >View Projects</button>
        <button className="dashboard-card" onClick={viewtickets}>View Tickets</button>
        <button className="dashboard-card" onClick={viewprojectmember}>View Project Team members</button>
        <button className="dashboard-card" onClick={viewusers}>View Users</button>
        <button className="dashboard-card" onClick={manageUser}>Manage User</button>
        <button className="dashboard-card" onClick={analytics}>Analytics</button>
      </div>
    </div>
  );
}

export default AdminDashboard;
