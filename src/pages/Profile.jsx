import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import PostCard from "../components/PostCard";
import Avatar from "../components/Avatar";
import DashboardStats from "../components/DashboardStats"; // ✅ NEW
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
    return <h1 className="text-center mt-10">Login required</h1>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-16 p-4">

      {/* ================= PROFILE HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          bg-white shadow-lg p-8 rounded-2xl
          border border-gray-200 flex items-center gap-6
        "
      >
        <Avatar name={user.name} size={80} />

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {user.name}
          </h1>

          <p className="text-gray-600">{user.email}</p>

          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="text-purple-600 font-medium">
              {user.role === "admin" ? "👑 Admin Account" : "✨ Standard User"}
            </span>

            <span className="text-gray-400">•</span>

            <span className="text-gray-700 font-medium">
              📝 {myPosts.length} Posts
            </span>
          </div>
        </div>
      </motion.div>

      {/* ================= DASHBOARD ================= */}
      <DashboardStats posts={myPosts} />

      {/* ================= POSTS SECTION ================= */}
      <h2 className="text-2xl font-semibold mt-14 mb-4">
        Your Posts
      </h2>

      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading posts...
        </div>
      ) : myPosts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10 text-gray-500"
        >
          You haven’t created any posts yet.
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 mt-6"
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