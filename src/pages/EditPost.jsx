import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);

        const isAuthor =
          res.data.author._id.toString() === user._id.toString();
        const isAdmin = user.role === "admin";

        if (!isAuthor && !isAdmin) {
          toast.error("You are not allowed to edit this post");
          navigate("/");
          return;
        }

        setTitle(res.data.title);
        setContent(res.data.content);
      } catch {
        toast.error("Post not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user, navigate]);

  const updatePost = async () => {
    try {
      await api.put(`/posts/${id}`, { title, content });
      toast.success("Post updated");
      navigate(`/post/${id}`);
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Edit Post</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border rounded mb-3"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows="6"
        className="w-full p-3 border rounded mb-3"
      />

      <button
        onClick={updatePost}
        className="px-6 py-2 bg-blue-600 text-white rounded"
      >
        Update Post
      </button>
    </div>
  );
}
