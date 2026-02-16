import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProjectMembers(){
  const {projectId}=useParams();
  const [members,setMembers]=useState([]);
  const token=localStorage.getItem("token");
  useEffect(()=>{
    fetchMembers();
  },[]);

  async function fetchMembers() {
    try{
      const res=await fetch(
        `http://localhost:8000/projects/${projectId}/members`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data=await res.json()
      setMembers(data);
    }
    catch(error){
      console.error(error);
    }
  }
return (
    <div>
      <h2>Project Members</h2>

      {members.length === 0 ? (
        <p>No members found</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {members.map(member => (
              <tr key={member.user_id}>
                <td>{member.user_id}</td>
                <td>{member.role}</td>
              </tr>
            ))}
          </tbody>

        </table>
      )}

    </div>
  );
}

export default ProjectMembers;