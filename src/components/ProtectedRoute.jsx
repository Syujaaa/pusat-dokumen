import React from "react";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire({
      icon: "warning",
      title: "Akses Ditolak",
      text: "Silakan login terlebih dahulu untuk melanjutkan.",
      confirmButtonColor: "#2563eb", 
    });
    return <Navigate to="/login" replace />;
  }

  return children;
}
