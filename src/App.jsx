import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddEdit from "./pages/AddEdit";
import Navbar from "./components/Navbar";
import DocumentCenter from "./pages/DocumentCenter";
import Login from "./pages/Login";
import ViewDetail from "./pages/ViewDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer"; 
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="min-h-screen bg-[#E8F1FF] flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-5xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <AddEdit />
                </ProtectedRoute>
              }
            />
            <Route path="/booklet" element={<DocumentCenter />} />
            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute>
                  <AddEdit />
                </ProtectedRoute>
              }
            />
            <Route path="/detail/:id" element={<ViewDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>

      <Footer /> 
    </div>
  );
}
