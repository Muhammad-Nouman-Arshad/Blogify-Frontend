// Enhanced Navbar.jsx — Ultra Clean, Animated, Premium UI
// Active link: bold + gradient + underline indicator

import { NavLink, useLocation } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { HiMenu, HiX } from "react-icons/hi";

// ================= NAME FORMATTER =================
const formatName = (name = "") =>
  name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : "User";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const [openMobile, setOpenMobile] = useState(false);
  const [openAdminMenu, setOpenAdminMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const adminMenuRef = useRef(null);

  useEffect(() => {
    setOpenMobile(false);
    setOpenAdminMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const close = (e) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(e.target)) {
        setOpenAdminMenu(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ================= ACTIVE LINK STYLE =================
  const activeLink = ({ isActive }) =>
    `
    relative px-1 py-1 text-[15px] transition-all duration-300
    ${
      isActive
        ? "font-bold text-blue-600 after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[3px] after:rounded-full after:bg-gradient-to-r after:from-blue-600 after:to-purple-600"
        : "font-medium text-gray-700 hover:text-blue-600"
    }
  `;

  // ================= AVATAR =================
  const Avatar = ({ name }) => {
    const initials = formatName(name)
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2);

    return (
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-semibold shadow">
        {initials}
      </div>
    );
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/80 border-b transition-all ${
        scrolled ? "shadow-lg" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <NavLink to="/">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Blogify
            </h1>
          </NavLink>

          {/* ================= DESKTOP ================= */}
          <div className="hidden md:flex items-center gap-8">
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
                  <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-xl border overflow-hidden">
                    <NavLink to="/admin" className="block px-4 py-2 hover:bg-gray-100">📊 Dashboard</NavLink>
                    <NavLink to="/admin/users" className="block px-4 py-2 hover:bg-gray-100">👥 Users</NavLink>
                    <NavLink to="/admin/posts" className="block px-4 py-2 hover:bg-gray-100">📝 Posts</NavLink>
                    <NavLink to="/admin/analytics" className="block px-4 py-2 hover:bg-gray-100">📈 Analytics</NavLink>
                  </div>
                )}
              </div>
            )}

            {user ? (
              <div className="flex items-center gap-6">
                <NavLink to="/create" className={activeLink}>Create</NavLink>

                <NavLink to="/profile" className="flex items-center gap-2">
                  <Avatar name={user.name} />
                  <span className="font-semibold text-gray-800">
                    {formatName(user.name)}
                  </span>
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

          {/* ================= MOBILE TOGGLE ================= */}
          <button
            className="md:hidden text-3xl text-gray-700"
            onClick={() => setOpenMobile((p) => !p)}
          >
            {openMobile ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* ================= MOBILE MENU ================= */}
        <div
          className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${
            openMobile ? "max-h-[700px]" : "max-h-0"
          }`}
        >
          <div className="mt-3 mx-3 rounded-2xl bg-white shadow-lg border p-4 space-y-5">

            {user && (
              <div className="flex items-center gap-3 pb-3 border-b">
                <Avatar name={user.name} />
                <div>
                  <p className="font-semibold">{formatName(user.name)}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <NavLink to="/" className={activeLink}>Home</NavLink>
              {user && <NavLink to="/create" className={activeLink}>Create</NavLink>}
              {user && <NavLink to="/profile" className={activeLink}>Profile</NavLink>}
            </div>

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
      </div>
    </nav>
  );
}
