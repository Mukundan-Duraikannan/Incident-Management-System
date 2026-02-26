import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './projectMember.css'
import { authFetch } from "../services/api";
function ProjectMembers(){
  const {projectId}=useParams();
  const [members,setMembers]=useState([]);

  useEffect(()=>{
    fetchMembers();
  },[]);

  async function fetchMembers() {
    try{
    const res = await authFetch(
    `http://localhost:8000/projects/${projectId}/members`
    );

      const data=await res.json()
      setMembers(data);
    }
    catch(error){
      console.error(error);
    }
  }
return (
  <div className="project-members-container">

    <h2 className="project-members-title">
      Project Members
    </h2>

    <div className="project-members-card">

      {members.length === 0 ? (
        <div className="no-members-text">No members found</div>
      ) : (

        <table className="project-members-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {members.map(member => (
              <tr key={member.user_id}>
                <td>{member.user_id}</td>
                <td>{member.name}</td>
                <td>{member.role}</td>
              </tr>
            ))}
          </tbody>
        </table>

      )}

    </div>
  </div>
);
}
export default ProjectMembers;