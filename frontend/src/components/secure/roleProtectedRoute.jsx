import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"
function RoleProtectedRoute({children,allowedRoles}){
    const token=localStorage.getItem("token");

    if(!token){
        return <Navigate to="/" replace/>;
    }
    const decoded=jwtDecode(token)
    console.log(decoded);
    const userRole=decoded.role
    console.log(userRole);
    if(!allowedRoles.includes(userRole)){
        return <Navigate to="/" replace/>;
    }
    return children;
}
export default RoleProtectedRoute;