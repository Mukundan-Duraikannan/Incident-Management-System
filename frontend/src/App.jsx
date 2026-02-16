import { Routes, Route } from "react-router-dom";
import ForgotPassword from "./pages/forgotpassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Login from "./pages/login.jsx";
import Forgotpassword from "./pages/forgotpassword.jsx";
import Register from "./pages/register.jsx";
import RaiseTicket from "./pages/raiseTicket.jsx";
import AdminDashboard from "./pages/adminDashboard.jsx";
import CreateProject from "./pages/createProject.jsx"
import ViewTickets from "./pages/viewTickets.jsx";
import ViewUsers from "./pages/viewUsers.jsx";
import ProjectMember from "./pages/projectMember.jsx";
import ViewProjects from "./pages/viewProjects.jsx";
import ViewProjectMembers from "./pages/viewProjectMembers.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<Forgotpassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/raise-ticket" element={<RaiseTicket />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      
      <Route path="/create-project" element={<CreateProject/>}/>
      <Route path="/view-tickets" element={<ViewTickets />} />
      <Route path="/view-users" element={<ViewUsers />} />
      <Route path="/project-member" element={<ProjectMember/>} />
      <Route path='/view-projects' element={<ViewProjects/>}/>
      <Route path="/view-project-member" element={<ViewProjectMembers/>} />
       <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;
