import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Legend
} from "recharts";
import "./adminAnalytics.css";
import { authFetch } from "../services/api";

const PIE_COLORS = ["#0369a1", "#0284c7", "#38bdf8", "#7dd3fc"];

function AdminAnalytics() {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [projectData, setProjectData] = useState([]);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const [u, p, i] = await Promise.all([
      authFetch("http://localhost:8000/user/"),
      authFetch("http://localhost:8000/projects/"),
      authFetch("http://localhost:8000/tickets/")
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

  function buildStatus(issues) {
    const map = {};
    issues.forEach(i => { map[i.status] = (map[i.status] || 0) + 1; });
    setStatusData(Object.entries(map).map(([k, v]) => ({ name: k, value: v })));
  }

  function buildTrend(issues) {
    const map = {};
    issues.forEach(i => { const d = i.created_at?.slice(0, 10); map[d] = (map[d] || 0) + 1; });
    setTrendData(Object.entries(map).map(([date, count]) => ({ date, count })));
  }

  function buildProject(issues) {
    const map = {};
    issues.forEach(i => { map[i.project_id] = (map[i.project_id] || 0) + 1; });
    setProjectData(Object.entries(map).map(([p, c]) => ({ project: p, issues: c })));
  }

  const stats = [
    { label: "Total Users",  value: users.length,                                    icon: "👥" },
    { label: "Projects",     value: projects.length,                                  icon: "📁" },
    { label: "Total Issues", value: issues.length,                                    icon: "🐛" },
    { label: "Open Issues",  value: issues.filter(i => i.status === "open").length,   icon: "🔓" },
  ];

  return (
    <div className="aa-page">

      <div className="aa-header">
        <div>
          <p className="aa-eyebrow">Dashboard Overview</p>
          <h1 className="aa-title">Analytics</h1>
        </div>
        <span className="aa-badge">Admin Panel</span>
      </div>

      <div className="aa-stats">
        {stats.map((st, idx) => (
          <div key={idx} className={`aa-card${idx === 0 ? " aa-card--blue" : ""}`}>
            <span className="aa-card-icon">{st.icon}</span>
            <span className="aa-card-value">{st.value}</span>
            <span className="aa-card-label">{st.label}</span>
          </div>
        ))}
      </div>

      <div className="aa-charts">
        <div className="aa-chart-box">
          <h3 className="aa-chart-title">Issues by Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={105} paddingAngle={4}>
                {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="aa-chart-box">
          <h3 className="aa-chart-title">Issues Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#0369a1" strokeWidth={2.5} dot={{ fill: "#0369a1", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="aa-chart-box aa-chart-box--wide">
          <h3 className="aa-chart-title">Issues per Project</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={projectData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
              <XAxis dataKey="project" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="issues" fill="#0369a1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

export default AdminAnalytics;