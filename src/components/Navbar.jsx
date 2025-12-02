// src/components/Navbar.jsx
import { NavLink } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  const [openMobile, setOpenMobile] = useState(false);
  const [openAdminMenu, setOpenAdminMenu] = useState(false);
  const adminMenuRef = useRef(null);

  // ACTIVE LINK STYLE
  const activeLink = ({ isActive }) =>
    isActive
      ? "relative font-bold text-blue-600 after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-blue-600"
      : "text-gray-700 hover:text-blue-600 transition relative";

  // CLOSE ADMIN MENU ON OUTSIDE CLICK
  useEffect(() => {
    const close = (e) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(e.target)) {
        setOpenAdminMenu(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <nav className="backdrop-blur-xl bg-white/80 border-b border-gray-200 shadow-sm px-6 py-4 fixed top-0 left-0 w-full z-50">

      <div className="flex justify-between items-center">

        {/* ▪▪ Logo ▪▪ */}
        <NavLink
          to="/"
          className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Blogify
        </NavLink>

        {/* ▪▪ Desktop Menu (Hidden on Mobile) ▪▪ */}
        <div className="hidden md:flex items-center gap-8 text-gray-700 text-sm">

          <NavLink to="/" className={activeLink}>
            Home
          </NavLink>

          {/* Admin Menu */}
          {user?.role === "admin" && (
            <div className="relative" ref={adminMenuRef}>
              <button
                onClick={() => setOpenAdminMenu((prev) => !prev)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1.5 rounded-lg shadow transition"
              >
                Admin ▾
              </button>

              {openAdminMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg border">
                  <NavLink
                    to="/admin"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => setOpenAdminMenu(false)}
                  >
                    📊 Dashboard
                  </NavLink>
                  <NavLink
                    to="/admin/users"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => setOpenAdminMenu(false)}
                  >
                    👥 Manage Users
                  </NavLink>
                  <NavLink
                    to="/admin/posts"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => setOpenAdminMenu(false)}
                  >
                    📝 Manage Posts
                  </NavLink>
                  <NavLink
                    to="/admin/analytics"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => setOpenAdminMenu(false)}
                  >
                    📈 Analytics
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* User Logged In */}
          {user ? (
            <>
              <NavLink to="/create" className={activeLink}>
                Create
              </NavLink>
              <NavLink to="/profile" className={activeLink}>
                {user.name}
              </NavLink>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 shadow-sm"
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

        {/* ▪▪ Mobile Hamburger ▪▪ */}
        <button
          className="md:hidden text-3xl text-gray-700"
          onClick={() => setOpenMobile((prev) => !prev)}
        >
          {openMobile ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* ▪▪ Mobile Menu Slide Down ▪▪ */}
      {openMobile && (
        <div className="md:hidden mt-4 bg-white/90 border-t border-gray-200 py-4 space-y-3 text-gray-700 text-base">

          <NavLink to="/" className={activeLink} onClick={() => setOpenMobile(false)}>
            Home
          </NavLink>

          {/* Admin in Mobile */}
          {user?.role === "admin" && (
            <div className="pl-2 space-y-2">
              <p className="font-semibold text-blue-700">Admin</p>

              <NavLink
                to="/admin"
                className="block pl-4 py-1 hover:text-blue-600"
                onClick={() => setOpenMobile(false)}
              >
                📊 Dashboard
              </NavLink>
              <NavLink
                to="/admin/users"
                className="block pl-4 py-1 hover:text-blue-600"
                onClick={() => setOpenMobile(false)}
              >
                👥 Manage Users
              </NavLink>
              <NavLink
                to="/admin/posts"
                className="block pl-4 py-1 hover:text-blue-600"
                onClick={() => setOpenMobile(false)}
              >
                📝 Manage Posts
              </NavLink>
              <NavLink
                to="/admin/analytics"
                className="block pl-4 py-1 hover:text-blue-600"
                onClick={() => setOpenMobile(false)}
              >
                📈 Analytics
              </NavLink>
            </div>
          )}

          {user ? (
            <>
              <NavLink
                to="/create"
                className={activeLink}
                onClick={() => setOpenMobile(false)}
              >
                Create
              </NavLink>

              <NavLink
                to="/profile"
                className={activeLink}
                onClick={() => setOpenMobile(false)}
              >
                {user.name}
              </NavLink>

              <button
                onClick={() => {
                  logout();
                  setOpenMobile(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg block w-full"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={activeLink}
                onClick={() => setOpenMobile(false)}
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={activeLink}
                onClick={() => setOpenMobile(false)}
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
