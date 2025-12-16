import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import Avatar from "../components/Avatar";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function SinglePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showComments, setShowComments] = useState(false); // ✅ toggle

  const isAuthor =
    user && post && (user._id === post.author?._id || user.role === "admin");

  // ================= FETCH POST + COMMENTS =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const postRes = await api.get(`/posts/${id}`);
        setPost(postRes.data);

        const commentsRes = await api.get(`/comments/post/${id}`);
        setComments(commentsRes.data);
      } catch {
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

  // ================= LIKE =================
  const toggleLike = async () => {
    if (!user) return toast.error("Login required");
    setLikeLoading(true);

    try {
      const res = await api.post(`/posts/${post._id}/like`);
      setPost(res.data.post);
    } catch {
      toast.error("Failed to like");
    } finally {
      setLikeLoading(false);
    }
  };

  // ================= DELETE POST =================
  const deletePost = async () => {
    if (!window.confirm("Delete this post permanently?")) return;

    try {
      await api.delete(`/posts/${post._id}`);
      toast.success("Post deleted");
      navigate("/");
    } catch {
      toast.error("Delete failed");
    }
  };

  // ================= ADD COMMENT =================
  const addComment = async () => {
    if (!commentText.trim()) return toast.error("Comment cannot be empty");
    setCommentLoading(true);

    try {
      const res = await api.post(`/comments/post/${post._id}`, {
        text: commentText,
      });
      setComments([res.data.comment, ...comments]);
      setCommentText("");
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  // ================= DELETE COMMENT =================
  const deleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-white to-gray-50">

      {/* ================= HERO IMAGE ================= */}
      {post.coverImage && (
        <motion.img
          src={post.coverImage}
          alt={post.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full h-[420px] object-cover shadow"
        />
      )}

      <div className="max-w-4xl mx-auto px-4">

        {/* ================= TITLE ================= */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-extrabold mt-10"
        >
          {post.title}
        </motion.h1>

        {/* ================= AUTHOR ================= */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3 text-gray-600">
            <Avatar name={post.author?.name} size={40} />
            <span className="font-medium">{post.author?.name}</span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          {isAuthor && (
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/edit/${post._id}`)}
                className="text-sm text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={deletePost}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* ================= CONTENT ================= */}
        <div className="prose prose-lg max-w-none mt-10">
          {post.content.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        {/* ================= ACTION BUTTONS ================= */}
        <div className="flex flex-wrap gap-4 mt-10">

          {/* LIKE */}
          <button
            onClick={toggleLike}
            disabled={likeLoading}
            className="
              group flex items-center gap-2 px-6 py-2.5 rounded-full
              bg-white border border-gray-200
              text-gray-700 font-medium
              shadow-sm hover:shadow-md
              hover:bg-pink-50 hover:text-pink-600
              active:scale-95 transition-all
            "
          >
            <span className="text-lg group-hover:scale-110 transition">❤️</span>
            {post.likes?.length || 0}
          </button>

          {/* COMMENT TOGGLE */}
          <button
            onClick={() => setShowComments((prev) => !prev)}
            className="
              group flex items-center gap-2 px-6 py-2.5 rounded-full
              bg-white border border-gray-200
              text-gray-700 font-medium
              shadow-sm hover:shadow-md
              hover:bg-blue-50 hover:text-blue-600
              active:scale-95 transition-all
            "
          >
            <span className="text-lg group-hover:scale-110 transition">💬</span>
            {comments.length}
            <span className="text-xs opacity-60">
              {showComments ? "Hide" : "Show"}
            </span>
          </button>

          {/* SHARE */}
          <button
            onClick={() =>
              navigator.share?.({
                title: post.title,
                text: post.content.slice(0, 100),
                url: window.location.href,
              })
            }
            className="
              group flex items-center gap-2 px-6 py-2.5 rounded-full
              bg-white border border-gray-200
              text-gray-700 font-medium
              shadow-sm hover:shadow-md
              hover:bg-purple-50 hover:text-purple-600
              active:scale-95 transition-all
            "
          >
            <span className="text-lg group-hover:scale-110 transition">🔗</span>
            Share
          </button>

        </div>

        {/* ================= COMMENTS (TOGGLE) ================= */}
        {showComments && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 border-t pt-10"
          >
            <h2 className="text-3xl font-bold mb-6">Comments</h2>

            {user ? (
              <>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="
                    w-full p-4 border border-gray-300 rounded-xl
                    focus:ring-2 focus:ring-blue-400 outline-none shadow-sm
                  "
                  rows="3"
                  placeholder="Write a comment..."
                />
                <button
                  onClick={addComment}
                  disabled={commentLoading}
                  className="
                    mt-3 px-6 py-2.5 rounded-xl
                    bg-gradient-to-r from-blue-600 to-purple-600
                    text-white font-medium
                    shadow-md hover:shadow-lg
                    active:scale-95 transition
                  "
                >
                  {commentLoading ? "Posting..." : "Post Comment"}
                </button>
              </>
            ) : (
              <p className="text-gray-500">Login to comment</p>
            )}

            <div className="mt-8 space-y-4">
              {comments.length === 0 && (
                <p className="text-gray-500">No comments yet.</p>
              )}

              {comments.map((c) => (
                <motion.div
                  key={c._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gray-100 rounded-xl shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar name={c.user?.name} size={32} />
                      <p className="font-semibold">{c.user.name}</p>
                    </div>

                    {(user &&
                      (user._id === c.user._id || user.role === "admin")) && (
                      <button
                        onClick={() => deleteComment(c._id)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <p className="mt-2 text-gray-700">{c.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
