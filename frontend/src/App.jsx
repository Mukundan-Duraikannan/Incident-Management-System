// import { Routes, Route } from "react-router-dom";

// import Login from "./components/registration/login.jsx";
// import Forgotpassword from "./components/registration/forgotpassword.jsx";
// import Register from "./components/registration/register.jsx";
// import RaiseTicket from "./components/user/raiseTicket.jsx";
// import AdminDashboard from "./components/admin/adminDashboard.jsx";
// import CreateProject from "./components/admin/createProject.jsx"
// import ViewTickets from "./pages/viewTickets.jsx";
// import ViewUsers from "./pages/viewUsers.jsx";
// import ProjectMember from "./components/admin/projectMember.jsx";
// import ViewProjects from "./pages/viewProjects.jsx";
// import ViewProjectMembers from "./pages/viewProjectMembers.jsx";
// import ProtectedRoute from "./components/secure/protectedRoute.jsx";
// import RoleProtectedRoute from "./components/secure/roleProtectedRoute.jsx";
// import ResetPassword from "./components/registration/resetPassword.jsx";
// import Home from "./components/registration/home.jsx";
// import ProjectDashboard from "./components/registration/projectDashboard.jsx";
// import AssignedIssues from "./components/registration/assignedIssues.jsx";
// import ViewDashboard from "./components/registration/viewDashboard.jsx";
// import AnalyticsDashboard from "./components/admin/analyticsDashboard.jsx";
// import AdminAnalytics from "./components/registration/adminAnalytics.jsx";

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Login />} />
//       <Route path="/forgot-password" element={<Forgotpassword />} />
//       <Route path="/reset-password" element={<ResetPassword />} />
//       <Route path="/login" element={<Login/>}/>
//       <Route path="/register" element={
//         <RoleProtectedRoute allowedRoles={["user"]}>
//           <Register />
//         </RoleProtectedRoute>}/>
//       <Route path="/reset" element={<ResetPassword/>}/>
//       <Route path="/raise-ticket" element={<RaiseTicket />}/>
//       <Route path="/admin-dashboard" element={
//           <RoleProtectedRoute allowedRoles={["admin"]}>
//             <AdminDashboard />
//           </RoleProtectedRoute>
//         }/>
//       <Route path='/home' element={
//          <RoleProtectedRoute allowedRoles={["user"]}>
//           <Home/>
//          </RoleProtectedRoute>}/>
//       <Route path="/create-project" element={
//         <RoleProtectedRoute allowedRoles={["admin"]}>
//         <CreateProject/>
//         </RoleProtectedRoute>}/>
//       <Route path="/view-tickets" element={<ViewTickets />} />
//       <Route path="/view-users" element={
//         <RoleProtectedRoute allowedRoles={["admin"]}>
//         <ViewUsers/>
//         </RoleProtectedRoute>}/>
//       <Route path="/project-member" element={<ProjectMember/>}/>
//       <Route path='/view-projects' element={<ViewProjects/>}/>
//       <Route path='/projects/:projectId/assigned-issues' element={<AssignedIssues/>}/>
//       <Route path="/view-project-member" element={<ViewProjectMembers/>}/>
//        <Route 
//           path="/projects/:projectId/raise-ticket" 
//           element={<RaiseTicket />} 
//         />

//         <Route 
//           path="/projects/:projectId/members" 
//           element={<ProjectMember />} 
//         />
//       <Route path="/projects/:projectId" element={<ProjectDashboard />}/>
//       <Route path="/projects/:projectId/issues" element={<ViewTickets />} />
//       <Route path="/analytics" element={
//         <RoleProtectedRoute allowedRoles={["user"]}>
//           <AnalyticsDashboard/>
//         </RoleProtectedRoute>}>
//         </Route>
//     </Routes>
//   );
// }

// export default App;

import { Routes, Route } from "react-router-dom";

import Login from "./components/registration/login.jsx";
import Forgotpassword from "./components/registration/forgotpassword.jsx";
import Register from "./components/registration/register.jsx";
import RaiseTicket from "./components/user/raiseTicket.jsx";
import AdminDashboard from "./components/admin/adminDashboard.jsx";
import CreateProject from "./components/admin/createProject.jsx";
import ViewTickets from "./pages/viewTickets.jsx";
import ViewUsers from "./pages/viewUsers.jsx";
import ProjectMember from "./components/admin/projectMember.jsx";
import ViewProjects from "./pages/viewProjects.jsx";
import ViewProjectMembers from "./pages/viewProjectMembers.jsx";
import ResetPassword from "./components/registration/resetPassword.jsx";
import Home from "./components/registration/home.jsx";
import ProjectDashboard from "./components/registration/projectDashboard.jsx";
import AssignedIssues from "./components/registration/assignedIssues.jsx";
import ViewDashboard from "./components/registration/viewDashboard.jsx";
import AnalyticsDashboard from "./components/admin/analyticsDashboard.jsx";
import AdminAnalytics from "./components/registration/adminAnalytics.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<Forgotpassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset" element={<ResetPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/raise-ticket" element={<RaiseTicket />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/home" element={<Home />} />
      <Route path="/create-project" element={<CreateProject />} />
      <Route path="/view-tickets" element={<ViewTickets />} />
      <Route path="/view-users" element={<ViewUsers />} />
      <Route path="/project-member" element={<ProjectMember />} />
      <Route path="/view-projects" element={<ViewProjects />} />
      <Route path="/view-project-member" element={<ViewProjectMembers />} />
      <Route path="/projects/:projectId" element={<ProjectDashboard />} />
      <Route path="/projects/:projectId/issues" element={<ViewTickets />} />
      <Route
        path="/projects/:projectId/raise-ticket"
        element={<RaiseTicket />}
      />
      <Route
        path="/projects/:projectId/members"
        element={<ProjectMember />}
      />
      <Route
        path="/projects/:projectId/assigned-issues"
        element={<AssignedIssues />}
      />
      <Route path="/analytics" element={<AnalyticsDashboard />} />
      <Route path="/admin-analytics" element={<AdminAnalytics />} />
    </Routes>
  );
}
export default App;
