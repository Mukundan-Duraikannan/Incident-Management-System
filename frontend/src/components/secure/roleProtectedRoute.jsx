import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"
function RoleProtectedRoute({children,allowedRoles}){
    const token=localStorage.getItem("accessToken");

    if(!token){
        return <Navigate to="/" replace/>;
    }
    try{
        const decoded=jwtDecode(token);
        if(decoded.exp*1000<Date.now()){
            localStorage.clear();
            return <Navigate to="/" replace/>;
        }
        if(!allowedRoles.includes(decoded.role)){
            return <Navigate to="/" replace/>;
        }
        return children;
    }
    catch{
        localStorage.clear();
        return <Navigate to="/" replace/>;
    }
}
export default RoleProtectedRoute;