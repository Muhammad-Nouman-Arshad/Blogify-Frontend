import { motion } from "framer-motion";
import { Heart, MessageCircle, FileText, TrendingUp } from "lucide-react";

export default function DashboardStats({ posts }) {
  const totalPosts = posts.length;
  const totalLikes = posts.reduce(
    (sum, p) => sum + (p.likes?.length || 0),
    0
  );
  const totalComments = posts.reduce(
    (sum, p) => sum + (p.commentsCount || 0),
    0
  );

  const avgLikes =
    totalPosts > 0 ? Math.round(totalLikes / totalPosts) : 0;

  const stats = [
    {
      label: "Total Posts",
      value: totalPosts,
      icon: <FileText className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Total Likes",
      value: totalLikes,
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
      label: "Avg Likes / Post",
      value: avgLikes,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="
            bg-white rounded-2xl p-6 border border-gray-200
            shadow-sm hover:shadow-md transition
          "
        >
          <div
            className={`
              w-12 h-12 rounded-xl flex items-center justify-center
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
