import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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

export default function App() {
  const [isLogin, setIsLogin] = useState(false);

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

         
            <Route path="/data-pasien" element={<Home />} />

           
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

            
            <Route path="/booklet" element={<DocumentCenter />} />
            <Route path="/detail/:id" element={<ViewDetail />} />


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
