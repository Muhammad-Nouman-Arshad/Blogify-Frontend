import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import Avatar from "../components/Avatar";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Pencil, Trash2, Share2 } from "lucide-react";

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
  const [showComments, setShowComments] = useState(false);

  const isAuthor =
    user &&
    post &&
    (user._id === post.author?._id || user.role === "admin");

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

  if (!post) {
    return (
      <div className="text-center text-xl mt-20 text-red-600">
        Post not found!
      </div>
    );
  }

  // ================= LIKE =================
  const toggleLike = async () => {
    if (!user) return toast.error("Login required");
    setLikeLoading(true);

    try {
      const res = await api.post(`/posts/${post._id}/like`);
      setPost(res.data.post);
    } catch {
      toast.error("Failed to like post");
    } finally {
      setLikeLoading(false);
    }
  };

  // ================= SHARE =================
  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content.slice(0, 100),
          url,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
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
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* ================= HERO IMAGE ================= */}
      {post.coverImage && (
        <motion.img
          src={post.coverImage}
          alt={post.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full h-64 sm:h-80 md:h-[420px] object-cover"
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* ================= TITLE ================= */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-8"
        >
          {post.title}
        </motion.h1>

        {/* ================= AUTHOR + ACTIONS ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
          <div className="flex items-center gap-3 text-gray-600">
            <Avatar name={post.author?.name} size={40} />
            <div className="text-sm">
              <p className="font-semibold">{post.author?.name}</p>
              <p>{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {isAuthor && (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/edit/${post._id}`)}
                className="flex items-center gap-1 px-4 py-2 rounded-full text-sm
                bg-blue-50 text-blue-600 border border-blue-200
                hover:bg-blue-600 hover:text-white transition"
              >
                <Pencil size={14} /> Edit
              </button>

              <button
                onClick={deletePost}
                className="flex items-center gap-1 px-4 py-2 rounded-full text-sm
                bg-red-50 text-red-600 border border-red-200
                hover:bg-red-600 hover:text-white transition"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>

        {/* ================= CONTENT ================= */}
        <div className="prose prose-base sm:prose-lg max-w-none mt-10">
          {post.content.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        {/* ================= ACTION BUTTONS ================= */}
        <div className="flex flex-wrap gap-3 mt-10">
          <button
            onClick={toggleLike}
            disabled={likeLoading}
            className="px-5 py-2 rounded-full bg-white border shadow-sm
            hover:bg-pink-50 hover:text-pink-600 transition"
          >
            ❤️ {post.likes?.length || 0}
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="px-5 py-2 rounded-full bg-white border shadow-sm
            hover:bg-blue-50 hover:text-blue-600 transition"
          >
            💬 {comments.length}
          </button>

          <button
            onClick={handleShare}
            className="px-5 py-2 rounded-full bg-white border shadow-sm
            hover:bg-purple-50 hover:text-purple-600 transition"
          >
            <Share2 size={16} />
          </button>
        </div>

        {/* ================= COMMENTS ================= */}
        {showComments && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-14 border-t pt-8"
          >
            <h2 className="text-2xl font-bold mb-4">Comments</h2>

            {user ? (
              <>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows="3"
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
                  placeholder="Write a comment..."
                />
                <button
                  onClick={addComment}
                  disabled={commentLoading}
                  className="mt-3 px-6 py-2 rounded-xl bg-blue-600 text-white"
                >
                  {commentLoading ? "Posting..." : "Post Comment"}
                </button>
              </>
            ) : (
              <p className="text-gray-500">Login to comment</p>
            )}

            <div className="mt-6 space-y-4">
              {comments.map((c) => (
                <div
                  key={c._id}
                  className="p-4 bg-white rounded-xl shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar name={c.user?.name} size={32} />
                      <p className="font-semibold text-sm">
                        {c.user?.name}
                      </p>
                    </div>

                    {(user &&
                      (user._id === c.user?._id ||
                        user.role === "admin")) && (
                      <button
                        onClick={() => deleteComment(c._id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <p className="mt-2 text-gray-700 text-sm">{c.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
