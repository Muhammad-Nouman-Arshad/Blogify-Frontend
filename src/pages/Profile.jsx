import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import PostCard from "../components/PostCard";
import Avatar from "../components/Avatar";
import DashboardStats from "../components/DashboardStats";
import { motion } from "framer-motion";

// ================= NAME FORMATTER =================
const formatName = (name = "") => {
  if (!name) return "User";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH USER POSTS =================
  const fetchMyPosts = useCallback(async () => {
    if (!user?._id) return;

    try {
      const res = await api.get("/posts");
      const userId = user._id.toString();

      const filteredPosts = res.data.filter((post) => {
        const authorId =
          typeof post.author === "object"
            ? post.author?._id?.toString()
            : post.author?.toString();

        return authorId === userId;
      });

      setMyPosts(filteredPosts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyPosts();
  }, [fetchMyPosts]);

  // 🔒 SAFETY
  if (!user) {
    return (
      <h1 className="text-center mt-24 text-gray-500">
        Login required
      </h1>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-20 px-4 pb-16">

      {/* ================= PROFILE HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          bg-white border border-gray-200
          shadow-sm rounded-3xl
          p-6 sm:p-8
          flex items-center gap-6
        "
      >
        {/* AVATAR */}
        <Avatar
          key={user._id}
          name={formatName(user.name)}
          size={96}
        />

        {/* USER INFO */}
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {formatName(user.name)}
            </h1>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold
                ${
                  user.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }
              `}
            >
              {user.role === "admin" ? "👑 Admin" : "✨ User"}
            </span>
          </div>

          <p className="text-gray-500 break-all">
            {user.email || "no-email"}
          </p>

          <p className="text-sm font-medium text-gray-700 mt-1">
            📝 {myPosts.length} Posts
          </p>
        </div>
      </motion.div>

      {/* ================= DASHBOARD STATS ================= */}
      <div className="mt-10">
        <DashboardStats posts={myPosts} />
      </div>

      {/* ================= POSTS ================= */}
      <h2 className="text-xl sm:text-2xl font-semibold mt-14 mb-4">
        Your Posts
      </h2>

      {loading ? (
        <div className="text-center py-12 text-gray-500">
          Loading posts...
        </div>
      ) : myPosts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          You haven’t created any posts yet.
        </div>
      ) : (
        <div
          className="
            grid gap-6
            sm:grid-cols-2
            lg:grid-cols-3
            mt-6
          "
        >
          {myPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onUpdate={fetchMyPosts}
            />
          ))}
        </div>
      )}
    </div>
  );
}
