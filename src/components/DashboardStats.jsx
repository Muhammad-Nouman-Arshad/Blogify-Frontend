import { motion } from "framer-motion";
import { Heart, MessageCircle, FileText, TrendingUp } from "lucide-react";

export default function DashboardStats({ posts = [] }) {
  // ================= BASIC COUNTS =================
  const totalPosts = posts.length;

  // 👍 Total Reactions (array OR counter fallback)
  const totalReactions = posts.reduce((sum, post) => {
    if (Array.isArray(post.reactions)) {
      return sum + post.reactions.length;
    }
    return sum + (post.reactionsCount || 0);
  }, 0);

  // 💬 Total Comments (from Post.commentsCount)
  const totalComments = posts.reduce(
    (sum, post) => sum + (post.commentsCount || 0),
    0
  );

  // 📊 Average reactions per post
  const avgReactions =
    totalPosts > 0 ? Math.round(totalReactions / totalPosts) : 0;

  // ================= STATS CONFIG =================
  const stats = [
    {
      label: "Total Posts",
      value: totalPosts,
      icon: <FileText className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Total Reactions",
      value: totalReactions,
      icon: <Heart className="w-6 h-6" />,
      color: "from-pink-500 to-red-500",
    },
    {
      label: "Total Comments",
      value: totalComments,
      icon: <MessageCircle className="w-6 h-6" />,
      color: "from-purple-500 to-indigo-500",
    },
    {
      label: "Avg Reactions / Post",
      value: avgReactions,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
    },
  ];

  // ================= UI =================
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="
            bg-white rounded-2xl p-6
            border border-gray-200
            shadow-sm hover:shadow-md transition
          "
        >
          <div
            className={`
              w-12 h-12 rounded-xl
              flex items-center justify-center
              text-white bg-gradient-to-r ${stat.color}
              mb-4
            `}
          >
            {stat.icon}
          </div>

          <p className="text-sm text-gray-500">{stat.label}</p>
          <h3 className="text-2xl font-bold text-gray-800">
            {stat.value}
          </h3>
        </motion.div>
      ))}
    </div>
  );
}
