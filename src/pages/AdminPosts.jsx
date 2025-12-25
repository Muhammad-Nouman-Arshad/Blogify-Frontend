// src/pages/AdminPosts.jsx

import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all posts
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await api.get("/posts");
        setPosts(res.data);
      } catch {
        toast.error("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Delete post
  const deletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Post deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // Approve / Unapprove post
  const toggleApprove = async (post) => {
    try {
      const res = await api.patch(`/posts/${post._id}/approve`);
      const updated = res.data.post;

      setPosts((prev) =>
        prev.map((p) => (p._id === post._id ? updated : p))
      );

      toast.success(res.data.message);
    } catch {
      toast.error("Action failed");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-lg font-medium text-gray-600">
        Loading posts...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-4xl font-bold mb-6 text-gray-800"
      >
        📝 Manage Posts
      </motion.h1>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto rounded-xl shadow-lg border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Author</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {posts.map((post, i) => (
              <motion.tr
                key={post._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="border-b hover:bg-gray-50"
              >
                <td className="py-3 px-4 font-medium break-words max-w-xs">
                  {post.title}
                </td>

                <td className="py-3 px-4">
                  {post.author?.name || "Unknown"}
                </td>

                <td className="py-3 px-4">
                  {post.isPublished ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      Published
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                      Pending
                    </span>
                  )}
                </td>

                <td className="py-3 px-4 flex justify-center gap-3">
                  <button
                    onClick={() => toggleApprove(post)}
                    className={`px-4 py-1.5 rounded-md text-white text-xs font-medium
                      ${
                        post.isPublished
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                  >
                    {post.isPublished ? "Unpublish" : "Approve"}
                  </button>

                  <button
                    onClick={() => deletePost(post._id)}
                    className="px-4 py-1.5 rounded-md bg-red-500 text-white text-xs font-medium hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">
        {posts.map((post, i) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-white border rounded-xl shadow p-4"
          >
            <h3 className="font-semibold text-gray-800 break-words">
              {post.title}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Author: {post.author?.name || "Unknown"}
            </p>

            <div className="mt-2">
              {post.isPublished ? (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Published
                </span>
              ) : (
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Pending
                </span>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => toggleApprove(post)}
                className={`flex-1 py-2 rounded-lg text-white text-sm font-medium
                  ${
                    post.isPublished
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
              >
                {post.isPublished ? "Unpublish" : "Approve"}
              </button>

              <button
                onClick={() => deletePost(post._id)}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
