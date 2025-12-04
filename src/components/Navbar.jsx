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

  // Animated Active Link Styles
  const activeLink = ({ isActive }) =>
    `relative px-1 py-1 font-medium transition-all duration-300 group
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
          <NavLink to="/" className="flex items-center">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text tracking-tight">
              Blogify
            </h1>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-7 text-[15px]">
            <NavLink to="/" className={activeLink}>
              <span
                className="after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-full after:bg-blue-600 after:scale-x-0
                group-hover:after:scale-x-100 transition-transform duration-300"
              >
                Home
              </span>
            </NavLink>

            {/* ADMIN MENU */}
            {user?.role === "admin" && (
              <div className="relative" ref={adminMenuRef}>
                <button
                  onClick={() => setOpenAdminMenu((p) => !p)}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow hover:brightness-110 transition-all"
                >
                  Admin ▾
                </button>

                {openAdminMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-lg border animate-fadeIn">
                    <NavLink to="/admin" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                      📊 Dashboard
                    </NavLink>
                    <NavLink to="/admin/users" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                      👥 Manage Users
                    </NavLink>
                    <NavLink to="/admin/posts" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                      📝 Manage Posts
                    </NavLink>
                    <NavLink to="/admin/analytics" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                      📈 Analytics
                    </NavLink>
                  </div>
                )}
              </div>
            )}

            {/* Authorized */}
            {user ? (
              <div className="flex items-center gap-5">
                <NavLink to="/create" className={activeLink}>
                  <span
                    className="after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-full after:bg-blue-600 after:scale-x-0
                    group-hover:after:scale-x-100 transition-transform duration-300"
                  >
                    Create
                  </span>
                </NavLink>

                <NavLink to="/profile" className={activeLink}>
                  <div className="flex items-center gap-2">
                    <Avatar  name={user.name.toUpperCase()} />
                    <span>{user.name}</span> 
                  </div>
                </NavLink>

                <button
                  onClick={logout}
                  className="px-4 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition shadow"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <NavLink to="/login" className={activeLink}>
                  Login
                </NavLink>
                <NavLink to="/register" className={activeLink}>
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden text-3xl text-gray-700"
            onClick={() => setOpenMobile((p) => !p)}
          >
            {openMobile ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${
            openMobile ? "max-h-[550px]" : "max-h-0"
          }`}
        >
          <div className="py-4 space-y-3 border-t mt-2">
            <NavLink to="/" className={activeLink}>
              Home
            </NavLink>

            {user?.role === "admin" && (
              <div className="pl-2 space-y-1">
                <p className="font-semibold text-blue-700">Admin</p>
                <NavLink to="/admin" className="block pl-4 py-1">📊 Dashboard</NavLink>
                <NavLink to="/admin/users" className="block pl-4 py-1">👥 Manage Users</NavLink>
                <NavLink to="/admin/posts" className="block pl-4 py-1">📝 Manage Posts</NavLink>
                <NavLink to="/admin/analytics" className="block pl-4 py-1">📈 Analytics</NavLink>
              </div>
            )}

            {user ? (
              <>
                <NavLink to="/create" className={activeLink}>
                  Create
                </NavLink>
                <NavLink to="/profile" className={activeLink}>
                  <div className="flex items-center gap-2">
                    <Avatar name={user.name} /> {user.name}
                  </div>
                </NavLink>
                <button
                  onClick={() => logout()}
                  className="w-full bg-red-500 text-white py-2 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={activeLink}>
                  Login
                </NavLink>
                <NavLink to="/register" className={activeLink}>
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}