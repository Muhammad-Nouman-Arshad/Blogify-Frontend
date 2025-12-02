// src/pages/AdminDashboard.jsx

import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    latestPosts: [],
  });

  const [loading, setLoading] = useState(true);

  // Load admin stats
  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load admin data");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  // ============= ACTIONS ==============

  const handleApprove = async (postId) => {
    try {
      const res = await api.patch(`/posts/${postId}/approve`);
      toast.success(res.data.message);

      // Update UI instantly
      setStats((prev) => ({
        ...prev,
        latestPosts: prev.latestPosts.map((p) =>
          p._id === postId ? res.data.post : p
        ),
      }));
    } catch {
      toast.error("Failed to update post status");
    }
  };

  const handleDelete = async (postId) => {
    if (!confirm("Delete this post?")) return;

    try {
      await api.delete(`/posts/${postId}`);
      toast.success("Post deleted");

      setStats((prev) => ({
        ...prev,
        posts: prev.posts - 1,
        latestPosts: prev.latestPosts.filter((p) => p._id !== postId),
      }));
    } catch {
      toast.error("Delete failed");
    }
  };

  // ====================================

  return (
    <div className="py-10">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-4xl font-bold mb-8"
      >
        Admin Dashboard 👑
      </motion.h1>

      {/* ===================== STATS CARDS ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Total Users"
          value={stats.users}
          color="from-blue-500 to-indigo-600"
        />

        <StatCard
          title="Total Posts"
          value={stats.posts}
          color="from-purple-500 to-pink-600"
        />

        <StatCard
          title="Pending Approval"
          value={stats.latestPosts.filter((p) => !p.isPublished).length}
          color="from-red-500 to-orange-500"
        />
      </div>

      {/* ===================== RECENT POSTS ===================== */}
      <h2 className="text-2xl font-semibold mb-4">Recent Posts</h2>

      <div className="space-y-4">
        {stats.latestPosts.map((post) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 bg-white shadow rounded-lg border"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-600">
                  By {post.author?.name} •{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>

                <p className="text-sm mt-2">
                  Status:{" "}
                  <span
                    className={
                      post.isPublished ? "text-green-600" : "text-red-600"
                    }
                  >
                    {post.isPublished ? "Published" : "Pending"}
                  </span>
                </p>
              </div>

              <div className="flex gap-3">
                {/* Approve / Unapprove */}
                <button
                  onClick={() => handleApprove(post._id)}
                  className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  {post.isPublished ? "Unpublish" : "Approve"}
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(post._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* Reusable small card component */
function StatCard({ title, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl p-5 text-white bg-linear-to-r ${color} shadow-lg`}
    >
      <div className="text-sm opacity-80">{title}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </motion.div>
  );
}
