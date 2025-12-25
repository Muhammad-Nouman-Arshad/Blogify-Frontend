import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import PostCard from "../components/PostCard";
import Avatar from "../components/Avatar";
import DashboardStats from "../components/DashboardStats";
import { motion } from "framer-motion";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;

    const fetchMyPosts = async () => {
      try {
        const res = await api.get("/posts");
        const userId = user._id.toString();

        const filtered = res.data.filter((post) => {
          const postAuthorId =
            typeof post.author === "object"
              ? post.author?._id?.toString()
              : post.author?.toString();

          return postAuthorId === userId;
        });

        setMyPosts(filtered);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [user]);

  if (!user) {
    return (
      <h1 className="text-center mt-20 text-gray-600">
        Login required
      </h1>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-20 px-4 pb-16">

      {/* ================= PROFILE HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          bg-white shadow-md rounded-2xl border border-gray-200
          p-5 sm:p-8
          flex flex-col sm:flex-row
          items-center sm:items-start
          gap-5 sm:gap-8
        "
      >
        <Avatar name={user.name} size={80} />

        <div className="w-full text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 break-words">
            {user.name}
          </h1>

          <p className="text-gray-600 break-all mt-1">
            {user.email}
          </p>

          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 mt-3 text-sm">
            <span className="text-purple-600 font-medium">
              {user.role === "admin"
                ? "👑 Admin Account"
                : "✨ Standard User"}
            </span>

            <span className="text-gray-400 hidden sm:inline">•</span>

            <span className="text-gray-700 font-medium">
              📝 {myPosts.length} Posts
            </span>
          </div>
        </div>
      </motion.div>

      {/* ================= DASHBOARD ================= */}
      <div className="mt-10">
        <DashboardStats posts={myPosts} />
      </div>

      {/* ================= POSTS SECTION ================= */}
      <h2 className="text-xl sm:text-2xl font-semibold mt-14 mb-4">
        Your Posts
      </h2>

      {loading ? (
        <div className="text-center py-12 text-gray-500">
          Loading posts...
        </div>
      ) : myPosts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-500"
        >
          You haven’t created any posts yet.
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.12 } },
          }}
          className="
            grid gap-6
            sm:grid-cols-2
            lg:grid-cols-3
            mt-6
          "
        >
          {myPosts.map((post) => (
            <motion.div
              key={post._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
