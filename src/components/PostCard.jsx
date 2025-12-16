import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Share2, X } from "lucide-react";
import { useContext, useState } from "react";
import Avatar from "./Avatar";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

// ================= REACTIONS CONFIG =================
const REACTIONS = [
  { type: "like", emoji: "👍" },
  { type: "love", emoji: "❤️" },
  { type: "haha", emoji: "😂" },
  { type: "wow", emoji: "😮" },
  { type: "sad", emoji: "😢" },
  { type: "angry", emoji: "😡" },
];

// ================= CATEGORY COLORS =================
const getCategoryColors = (category) => {
  const map = {
    General: "from-purple-500 to-pink-500",
    Technology: "from-blue-500 to-cyan-500",
    Lifestyle: "from-green-500 to-emerald-500",
    Business: "from-orange-500 to-yellow-500",
    Design: "from-fuchsia-500 to-purple-500",
    Sports: "from-red-500 to-orange-500",
    Entertainment: "from-indigo-500 to-purple-600",
  };
  return map[category] || "from-purple-500 to-pink-500";
};

export default function PostCard({ post }) {
  const { user } = useContext(AuthContext);
  const authorName = post?.author?.name || "User";

  // ================= STATES =================
  const [showReactions, setShowReactions] = useState(false);
  const [reactions, setReactions] = useState(post.reactions || []);
  const [myReaction, setMyReaction] = useState(
    reactions.find((r) => r.user === user?._id)?.type
  );

  // 🔥 MODAL STATES
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // ================= REACTION =================
  const handleReaction = async (type) => {
    if (!user) return toast.error("Login to react");

    try {
      const res = await api.post(`/posts/${post._id}/react`, { type });
      setReactions(res.data.post.reactions);
      setMyReaction(type);
    } catch {
      toast.error("Failed to react");
    }
  };

  // ================= COMMENT =================
  const submitComment = async () => {
    if (!user) return toast.error("Login to comment");
    if (!commentText.trim()) return;

    try {
      setCommentLoading(true);

      const res = await api.post(`/comments/post/${post._id}`, {
        text: commentText,
      });

      setComments((prev) => [res.data.comment, ...prev]);
      setCommentText("");
      toast.success("Comment added");
    } catch {
      toast.error("Failed to comment");
    } finally {
      setCommentLoading(false);
    }
  };

  // ================= SHARE =================
  const handleShare = async () => {
    const url = `${window.location.origin}/post/${post._id}`;

    if (navigator.share) {
      await navigator.share({
        title: post.title,
        text: post.content.slice(0, 80),
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    }
  };

  return (
    <>
      {/* ================= POST CARD ================= */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="
          h-full flex flex-col rounded-3xl bg-white
          shadow border border-gray-200
          hover:shadow-xl transition-all
        "
      >
        <div className="p-6 flex flex-col flex-1">

          {/* CATEGORIES */}
          <div className="flex gap-2 mb-4">
            {(post.categories?.length ? post.categories : ["General"]).map(
              (cat, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 text-xs font-semibold rounded-full text-white bg-gradient-to-r ${getCategoryColors(
                    cat
                  )}`}
                >
                  {cat}
                </span>
              )
            )}
          </div>

          {/* TITLE */}
          <h2 className="text-[22px] font-extrabold text-gray-800 line-clamp-2 min-h-[56px]">
            {post.title}
          </h2>

          {/* CONTENT */}
          <p className="mt-3 text-gray-600 text-sm line-clamp-3 min-h-[72px]">
            {(post.content || "").slice(0, 150)}...
          </p>

          {/* AUTHOR */}
          <div className="flex justify-between items-center mt-5 text-sm">
            <div className="flex items-center gap-2">
              <Avatar name={authorName} size={32} />
              <span className="font-medium">{authorName}</span>
            </div>
            <span className="text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* ACTIONS */}
          <div className="mt-auto">
            <div className="flex justify-between border-t pt-4 mt-4 text-sm">

              {/* LIKE */}
              <div
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}
                className="relative"
              >
                <button className="flex items-center gap-1">
                  <span className="text-lg">
                    {myReaction
                      ? REACTIONS.find((r) => r.type === myReaction)?.emoji
                      : "👍"}
                  </span>
                  {reactions.length}
                </button>

                <AnimatePresence>
                  {showReactions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute bottom-10 left-0 bg-white shadow rounded-full px-3 py-2 flex gap-2"
                    >
                      {REACTIONS.map((r) => (
                        <button
                          key={r.type}
                          onClick={() => handleReaction(r.type)}
                          className="text-xl hover:scale-125 transition"
                        >
                          {r.emoji}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* COMMENT */}
              <button
                onClick={() => setShowCommentModal(true)}
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
              >
                <MessageCircle className="w-4 h-4" /> Comment
              </button>

              {/* SHARE */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-gray-600 hover:text-purple-600"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>

            {/* READ MORE */}
            <Link
              to={`/post/${post._id}`}
              className="mt-4 block w-full text-center py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              Read More →
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ================= COMMENT MODAL ================= */}
      <AnimatePresence>
        {showCommentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white w-full max-w-md rounded-2xl p-6 relative"
            >
              {/* CLOSE */}
              <button
                onClick={() => setShowCommentModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
              >
                <X />
              </button>

              <h3 className="text-xl font-bold mb-4">Comments</h3>

              <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                {comments.map((c, i) => (
                  <div key={i} className="text-sm bg-gray-100 p-2 rounded-lg">
                    <strong>{c.user?.name}:</strong> {c.text}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
                />
                <button
                  onClick={submitComment}
                  disabled={commentLoading}
                  className="px-4 rounded-lg bg-blue-600 text-white text-sm"
                >
                  {commentLoading ? "..." : "Post"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
