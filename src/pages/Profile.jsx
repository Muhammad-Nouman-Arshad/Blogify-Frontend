// src/pages/Profile.jsx

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import PostCard from "../components/PostCard";
import { motion } from "framer-motion";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    if (user) {
      api.get("/posts").then((res) => {
        const filtered = res.data.filter(
          (post) => post.author?._id === user._id || post.author?._id === user.id
        );
        setMyPosts(filtered);
      });
    }
  }, [user]);

  if (!user) return <h1 className="text-center mt-10">Login required</h1>;

  return (
    <div className="max-w-6xl mx-auto mt-16 p-4">

      {/* ================== PROFILE HEADER ================== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-lg p-8 rounded-2xl border border-gray-200 flex items-center gap-6"
      >
        {/* Avatar */}
        <img
          src={`https://api.dicebear.com/7.x/notable/svg?seed=${user.name}`}
          className="w-20 h-20 rounded-full shadow-md"
        />

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {user.name}
          </h1>

          <p className="text-gray-600">{user.email}</p>

          <p className="mt-2 text-sm font-medium text-purple-600">
            {user.role === "admin" ? "👑 Admin Account" : "✨ Standard User"}
          </p>
        </div>
      </motion.div>

      {/* ================== POSTS SECTION ================== */}
      <h2 className="text-2xl font-semibold mt-10 mb-4">Your Posts</h2>

      {/* If no posts */}
      {myPosts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10 text-gray-500"
        >
          You haven’t created any posts yet.
        </motion.div>
      )}

      {/* Post Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
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
    </div>
  );
}
