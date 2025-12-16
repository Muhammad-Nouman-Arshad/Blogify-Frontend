import { useEffect, useState, useMemo, useCallback } from "react";
import api from "../services/api";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import SearchBar from "../components/SearchBar";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";

// ================= CONSTANTS =================
const CATEGORIES = [
  "All",
  "General",
  "Technology",
  "Lifestyle",
  "Business",
  "Design",
  "Sports",
  "Entertainment",
];

const POSTS_PER_PAGE = 9;

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // SEARCH
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // FILTER
  const [filter, setFilter] = useState("All");

  // PAGINATION
  const [page, setPage] = useState(1);

  // ================= FETCH POSTS =================
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/posts");
        setPosts(res.data);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // ================= SEARCH =================
  const debouncedSearch = useCallback(() => {
    let timer;
    return async (value) => {
      clearTimeout(timer);

      timer = setTimeout(async () => {
        if (!value.trim()) {
          setSearchResults([]);
          setPage(1);
          return;
        }

        setIsSearching(true);

        try {
          const res = await api.get(`/posts/search/query?q=${value}`);
          setSearchResults(res.data.results || []);
          setPage(1);
        } finally {
          setIsSearching(false);
        }
      }, 400);
    };
  }, [])();

  const handleSearch = (value) => {
    debouncedSearch(value);
  };

  // ================= FINAL FILTERED LIST =================
  const filteredList = useMemo(() => {
    let data = searchResults.length ? searchResults : posts;

    if (filter !== "All") {
      data = data.filter((p) =>
        (p.categories || []).includes(filter)
      );
    }

    return data;
  }, [posts, searchResults, filter]);

  // ================= PAGINATED DATA =================
  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * POSTS_PER_PAGE;
    return filteredList.slice(start, start + POSTS_PER_PAGE);
  }, [filteredList, page]);

  const totalPages = Math.ceil(filteredList.length / POSTS_PER_PAGE);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 pt-10 pb-24">

      {/* ================= HERO ================= */}
      <motion.section
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto px-4"
      >
        <h1 className="
          text-6xl font-extrabold tracking-tight
          bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500
          bg-clip-text text-transparent
        ">
          Blogify
        </h1>

        <p className="text-gray-600 text-lg mt-4">
          Discover powerful ideas, insightful stories, and meaningful content.
        </p>

        <div className="mt-10">
          <SearchBar
            loading={isSearching}
            suggestions={searchResults.slice(0, 5).map(p => p.title)}
            onSearch={handleSearch}
          />
        </div>
      </motion.section>

      {/* ================= CATEGORY FILTER ================= */}
      <div className="flex flex-wrap justify-center gap-3 mt-12 px-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setFilter(cat);
              setPage(1);
            }}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition ${
              filter === cat
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ================= POSTS GRID ================= */}
      <motion.div
        layout
        className="max-w-7xl mx-auto px-4 mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="wait">
          {paginatedPosts.map((post) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* ================= PAGINATION CONTROLS ================= */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-20">

          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="
              p-3 rounded-full border shadow
              disabled:opacity-40
              hover:bg-gray-100 transition
            "
          >
            <ChevronLeft />
          </button>

          <span className="text-sm text-gray-600 font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="
              p-3 rounded-full border shadow
              disabled:opacity-40
              hover:bg-gray-100 transition
            "
          >
            <ChevronRight />
          </button>

        </div>
      )}
    </div>
  );
}
