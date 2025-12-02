// src/pages/SinglePost.jsx

import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function SinglePost() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // ===========================================
  // FETCH POST + COMMENTS
  // ===========================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const postRes = await api.get(`/posts/${id}`);
        setPost(postRes.data);

        const commentsRes = await api.get(`/comments/post/${id}`);
        setComments(commentsRes.data);
      } catch (err) {
        toast.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Loader />;

  if (!post)
    return (
      <div className="text-center text-xl mt-10 text-red-600">
        Post not found!
      </div>
    );

  // ===========================================
  // ADD COMMENT
  // ===========================================
  const addComment = async () => {
    if (!user) return toast.error("Please login to comment");
    if (!commentText.trim()) return toast.error("Comment cannot be empty");

    setCommentLoading(true);

    try {
      const res = await api.post(`/comments/post/${post._id}`, { text: commentText });

      setComments([res.data.comment, ...comments]);
      setCommentText("");
    } catch (err) {
      toast.error("Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  // ===========================================
  // DELETE COMMENT
  // ===========================================
  const deleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-white to-gray-50">

      {/* ================= HERO IMAGE ================= */}
      {post.coverImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-h-[480px] overflow-hidden shadow-md"
        >
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-[480px] object-cover"
          />
        </motion.div>
      )}

      <div className="max-w-4xl mx-auto px-4">

        {/* ================= TITLE ================= */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="
            text-4xl sm:text-5xl font-extrabold mt-10 leading-tight
            bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent
          "
        >
          {post.title}
        </motion.h1>

        {/* ================= AUTHOR INFO ================= */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 mt-4 text-gray-600"
        >
          <img
            src={`https://api.dicebear.com/7.x/notable/svg?seed=${post?.author?.name}`}
            alt="author avatar"
            className="w-9 h-9 rounded-full"
          />

          <span className="font-medium">{post?.author?.name}</span>
          <span>•</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </motion.div>

        {/* ================= CONTENT ================= */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="prose prose-lg max-w-none mt-10 text-gray-800 leading-relaxed"
        >
          {post.content.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </motion.div>

        {/* ===========================================
            COMMENTS SECTION
        ============================================ */}
        <div className="mt-16 border-t pt-10">

          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Comments 💬
          </h2>

          {/* INPUT BOX */}
          <div className="mb-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm 
                         focus:ring-2 focus:ring-purple-400 outline-none"
              rows="3"
              placeholder="Write a comment..."
            ></textarea>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={addComment}
              disabled={commentLoading}
              className="
                mt-3 bg-purple-600 text-white px-6 py-2 rounded-lg shadow-md 
                hover:bg-purple-700 transition
              "
            >
              {commentLoading ? "Posting..." : "Post Comment"}
            </motion.button>
          </div>

          {/* COMMENT LIST */}
          <div className="space-y-4">
            {comments.length === 0 && (
              <p className="text-gray-500 text-center">No comments yet.</p>
            )}

            {comments.map((c) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-gray-100 rounded-xl shadow"
              >
                <div className="flex justify-between">
                  <p className="font-semibold text-gray-800">{c.user.name}</p>

                  {(user && (user._id === c.user._id || user.role === "admin")) && (
                    <button
                      onClick={() => deleteComment(c._id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>

                <p className="text-gray-700 mt-1">{c.text}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
