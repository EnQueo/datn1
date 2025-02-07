import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0 });
  const [monthlyRevenue, setMonthlyRevenue] = useState({ Pending: 0, Shipping: 0, Delivered: 0, Cancelled: 0 });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const fetchStats = async () => {
    try {
      const response = await fetch('/dashboard-stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchMonthlyRevenue = async (month) => {
    try {
      const response = await fetch(`/monthly-revenue?month=${month}`);
      if (!response.ok) {
        throw new Error('Failed to fetch monthly revenue');
      }
      const data = await response.json();
      setMonthlyRevenue(data);
    } catch (error) {
      console.error('Error fetching monthly revenue:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchMonthlyRevenue(selectedMonth);
  }, [selectedMonth]);

  return (
    <div className="dashboard">
    <div className="dashboard-cards">
        <div className="card">
            <h2>Products</h2>
            <p>{stats.totalProducts}</p>
        </div>
        <div className="card">
            <h2>Orders</h2>
            <p>{stats.totalOrders}</p>
        </div>
        <div className="card">
            <h2>Users</h2>
            <p>{stats.totalUsers}</p>
        </div>
    </div>

    <div className="month-selector">
        <label htmlFor="month">Select Month:</label>
        <select id="month" value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
            {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>
                    {i + 1}
                </option>
            ))}
        </select>
    </div>

    <div className="revenue-table">
        <h2>Monthly Revenue</h2>
        <table>
            <thead>
                <tr>
                    <th>Pending</th>
                    <th>Shipping</th>
                    <th>Delivered</th>
                    <th>Cancelled</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{monthlyRevenue.Pending}</td>
                    <td>{monthlyRevenue.Shipping}</td>
                    <td>{monthlyRevenue.Delivered}</td>
                    <td>{monthlyRevenue.Cancelled}</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
  );
};

export default Dashboard;
