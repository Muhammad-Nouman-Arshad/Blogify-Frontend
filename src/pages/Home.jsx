import { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ New Smart Search States
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [filter, setFilter] = useState("All");

  const categories = [
    "All",
    "General",
    "Technology",
    "Lifestyle",
    "Business",
    "Design",
    "Sports",
    "Entertainment",
  ];

  // Load all posts initially
  useEffect(() => {
    api
      .get("/posts")
      .then((res) => setPosts(res.data))
      .finally(() => setLoading(false));
  }, []);

  // ⭐ Debounced Search Handler
  let timer;
  const handleSearch = (value) => {
    setSearchText(value);
    clearTimeout(timer);

    timer = setTimeout(() => {
      fetchSearchResults(value);
    }, 400); // delay for AI-like typing search
  };

  // ⭐ Call Backend Smart Search API
  const fetchSearchResults = async (value) => {
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    const res = await api.get(`/posts/search/query?q=${value}`);

    if (res.data.results) {
      setSearchResults(res.data.results);
    } else if (res.data.related) {
      setSearchResults(res.data.related);
    }

    setIsSearching(false);
  };

  // ⭐ Choose which posts to show (search results > normal posts)
  const list = useMemo(() => {
    let data = searchResults.length > 0 ? searchResults : posts;

    // Apply category filter after search
    if (filter !== "All") {
      data = data.filter((p) => (p.categories || []).includes(filter));
    }

    return data;
  }, [posts, searchResults, filter]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 pt-10 pb-20">

      {/* ================= HERO SECTION ================= */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-4xl mx-auto px-4"
      >
        <h1
          className="
            text-6xl font-extrabold 
            bg-gradient-to-r from-[#8A2BE2] via-[#FF00CC] to-[#FF1493]
            bg-clip-text text-transparent
            drop-shadow-[0_4px_10px_rgba(255,0,150,0.35)]
            tracking-tight leading-tight
          "
        >
          Welcome to Blogify
        </h1>

        <p className="text-gray-600 text-lg mt-4 leading-relaxed">
          Dive into a world of ideas, stories, and expert insights crafted by creators like you.
        </p>

        {/* SEARCH BAR */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 flex justify-center"
        >
          <input
            type="text"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search articles, topics, authors..."
            className="w-full max-w-lg px-5 py-3 rounded-2xl shadow-md border border-gray-200 
                       focus:ring-2 focus:ring-purple-400 focus:outline-none transition bg-white/80 backdrop-blur"
          />
        </motion.div>

        {isSearching && (
          <p className="text-purple-500 mt-2 text-sm animate-pulse">
            Searching...
          </p>
        )}
      </motion.div>

      {/* ================= CATEGORY FILTER ================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap justify-center gap-3 mt-10 px-4"
      >
        {categories.map((cat) => (
          <motion.button
            key={cat}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border cursor-pointer ${
              filter === cat
                ? "bg-purple-600 text-white border-purple-600 shadow-lg"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </motion.div>

      {/* ================= POSTS GRID ================= */}
      <motion.div
        layout
        className="max-w-7xl mx-auto px-4 mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence>
          {list.length > 0 ? (
            list.map((post) => (
              <motion.div
                key={post._id}
                layout
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.35 }}
                className="hover:-translate-y-1 transition-transform duration-300"
              >
                <PostCard post={post} />
              </motion.div>
            ))
          ) : (
            // Empty State
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full text-center text-gray-600 mt-10"
            >
              <motion.img
                src="https://illustrations.popsy.co/gray/work-from-home.svg"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-56 mx-auto opacity-80"
              />
              <p className="mt-4 text-lg font-medium">No posts found</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
