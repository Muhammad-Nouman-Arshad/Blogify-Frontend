// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppButton from "./components/WhatsAppButton";  // ✅ NEW

import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SinglePost from "./pages/SinglePost";

// User pages
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminPosts from "./pages/AdminPosts";
import AdminAnalytics from "./pages/AdminAnalytics";

export default function App() {
  return (
    <Router>
      {/* NAVBAR */}
      <Navbar />

      {/* TOASTER */}
      <Toaster position="top-right" />

      {/* MAIN CONTENT */}
      <main className="pt-24 pb-10 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollToTop />

          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/post/:id" element={<SinglePost />} />

            {/* USER ROUTES */}
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* ADMIN ROUTES */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/posts"
              element={
                <ProtectedRoute adminOnly>
                  <AdminPosts />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute adminOnly>
                  <AdminAnalytics />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />

      {/* ✅ FLOATING WHATSAPP BUTTON */}
      <WhatsAppButton />
    </Router>
  );
}