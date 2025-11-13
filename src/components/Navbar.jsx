import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Stethoscope,
  Home,
  PlusCircle,
  BookOpen,
  LogIn,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    Swal.fire({
      title: "Yakin ingin logout?",
      text: "Anda akan keluar dari akun admin.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, logout",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        Swal.fire({
          title: "Berhasil logout!",
          text: "Anda telah keluar dari sistem.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/login");
      }
    });
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-2 rounded-full shadow">
            <Stethoscope className="w-5 h-5" />
          </div>
          <h1 className="text-lg md:text-xl font-bold text-blue-700">
            Edukasi Gagal Jantung
          </h1>
        </div>

        {/* Menu */}
        <div className="flex gap-8 items-center text-sm md:text-base font-medium">
          <Link
            to="/"
            className="flex items-center gap-1 text-gray-700 hover:text-blue-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Beranda
          </Link>

          <Link
            to="/booklet"
            className="flex items-center gap-1 text-gray-700 hover:text-blue-700 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Booklet
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to="/add"
                className="flex items-center gap-1 text-gray-700 hover:text-blue-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Tambah Data
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 text-gray-700 hover:text-blue-700 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
