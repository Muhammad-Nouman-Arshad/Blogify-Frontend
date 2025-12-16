import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

const STORAGE_KEY = "blogify_search_history";
const MAX_HISTORY = 8;

export default function SearchBar({
  onSearch,
  suggestions = [],
  loading = false,
}) {
  const [value, setValue] = useState("");
  const [history, setHistory] = useState([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  // ================= LOAD HISTORY =================
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setHistory(saved);
  }, []);

  // ================= CLICK OUTSIDE =================
  useEffect(() => {
    const handler = (e) => {
      if (!boxRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ================= SAVE SEARCH =================
  const saveSearch = (text) => {
    const updated = [
      text,
      ...history.filter((h) => h !== text),
    ].slice(0, MAX_HISTORY);

    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // ================= SUBMIT =================
  const submit = (text) => {
    if (!text.trim()) return;
    setValue(text);
    saveSearch(text);
    onSearch(text);
    setOpen(false);
  };

  return (
    <div ref={boxRef} className="relative w-full max-w-xl mx-auto">

      {/* ================= INPUT ================= */}
      <div className="relative">
        {/* SEARCH ICON (ONLY HERE) */}
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
            onSearch(e.target.value);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search articles, topics, authors..."
          className="
            w-full pl-12 pr-4 py-3 rounded-2xl
            border border-gray-200
            shadow-md bg-white/90 backdrop-blur
            focus:ring-2 focus:ring-purple-400 outline-none
            transition
          "
        />
      </div>

      {/* ================= DROPDOWN ================= */}
      <AnimatePresence>
        {open && (history.length > 0 || suggestions.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="
              absolute z-50 w-full mt-2
              rounded-xl bg-white
              shadow-xl border overflow-hidden
            "
          >
            {/* HISTORY */}
            {history.length > 0 && (
              <>
                <div className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50">
                  Recent searches
                </div>

                {history.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => submit(item)}
                    className="
                      w-full text-left px-4 py-2
                      text-sm text-gray-700
                      hover:bg-gray-100 transition
                    "
                  >
                    {item}
                  </button>
                ))}
              </>
            )}

            {/* SUGGESTIONS */}
            {suggestions.length > 0 && (
              <>
                <div className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-t">
                  Suggestions
                </div>

                {suggestions.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => submit(item)}
                    className="
                      w-full text-left px-4 py-2
                      text-sm text-gray-700
                      hover:bg-purple-50 transition
                    "
                  >
                    {item}
                  </button>
                ))}
              </>
            )}

            {loading && (
              <div className="px-4 py-2 text-sm text-purple-500">
                Searching…
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
