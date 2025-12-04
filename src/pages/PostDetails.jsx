// src/pages/PostDetails.jsx

import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function PostDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);

  useEffect(() => {
    api.get(`/posts/${id}`).then((res) => setPost(res.data));
  }, [id]);

  const handleLike = async () => {
    try {
      const { data } = await api.post(`/posts/${id}/like`);
      setPost(data.post);
    } catch {
      toast.error("Failed to like");
    }
  };

  if (!post) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">

      {/* TITLE */}
      <h1 className="text-4xl font-extrabold text-gray-900 leading-snug">
        {post.title}
      </h1>

      {/* AUTHOR + DATE */}
      <div className="mt-2 text-gray-600 flex items-center gap-3 text-sm">
        <span>By {post.author?.name}</span>
        <span>•</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      {/* CONTENT */}
      <p className="mt-6 text-lg leading-relaxed text-gray-800 whitespace-pre-line">
        {post.content}
      </p>

      {/* LIKE BUTTON */}
      {user && (
        <button
          onClick={handleLike}
          className="
            bg-blue-600 text-white px-6 py-2.5 rounded-lg mt-8 
            hover:bg-blue-700 active:scale-95 transition-all shadow
          "
        >
          👍 {post.likes?.length || 0} Likes
        </button>
      )}
    </div>
  );
}