// src/pages/AdminAnalytics.jsx

import { useEffect, useState } from "react";
import api from "../services/api";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";
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
        const res = await api.get("/admin/analytics"); // protected
        // res.data: { months: [...], posts: [...], users: [...] }
        const { months, posts, users } = res.data;

        // Build combined data array: [{ label: 'Dec 2024', posts: 5, users: 2 }, ...]
        const data = months.map((m, idx) => {
          // m is "yyyy-MM" format
          let label = m;
          try {
            // nicer label like "Dec '24"
            const parsed = parse(m + "-01", "yyyy-MM-dd", new Date());
            label = format(parsed, "MMM yy"); // e.g., "Dec 24"
          } catch (e) {
            /* ignore */
          }

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
    <div className="py-10">
      <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-6">
        Analytics & Growth
      </motion.h1>

      <p className="text-gray-600 mb-6">Last 12 months — posts created and new users registered.</p>

      {/* Top area: two charts side-by-side on wide screens */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Posts per month (Bar) */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2">Posts per month</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="posts" name="Posts" fill="#7c3aed" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Users growth (Line) */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2">New users per month</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" name="New Users" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom area: simple table for exact numbers (optional) */}
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-3">Numbers (exact)</h3>
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
