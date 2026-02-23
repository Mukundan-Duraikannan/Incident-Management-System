import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid,
  ResponsiveContainer, Legend
} from "recharts";
import './analyticsDashboard.css'

function AnalyticsDashboard() {

  const [data, setData] = useState([]);
  const [projectStatus,setProjectStatus] = useState([]);
  const totalProjects = data.length;
  const totalUsers = data.reduce((a, b) => a + b.users, 0);
  const totalIssues = data.reduce((a, b) => a + b.issues, 0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8000/analytics/projects", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(d => {
        if (Array.isArray(d)) setData(d);
      })
      .catch(console.log);
  }, []);
  const chartData = [...data]
    .sort((a, b) => b.issues - a.issues)
    .slice(0, 10);
    
  return (
    <div className="analytics-container">
      <h2>Project Analytics</h2>
      <div className="summary-grid">
        <div className="card projects">
          <h4>Total Projects</h4>
          <h2>{totalProjects}</h2>
        </div>
        <div className="card users">
          <h4>Total Users</h4>
          <h2>{totalUsers}</h2>
        </div>
        <div className="card issues">
          <h4>Total Issues</h4>
          <h2>{totalIssues}</h2>
        </div>
      </div>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={chartData}
                layout="vertical"
                margin={{ left: 40 }}
            >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            dataKey="project"
            type="category"
            width={150}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="users" name="Users" fill="#93c5fd" />
          <Bar dataKey="issues" name="Issues" fill="#2563eb" />
        </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;