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
    <div className="max-w-4xl mx-auto mt-10">
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt="cover"
          className="w-full h-72 object-cover rounded"
        />
      )}

      <h1 className="text-4xl font-bold mt-4">{post.title}</h1>

      <p className="text-gray-600 mt-1">By {post.author?.name}</p>

      <p className="mt-6 text-lg">{post.content}</p>

      {user && (
        <button
          onClick={handleLike}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-5"
        >
          👍 {post.likes?.length || 0}
        </button>
      )}
    </div>
  );
}
