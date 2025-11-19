import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Stethoscope,
  Home,
  PlusCircle,
  BookOpen,
  LogIn,
  LogOut,
  Menu,
  X,
  Users,
  List
} from "lucide-react";
import api from "../api";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  const isActive = (path) => {
    return location.pathname === path
      ? "text-blue-700 font-semibold"
      : "text-gray-700";
  };

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
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");

        try {
          await api.post("/api/logout", { token });
        } catch (err) {
          console.warn("Logout API error (tetap lanjut):", err);
        }

        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("user_id");

        delete api.defaults.headers.common["Authorization"];

        window.dispatchEvent(new Event("tokenChanged"));

        Swal.fire({
          title: "Berhasil logout!",
          text: "Anda telah keluar dari sistem.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/");
      }
    });
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#F5F9FF] border-b border-blue-200 shadow-sm z-50 no-print">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-6">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-2 rounded-full shadow">
            <Stethoscope className="w-5 h-5" />
          </div>

          <h1 className="text-base font-bold text-blue-700 md:hidden">
            Edukasi GJ
          </h1>

          <h1 className="hidden md:block text-lg md:text-xl font-bold text-blue-700">
            Edukasi Gagal Jantung
          </h1>
        </div>

        <button
          className="md:hidden p-2 text-gray-700"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="hidden md:flex gap-8 items-center text-sm md:text-base font-medium">
          {!isLoggedIn && (
            <Link
              to="/"
              className={`flex items-center gap-1 hover:text-blue-700 transition-colors ${isActive(
                "/"
              )}`}
            >
              <Home className="w-4 h-4" />
              Beranda
            </Link>
          )}

          {/* <Link
            to="/data-pasien"
            className={`flex items-center gap-1 hover:text-blue-700 transition-colors ${isActive(
              "/data-pasien"
            )}`}
          >
            <Users className="w-4 h-4" />
            Data Pasien
          </Link> */}

          <Link
            to="/booklet"
            className={`flex items-center gap-1 hover:text-blue-700 transition-colors ${isActive(
              "/booklet"
            )}`}
          >
            <BookOpen className="w-4 h-4" />
            Booklet
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to="/add"
                className={`flex items-center gap-1 hover:text-blue-700 transition-colors ${isActive(
                  "/add"
                )}`}
              >
                <PlusCircle className="w-4 h-4" />
                Tambah Data
              </Link>

              <Link
                to="/sessions"
                className={`flex items-center gap-1 hover:text-blue-700 transition-colors ${isActive(
                  "/sessions"
                )}`}
              >
                <List className="w-4 h-4" />
                Sessions
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
            <>
              <Link
                to="/login"
                className={`flex items-center gap-1 hover:text-blue-700 transition-colors ${isActive(
                  "/login"
                )}`}
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-[#F5F9FF] border-t border-blue-200 shadow-inner">
          <div className="flex flex-col py-3 px-6 gap-4 text-gray-700 text-base">
            {!isLoggedIn && (
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 ${isActive("/")}`}
              >
                <Home className="w-5 h-5" />
                Beranda
              </Link>
            )}

            <Link
              to="/data-pasien"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 ${isActive("/data-pasien")}`}
            >
              <Users className="w-5 h-5" />
              Data Pasien
            </Link>

            <Link
              to="/booklet"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 ${isActive("/booklet")}`}
            >
              <BookOpen className="w-5 h-5" />
              Booklet
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/add"
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 ${isActive("/add")}`}
                >
                  <PlusCircle className="w-5 h-5" />
                  Tambah Data
                </Link>

                <Link
                to="/sessions"
                className={`flex items-center gap-1 hover:text-blue-700 transition-colors ${isActive(
                  "/sessions"
                )}`}
              >
                <List className="w-4 h-4" />
                Sessions
              </Link>

                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 ${isActive("/login")}`}
                >
                  <LogIn className="w-5 h-5" />
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
