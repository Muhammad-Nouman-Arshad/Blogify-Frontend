import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { user, login, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // 🔁 If already logged in, redirect
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      // ✅ IMPORTANT: pass ONLY token
      login(res.data.token);

      toast.success("Logged in successfully!");
      navigate("/");
    } catch (err) {
      const msg = err?.response?.data?.message;
      toast.error(msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white p-8 border border-gray-200 rounded-lg shadow-sm"
      >
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 mb-8 text-sm">
          Log in to continue blogging.
        </p>

        <form onSubmit={loginUser} className="flex flex-col gap-5">
          <div>
            <label className="text-sm text-gray-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md
                         focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md
                         focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md
                       hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Please wait..." : "Login"}
          </motion.button>

          <p className="text-center text-gray-500 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
