import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Load user from token
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);

        setUser({
          _id: decoded.id,
          role: decoded.role,
        });
      } catch (err) {
        console.error("Invalid token");
        localStorage.removeItem("token");
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  // LOGIN
  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);

    setUser({
      _id: decoded.id,
      role: decoded.role,
    });
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
