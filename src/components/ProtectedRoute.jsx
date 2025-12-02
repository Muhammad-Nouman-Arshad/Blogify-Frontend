// src/components/ProtectedRoute.jsx

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useContext(AuthContext);

  // Show loader until auth is restored (prevents redirect flicker)
  if (loading) {
    return (
      <div className="w-full text-center py-20 text-gray-500">
        Checking authentication...
      </div>
    );
  }

  // If user not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only route protection
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}