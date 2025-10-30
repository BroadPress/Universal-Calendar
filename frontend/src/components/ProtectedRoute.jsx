import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api"; // Axios instance

export default function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null); // null = checking, true/false = result

  useEffect(() => {
    const verifyUser = async () => {
      try {
        // 👇 call backend to verify token (cookie)
        await api.get("/auth/check", { withCredentials: true });
        setIsAuth(true);
      } catch (err) {
        setIsAuth(false);
      }
    };
    verifyUser();
  }, []);

  if (isAuth === null) return <p className="text-center mt-10">Checking authentication...</p>;

  return isAuth ? children : <Navigate to="/login" replace />;
}
