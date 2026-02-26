import { useEffect, useState } from "react";
import {Chart as ChartJS,BarElement,CategoryScale,LinearScale,Tooltip,Legend} from "chart.js";
import { Bar } from "react-chartjs-2";
import "./analyticsDashboard.css";
import { authFetch } from "../services/api";
ChartJS.register(BarElement,CategoryScale,LinearScale,Tooltip,Legend);

function AnalyticsDashboard() {
  const [data, setData] = useState([]);

  const totalProjects = data.length;
  const totalUsers = data.reduce((a, b) => a + b.users, 0);
  const totalIssues = data.reduce((a, b) => a + b.issues, 0);

  useEffect(() => {
   
    authFetch("http://localhost:8000/analytics/projects")
      .then(res => res.json())
      .then(d => {
        if (Array.isArray(d)) setData(d);
      })
      .catch(console.log);
  }, []);

  const chartDataRaw = [...data]
    .sort((a, b) => b.issues - a.issues)
    .slice(0, 10);

  const chartData = {
    labels: chartDataRaw.map(d => d.project),
    datasets: [
      {
        label: "Users",
        data: chartDataRaw.map(d => d.users),
        backgroundColor: "#93c5fd"
      },
      {
        label: "Issues",
        data: chartDataRaw.map(d => d.issues),
        backgroundColor: "#2563eb"
      }
    ]
  };

  const options = {
    responsive: true,
    indexAxis: "y", 
    plugins: {
      legend: { position: "top" }
    }
  };

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
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

export default AnalyticsDashboard;