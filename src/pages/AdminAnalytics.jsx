// src/pages/AdminAnalytics.jsx

import { useEffect, useState } from "react";
import api from "../services/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { format, parse } from "date-fns";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/analytics");
        const { months, posts, users } = res.data;

        const data = months.map((m, idx) => {
          let label = m;
          try {
            const parsed = parse(m + "-01", "yyyy-MM-dd", new Date());
            label = format(parsed, "MMM yy");
          } catch {}

          return {
            month: label,
            posts: posts[idx] || 0,
            users: users[idx] || 0,
          };
        });

        setChartData(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="py-10 px-2 sm:px-0">
      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-2"
      >
        Analytics & Growth
      </motion.h1>

      <p className="text-gray-600 mb-8">
        Last 12 months — posts created & new users registered
      </p>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* POSTS CHART */}
        <div className="bg-white rounded-2xl shadow p-5 overflow-hidden">
          <h3 className="font-semibold mb-4">Posts per month</h3>

          {/* ✅ FIXED HEIGHT */}
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="posts"
                name="Posts"
                fill="#7c3aed"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* USERS CHART */}
        <div className="bg-white rounded-2xl shadow p-5 overflow-hidden">
          <h3 className="font-semibold mb-4">New users per month</h3>

          {/* ✅ FIXED HEIGHT */}
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                name="New Users"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLE */}
      <div className="mt-8 bg-white rounded-2xl shadow p-5">
        <h3 className="font-semibold mb-4">Exact numbers</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-2 px-3 text-left">Month</th>
                <th className="py-2 px-3 text-right">Posts</th>
                <th className="py-2 px-3 text-right">New Users</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((row) => (
                <tr key={row.month} className="border-b">
                  <td className="py-2 px-3">{row.month}</td>
                  <td className="py-2 px-3 text-right">{row.posts}</td>
                  <td className="py-2 px-3 text-right">{row.users}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
