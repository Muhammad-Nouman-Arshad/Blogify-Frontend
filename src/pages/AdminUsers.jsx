import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Avatar from "../components/Avatar"; // ✅ USE REUSABLE AVATAR

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Toggle Admin Role
  const toggleAdmin = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";

    try {
      const res = await api.put(`/users/${user._id}`, { role: newRole });

      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? res.data.user || res.data : u))
      );

      toast.success(`Role updated to ${newRole}`);
    } catch {
      toast.error("Failed to update role");
    }
  };

  // Delete User
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;

    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-lg font-medium text-gray-600">
        Loading users...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-4xl font-bold mb-6 text-gray-800"
      >
        👥 Manage Users
      </motion.h1>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto rounded-xl shadow-lg border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, i) => (
              <motion.tr
                key={user._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b hover:bg-gray-50"
              >
                <td className="py-3 px-4 flex items-center gap-3">
                  <Avatar name={user.name} size={40} />
                  <span className="font-medium">{user.name}</span>
                </td>

                <td className="py-3 px-4 text-gray-700 break-all">
                  {user.email}
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="py-3 px-4 flex justify-center gap-3">
                  <button
                    onClick={() => toggleAdmin(user)}
                    className={`px-4 py-1.5 rounded-md text-white text-xs font-medium
                      ${
                        user.role === "admin"
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                  >
                    {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                  </button>

                  <button
                    onClick={() => deleteUser(user._id)}
                    className="px-4 py-1.5 rounded-md bg-red-500 text-white text-xs font-medium hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">
        {users.map((user, i) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white border rounded-xl shadow p-4"
          >
            <div className="flex items-center gap-3">
              <Avatar name={user.name} size={48} />
              <div>
                <p className="font-semibold text-gray-800 break-words">
                  {user.name}
                </p>
                <p className="text-sm text-gray-500 break-all">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="mt-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  user.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {user.role}
              </span>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => toggleAdmin(user)}
                className={`flex-1 py-2 rounded-lg text-white text-sm font-medium
                  ${
                    user.role === "admin"
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
              >
                {user.role === "admin" ? "Remove Admin" : "Make Admin"}
              </button>

              <button
                onClick={() => deleteUser(user._id)}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
