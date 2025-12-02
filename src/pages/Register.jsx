import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // <<--- IMPORTANT

  const registerUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        role: form.email === "admin@gmail.com" ? "admin" : "user",
      };

      await api.post("/auth/register", payload);

      toast.success("Account created successfully!");

      setForm({ name: "", email: "", password: "" });

      navigate("/login"); // <<--- REDIRECT HERE
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white p-8 border border-gray-200 rounded-lg shadow-sm"
      >
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mb-8 text-sm">
          Join Blogify and start sharing.
        </p>

        <form onSubmit={registerUser} className="flex flex-col gap-5">
          <div>
            <label className="text-sm text-gray-700">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 
              focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 
              focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 
              focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium
            hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Please wait..." : "Register"}
          </motion.button>

          <p className="text-center text-gray-500 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
