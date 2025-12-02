import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (err) {
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

      setUsers(
        users.map((u) =>
          u._id === user._id ? res.data.user || res.data : u
        )
      );

      toast.success(`Role updated to ${newRole}`);
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  // Delete User
  const deleteUser = async (id) => {
    if (!confirm("Delete this user permanently?")) return;

    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-lg font-medium text-gray-600">
        Loading users...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8 text-gray-800"
      >
        👥 Manage Users
      </motion.h1>

      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 bg-white">
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
                className="border-b hover:bg-gray-50 transition"
              >
                {/* User Avatar + Name */}
                <td className="py-3 px-4 flex items-center gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/notable/svg?seed=${user.name}`}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border shadow-sm"
                  />
                  <span className="font-medium text-gray-900">{user.name}</span>
                </td>

                {/* Email */}
                <td className="py-3 px-4 text-gray-700">{user.email}</td>

                {/* Role Badge */}
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

                {/* ACTION BUTTONS */}
                <td className="py-3 px-4 flex justify-center gap-3">

                  {/* Make Admin / Remove Admin */}
                  <button
                    onClick={() => toggleAdmin(user)}
                    className={`px-4 py-1.5 rounded-md text-white text-xs font-medium shadow 
                      ${
                        user.role === "admin"
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                  >
                    {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="px-4 py-1.5 rounded-md bg-red-500 text-white text-xs font-medium shadow hover:bg-red-600"
                  >
                    Delete
                  </button>

                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
