// src/components/Navbar.jsx

import { NavLink, useLocation } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const [openMobile, setOpenMobile] = useState(false);
  const [openAdminMenu, setOpenAdminMenu] = useState(false);
  const adminRef = useRef(null);

  // ---------- NAME FORMAT ----------
  const formatName = (name = "User") =>
    name
      .trim()
      .split(" ")
      .filter(Boolean)
      .map(
        (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
      )
      .join(" ");

  // ---------- AVATAR ----------
  const Avatar = ({ name }) => {
    const initials = name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "U";

    return (
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-semibold">
        {initials}
      </div>
    );
  };

  // ---------- LINK STYLES ----------
  const desktopLink = ({ isActive }) =>
    `relative px-1 py-2 text-[15px] font-medium transition-colors
     ${isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}
     after:content-[''] after:absolute after:left-0 after:-bottom-1
     after:h-[2px] after:w-full after:bg-blue-600 after:rounded-full
     after:scale-x-0 after:origin-left after:transition-transform
     ${isActive ? "after:scale-x-100" : "hover:after:scale-x-100"}`;

  const mobileLink = ({ isActive }) =>
    `block px-3 py-2 rounded-lg font-medium transition
     ${
       isActive
         ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
         : "text-gray-700 hover:bg-gray-100"
     }`;

  // ---------- EFFECTS ----------
  useEffect(() => {
    setOpenMobile(false);
    setOpenAdminMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const close = (e) => {
      if (adminRef.current && !adminRef.current.contains(e.target)) {
        setOpenAdminMenu(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-5">
        {/* ================= TOP BAR ================= */}
        <div className="flex justify-between items-center h-16">
          <NavLink to="/" className="text-3xl font-extrabold text-blue-600">
            Blogify
          </NavLink>

          {/* ================= DESKTOP ================= */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={desktopLink}>
              Home
            </NavLink>

            {/* ---------- AUTHED USER ---------- */}
            {user ? (
              <>
                {user.role === "admin" && (
                  <div className="relative" ref={adminRef}>
                    <button
                      onClick={() => setOpenAdminMenu((p) => !p)}
                      className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm"
                    >
                      Admin ▾
                    </button>

                    {openAdminMenu && (
                      <div className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-lg overflow-hidden">
                        <NavLink to="/admin" end className="block px-4 py-2 hover:bg-gray-100">
                          📊 Dashboard
                        </NavLink>
                        <NavLink to="/admin/users" className="block px-4 py-2 hover:bg-gray-100">
                          👥 Users
                        </NavLink>
                        <NavLink to="/admin/posts" className="block px-4 py-2 hover:bg-gray-100">
                          📝 Posts
                        </NavLink>
                        <NavLink to="/admin/analytics" className="block px-4 py-2 hover:bg-gray-100">
                          📈 Analytics
                        </NavLink>
                      </div>
                    )}
                  </div>
                )}

                <NavLink to="/create" className={desktopLink}>
                  Create
                </NavLink>

                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1 rounded-lg transition
                     ${isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`
                  }
                >
                  <Avatar name={user.name} />
                  <span>{formatName(user.name)}</span>
                </NavLink>

                <button
                  onClick={logout}
                  className="px-4 py-1.5 bg-red-500 text-white rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              /* ---------- GUEST ---------- */
              <>
                <NavLink to="/login" className={desktopLink}>
                  Login
                </NavLink>
                <NavLink to="/register" className={desktopLink}>
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* ================= MOBILE TOGGLE ================= */}
          <button
            className="md:hidden text-3xl"
            onClick={() => setOpenMobile((p) => !p)}
          >
            {openMobile ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* ================= MOBILE MENU ================= */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            openMobile ? "max-h-[800px]" : "max-h-0"
          }`}
        >
          <div className="mt-4 bg-white border rounded-2xl shadow-lg p-4 space-y-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 pb-3 border-b">
                  <Avatar name={user.name} />
                  <div>
                    <p className="font-semibold">{formatName(user.name)}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>

                <NavLink to="/" className={mobileLink}>Home</NavLink>
                <NavLink to="/create" className={mobileLink}>Create</NavLink>
                <NavLink to="/profile" className={mobileLink}>Profile</NavLink>

                {user.role === "admin" && (
                  <div className="pt-3 border-t space-y-2">
                    <p className="text-sm font-semibold text-blue-600">Admin Panel</p>
                    <NavLink to="/admin" end className={mobileLink}>📊 Dashboard</NavLink>
                    <NavLink to="/admin/users" className={mobileLink}>👥 Users</NavLink>
                    <NavLink to="/admin/posts" className={mobileLink}>📝 Posts</NavLink>
                    <NavLink to="/admin/analytics" className={mobileLink}>📈 Analytics</NavLink>
                  </div>
                )}

                <button
                  onClick={logout}
                  className="w-full bg-red-500 text-white py-2 rounded-xl"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/" className={mobileLink}>Home</NavLink>
                <NavLink to="/login" className={mobileLink}>Login</NavLink>
                <NavLink to="/register" className={mobileLink}>Register</NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
