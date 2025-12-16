import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { useContext, useState } from "react";
import Avatar from "./Avatar";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

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
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const authorName = post?.author?.name || "User";

  const [likes, setLikes] = useState(post.likes || []);
  const isLiked = user && likes.includes(user._id);

  // ================= LIKE HANDLER =================
  const handleLike = async () => {
    if (!user) {
      toast.error("Login to like posts");
      return;
    }

    try {
      const res = await api.post(`/posts/${post._id}/like`);
      setLikes(res.data.post.likes);
    } catch {
      toast.error("Failed to like post");
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
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      className="
        rounded-3xl bg-white
        shadow-[0_8px_30px_rgba(0,0,0,0.12)]
        border border-gray-200
        hover:shadow-[0_14px_45px_rgba(0,0,0,0.18)]
        transition-all duration-500
        h-full flex flex-col
      "
    >
      <div className="p-6 flex flex-col h-full">

        {/* CATEGORY */}
        <div className="flex gap-2 mb-4">
          {(post.categories?.length ? post.categories : ["General"]).map(
            (cat, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 text-xs font-semibold rounded-full text-white
                bg-gradient-to-r ${getCategoryColors(cat)}`}
              >
                {cat}
              </span>
            )
          )}
        </div>

        {/* TITLE */}
        <h2 className="text-[22px] font-extrabold text-gray-800 line-clamp-2">
          {post.title}
        </h2>

        {/* CONTENT */}
        <p className="mt-3 text-gray-600 text-sm line-clamp-3">
          {(post.content || "").slice(0, 150)}...
        </p>

        {/* AUTHOR */}
        <div className="flex justify-between items-center mt-5 text-sm">
          <div className="flex items-center gap-2">
            <Avatar name={authorName} size={32} />
            <span className="font-medium text-gray-700">{authorName}</span>
          </div>
          <span className="text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between border-t pt-4 mt-auto">

          {/* LIKE */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-sm transition
              ${isLiked ? "text-red-500" : "text-gray-600 hover:text-red-500"}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500" : ""}`} />
            {likes.length}
          </button>

          {/* COMMENT */}
          <button
            onClick={() => navigate(`/post/${post._id}`)}
            className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Comment
          </button>

          {/* SHARE */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-gray-600 hover:text-purple-600 text-sm"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        {/* READ MORE */}
        <Link
          to={`/post/${post._id}`}
          className="mt-4 block w-full text-center py-3 rounded-xl font-semibold
          bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        >
          Read More →
        </Link>
      </div>
    </motion.div>
  );
}
