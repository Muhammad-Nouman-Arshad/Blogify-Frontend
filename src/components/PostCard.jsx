import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      className="
        rounded-3xl bg-white/70 backdrop-blur-xl 
        shadow-[0_8px_30px_rgba(0,0,0,0.12)]
        border border-white/40 
        overflow-hidden 
        hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)]
        hover:-translate-y-1 
        transition-all duration-500
        h-full flex flex-col justify-between
      "
    >
      <div className="p-6 flex flex-col flex-grow">

        {/* CATEGORIES */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(post.categories || ["General"]).map((cat, idx) => (
            <span
              key={idx}
              className={`
                px-3 py-1 text-xs font-semibold rounded-full text-white shadow-md 
                bg-gradient-to-r ${getCategoryColors(cat)}
              `}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* TITLE */}
        <motion.h2 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="
            text-[22px] font-extrabold text-gray-800 mb-3 
            line-clamp-2 min-h-[68px]
          "
        >
          {post.title}
        </motion.h2>

        {/* DESCRIPTION */}
        <p className="text-gray-600 text-sm mb-5 leading-relaxed line-clamp-3 min-h-[66px]">
          {post.content.substring(0, 150)}...
        </p>

        {/* AUTHOR + DATE */}
        <div className="flex items-center justify-between mb-6 text-sm">
          <div className="flex items-center gap-2">
            <img
              src={`https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${post?.author?.name}`}
              alt="avatar"
              onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-avatar.png";}}
              className="w-8 h-8 rounded-full shadow-sm object-cover bg-gray-200"
            />
            <span className="font-medium text-gray-700">{post?.author?.name}</span>
          </div>

          <span className="text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* READ MORE BUTTON */}
        <motion.div whileHover={{ x: 3 }} className="mt-auto">
          <Link
            to={`/post/${post._id}`}
            className="
              block w-full text-center py-3 rounded-xl font-semibold 
              bg-gradient-to-r from-blue-600 to-purple-600 
              text-white shadow-md 
              hover:shadow-xl hover:brightness-110 
              active:scale-95 
              transition-all duration-300 
              flex items-center justify-center gap-2
            "
          >
            Read More →
          </Link>
        </motion.div>

      </div>
    </motion.div>
  );
}