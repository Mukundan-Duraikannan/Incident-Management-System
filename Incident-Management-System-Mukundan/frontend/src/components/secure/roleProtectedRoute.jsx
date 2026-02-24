import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"
function RoleProtectedRoute({props,allowedRoles}){
    const token=localStorage.getItem("token");

    if(!token){
        return <Navigate to="/" replace/>;
    }
    const decoded=jwtDecode(token)
    const userRole=decoded.role
    if(!allowedRoles.includes(userRole)){
        return <Navigate to="/unauthorized" replace/>;
    }
    return props;
}
export default RoleProtectedRoute;