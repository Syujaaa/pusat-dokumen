import React from "react";
import { Link } from "react-router-dom";
import { Stethoscope, Home, PlusCircle, BookOpen } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-6">
        {/* Logo dan Judul */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-2 rounded-full shadow">
            <Stethoscope className="w-5 h-5" />
          </div>
          <h1 className="text-lg md:text-xl font-bold text-blue-700">
            Edukasi Gagal Jantung
          </h1>
        </div>

      
        <div className="flex gap-8 items-center text-sm md:text-base font-medium">
          <Link
            to="/"
            className="flex items-center gap-1 text-gray-700 hover:text-blue-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Beranda
          </Link>

          <Link
            to="/add"
            className="flex items-center gap-1 text-gray-700 hover:text-blue-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Tambah
          </Link>

          <Link
            to="/booklet"
            className="flex items-center gap-1 text-gray-700 hover:text-blue-700 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Booklet
          </Link>
        </div>
      </div>
    </nav>
  );
}
