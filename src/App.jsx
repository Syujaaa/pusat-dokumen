import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import AddEdit from "./pages/AddEdit";
import Navbar from "./components/Navbar";
import DocumentCenter from "./pages/DocumentCenter";
import Login from "./pages/Login";
import ViewDetail from "./pages/ViewDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import GuestRoute from "./pages/GuestRoute";
import api from "./api";
import Sessions from "./pages/Sessions";

export default function App() {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogin(!!token);

    const handleTokenChange = () => {
      const updatedToken = localStorage.getItem("token");
      setIsLogin(!!updatedToken);
    };

    window.addEventListener("tokenChanged", handleTokenChange);

    return () => {
      window.removeEventListener("tokenChanged", handleTokenChange);
    };
  }, []);
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        await api.get("/api/check-auth");
      } catch (err) {
        console.warn("Session invalid. Auto logout.");

        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("user_id");

        delete api.defaults.headers.common["Authorization"];

        window.dispatchEvent(new Event("tokenChanged"));
        navigate("/");
      }
    };

    checkSession();

    window.addEventListener("tokenChanged", checkSession);

    return () => window.removeEventListener("tokenChanged", checkSession);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#E8F1FF] flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-5xl mx-auto p-4">
          <Routes>
            <Route
              path="/"
              element={
                isLogin ? (
                  <Navigate to="/data-pasien" replace />
                ) : (
                  <LandingPage />
                )
              }
            />

            <Route
              path="/data-pasien"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <AddEdit />
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute>
                  <AddEdit />
                </ProtectedRoute>
              }
            />

            <Route
              path="/sessions"
              element={
                <ProtectedRoute>
                  <Sessions />
                </ProtectedRoute>
              }
            />

            <Route path="/booklet" element={<DocumentCenter />} />
            <Route
              path="/detail/:id"
              element={
                <ProtectedRoute>
                  <ViewDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>

      <Footer />
    </div>
  );
}
