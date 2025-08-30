import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      // check expiration
      if (decoded.exp * 1000 > Date.now()) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    } catch {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 > Date.now()) {
        setIsAuthenticated(true);
      }
    } catch {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
