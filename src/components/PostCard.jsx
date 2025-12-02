import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function PostCard({ post }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 120, damping: 12 }}
      className="rounded-2xl bg-white/70 backdrop-blur-lg shadow-xl border border-gray-200 
                 overflow-hidden hover:shadow-3xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* IMAGE */}
      {post.coverImage && (
        <motion.div whileHover={{ scale: 1.06 }} className="overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-56 object-cover transition-transform duration-700"
          />
        </motion.div>
      )}

      {/* CONTENT */}
      <div className="p-6">

        {/* CATEGORIES */}
        <div className="flex flex-wrap gap-2 mb-3">
          {(post.categories || ["General"]).map((cat, idx) => (
            <span
              key={idx}
              className="px-3 py-1 text-xs font-semibold rounded-full 
                         bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-gray-800 leading-tight mb-3 line-clamp-2">
          {post.title}
        </h2>

        {/* DESCRIPTION */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
          {post.content.substring(0, 140)}...
        </p>

        {/* AUTHOR + DATE */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center gap-2">
            <img
              src={`https://api.dicebear.com/7.x/notable/svg?seed=${post?.author?.name}`}
              alt="avatar"
              className="w-7 h-7 rounded-full"
            />
            <span className="font-medium text-gray-700">
              {post?.author?.name}
            </span>
          </div>

          <span className="text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* READ MORE */}
        <Link
          to={`/post/${post._id}`}
          className="block w-full text-center py-2.5 rounded-xl font-semibold 
                     bg-gradient-to-r from-blue-600 to-purple-600 
                     text-white shadow-md hover:shadow-xl hover:brightness-110 
                     active:scale-95 transition-all duration-300"
        >
          Read More →
        </Link>
      </div>
    </motion.div>
  );
}
