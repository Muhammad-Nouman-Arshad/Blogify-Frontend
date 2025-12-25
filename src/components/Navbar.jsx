// Enhanced Navbar.jsx — Ultra Clean, Animated, Premium UI
// (React + TailwindCSS)

import { NavLink, useLocation } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const [openMobile, setOpenMobile] = useState(false);
  const [openAdminMenu, setOpenAdminMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const adminMenuRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setOpenMobile(false);
    setOpenAdminMenu(false);
  }, [location.pathname]);

  // Close Admin menu on outside click
  useEffect(() => {
    const close = (e) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(e.target)) {
        setOpenAdminMenu(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Navbar shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeLink = ({ isActive }) =>
    `block text-[15px] font-medium transition-all duration-300
     ${isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`;

  // Avatar
  const Avatar = ({ name }) => {
    const initials = name
      ? name.split(" ").map((n) => n[0]).join("").slice(0, 2)
      : "U";

    return (
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-semibold shadow-sm">
        {initials}
      </div>
    );
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/70 border-b transition-all
      ${scrolled ? "shadow-lg" : "shadow"}`}
    >
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Blogify
            </h1>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-7 text-[15px]">
            <NavLink to="/" className={activeLink}>Home</NavLink>

            {user?.role === "admin" && (
              <div className="relative" ref={adminMenuRef}>
                <button
                  onClick={() => setOpenAdminMenu((p) => !p)}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow"
                >
                  Admin ▾
                </button>

                {openAdminMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-lg border">
                    <NavLink to="/admin" className="block px-4 py-2 hover:bg-gray-100">📊 Dashboard</NavLink>
                    <NavLink to="/admin/users" className="block px-4 py-2 hover:bg-gray-100">👥 Users</NavLink>
                    <NavLink to="/admin/posts" className="block px-4 py-2 hover:bg-gray-100">📝 Posts</NavLink>
                    <NavLink to="/admin/analytics" className="block px-4 py-2 hover:bg-gray-100">📈 Analytics</NavLink>
                  </div>
                )}
              </div>
            )}

            {user ? (
              <div className="flex items-center gap-5">
                <NavLink to="/create" className={activeLink}>Create</NavLink>

                <NavLink to="/profile" className="flex items-center gap-2">
                  <Avatar name={user.name} />
                  <span>{user.name}</span>
                </NavLink>

                <button
                  onClick={logout}
                  className="px-4 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <NavLink to="/login" className={activeLink}>Login</NavLink>
                <NavLink to="/register" className={activeLink}>Register</NavLink>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-3xl text-gray-700"
            onClick={() => setOpenMobile((p) => !p)}
          >
            {openMobile ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* ================= MOBILE MENU (UPDATED) ================= */}
        <div
          className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${
            openMobile ? "max-h-[700px]" : "max-h-0"
          }`}
        >
          <div className="mt-3 mx-3 rounded-2xl bg-white shadow-lg border p-4 space-y-5">

            {/* User Info */}
            {user && (
              <div className="flex items-center gap-3 pb-3 border-b">
                <Avatar name={user.name} />
                <div>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
            )}

            {/* Links */}
            <div className="space-y-3">
              <NavLink to="/" className={activeLink}>Home</NavLink>
              {user && <NavLink to="/create" className={activeLink}>Create Post</NavLink>}
              {user && <NavLink to="/profile" className={activeLink}>Profile</NavLink>}
            </div>

            {/* Admin */}
            {user?.role === "admin" && (
              <div className="pt-3 border-t space-y-2">
                <p className="text-sm font-semibold text-blue-600">Admin Panel</p>
                <NavLink to="/admin" className="block pl-2 text-sm">📊 Dashboard</NavLink>
                <NavLink to="/admin/users" className="block pl-2 text-sm">👥 Users</NavLink>
                <NavLink to="/admin/posts" className="block pl-2 text-sm">📝 Posts</NavLink>
                <NavLink to="/admin/analytics" className="block pl-2 text-sm">📈 Analytics</NavLink>
              </div>
            )}

            {/* Auth Buttons */}
            <div className="pt-3 border-t">
              {user ? (
                <button
                  onClick={logout}
                  className="w-full bg-red-500 text-white py-2 rounded-xl font-medium"
                >
                  Logout
                </button>
              ) : (
                <div className="flex gap-3">
                  <NavLink to="/login" className="flex-1 text-center py-2 rounded-xl border font-medium">
                    Login
                  </NavLink>
                  <NavLink to="/register" className="flex-1 text-center py-2 rounded-xl bg-blue-600 text-white font-medium">
                    Register
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* ================= END MOBILE MENU ================= */}
      </div>
    </nav>
  );
}
