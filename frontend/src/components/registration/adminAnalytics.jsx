import React, { useEffect, useState } from "react";
import {PieChart, Pie, Cell, Tooltip, ResponsiveContainer,LineChart, Line, XAxis, YAxis, CartesianGrid,BarChart, Bar, Legend} from "recharts";
import "./adminAnalytics.css";

function AdminAnalytics(){

  const token = localStorage.getItem("token");

  const [users,setUsers] = useState([]);
  const [projects,setProjects] = useState([]);
  const [issues,setIssues] = useState([]);
  const [statusData,setStatusData] = useState([]);
  const [trendData,setTrendData] = useState([]);
  const [projectData,setProjectData] = useState([]);

  useEffect(()=>{
    loadData();
  },[]);

  async function loadData(){
    const headers={Authorization:`Bearer ${token}`};
    const [u,p,i] = await Promise.all([
      fetch("http://localhost:8000/user/",{headers}),
      fetch("http://localhost:8000/projects/",{headers}),
      fetch("http://localhost:8000/tickets/",{headers})
    ]);

    const usersData = await u.json();
    const projectsData = await p.json();
    const issuesData = await i.json();

    setUsers(usersData);
    setProjects(projectsData);
    setIssues(issuesData);

    buildStatus(issuesData);
    buildTrend(issuesData);
    buildProject(issuesData);
  }
  function buildStatus(issues){
    const map={};

    issues.forEach(i=>{
      map[i.status]=(map[i.status]||0)+1;
    });

    setStatusData(
      Object.entries(map).map(([k,v])=>({name:k,value:v}))
    );
  }
  function buildTrend(issues){
    const map={};

    issues.forEach(i=>{
      const d=i.created_at?.slice(0,10);
      map[d]=(map[d]||0)+1;
    });

    setTrendData(
      Object.entries(map).map(([date,count])=>({date,count}))
    );
  }
  function buildProject(issues){
    const map={};

    issues.forEach(i=>{
      map[i.project_id]=(map[i.project_id]||0)+1;
    });

    setProjectData(
      Object.entries(map).map(([p,c])=>({project:p,issues:c}))
    );
  }

  return(
    <div className="analytics-container">

      <h2>Admin Analytics</h2>
      <div className="stats">
        <div className="stat-card">Users<br/><b>{users.length}</b></div>
        <div className="stat-card">Projects<br/><b>{projects.length}</b></div>
        <div className="stat-card">Issues<br/><b>{issues.length}</b></div>
        <div className="stat-card">
          Open Issues<br/>
          <b>{issues.filter(i=>i.status==="open").length}</b>
        </div>
      </div>
      <div className="charts">
        <div className="chart-box">
          <h3>Issues by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name">
                {statusData.map((_,i)=>(
                  <Cell key={i}/>
                ))}
              </Pie>
              <Tooltip/>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-box">
          <h3>Issues Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="date"/>
              <YAxis/>
              <Tooltip/>
              <Line type="monotone" dataKey="count"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-box">
          <h3>Issues per Project</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="project"/>
              <YAxis/>
              <Tooltip/>
              <Legend/>
              <Bar dataKey="issues"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default AdminAnalytics;