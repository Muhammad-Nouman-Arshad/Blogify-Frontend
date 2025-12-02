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
      } catch (err) {
        toast.error("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Delete post
  const deletePost = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
      toast.success("Post deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // Approve / Unapprove post
  const toggleApprove = async (post) => {
    try {
      const res = await api.patch(`/posts/${post._id}/approve`);
      const updated = res.data.post;

      setPosts(
        posts.map((p) => (p._id === post._id ? updated : p))
      );

      toast.success(res.data.message);
    } catch (err) {
      toast.error("Action failed");
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading posts...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6"
      >
        📝 Manage Posts
      </motion.h1>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Author</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {posts.map((post) => (
              <motion.tr
                key={post._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b hover:bg-gray-50"
              >
                <td className="py-3 px-4 font-medium">{post.title}</td>
                <td className="py-3 px-4">{post.author?.name}</td>

                <td className="py-3 px-4">
                  {post.isPublished ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                      Published
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                      Pending
                    </span>
                  )}
                </td>

                <td className="py-3 px-4 flex justify-center gap-3">

                  {/* Approve / Unpublish */}
                  <button
                    onClick={() => toggleApprove(post)}
                    className={`px-3 py-1 rounded text-white ${
                      post.isPublished
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {post.isPublished ? "Unpublish" : "Approve"}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => deletePost(post._id)}
                    className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>

                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
