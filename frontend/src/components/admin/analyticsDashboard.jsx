import { useEffect, useState } from "react";
import {
  PieChart, Pie, Tooltip, Cell,
  BarChart, Bar, XAxis, YAxis,
  LineChart, Line, CartesianGrid,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AnalyticsDashboard() {

  const [issues, setIssues] = useState([]);

  const [analytics, setAnalytics] = useState({status:[],priority:[],trend:[]});
  useEffect(() => {
    fetch("http://localhost:8000/issues/")
      .then(res => res.json())
      .then(data => {
        setIssues(data);
        generateAnalytics(data);
      })
      .catch(err => console.log(err));
  }, []);
  const generateAnalytics = (issues) => {
    const statusCounts = {};
    issues.forEach(i => {
      const s = i.status || "Unknown";
      statusCounts[s] = (statusCounts[s] || 0) + 1;
    });
    const status = Object.keys(statusCounts).map(k => ({
      name: k,
      value: statusCounts[k]
    }));
    const priorityCounts = {};
    issues.forEach(i => {
      const p = i.priority || "Unknown";
      priorityCounts[p] = (priorityCounts[p] || 0) + 1;
    });
    const priority = Object.keys(priorityCounts).map(k => ({
      name: k,
      value: priorityCounts[k]
    }));
    const trendMap = {};
    issues.forEach(i => {
      if (!i.created_at) return;
      const month = new Date(i.created_at)
        .toLocaleString("default", { month: "short" });
      trendMap[month] = (trendMap[month] || 0) + 1;
    });
    const trend = Object.keys(trendMap).map(m => ({
      month: m,
      incidents: trendMap[m]
    }));
    setAnalytics({ status, priority, trend });
  };
  return (
    <div style={{ padding: 20 }}>
      <h2>Analytics Dashboard</h2>
      <div style={{ width: "100%", height: 300 }}>
        <h3>Incidents by Status</h3>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={analytics.status}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
            >
              {analytics.status.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ width: "100%", height: 300 }}>
        <h3>Priority Distribution</h3>
        <ResponsiveContainer>
          <BarChart data={analytics.priority}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ width: "100%", height: 300 }}>
        <h3>Incidents Trend</h3>
        <ResponsiveContainer>
          <LineChart data={analytics.trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="incidents" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
