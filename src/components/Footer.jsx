import React from "react";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-blue-50 border-t border-blue-200 mt-8 py-4">
      <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm flex flex-col items-center gap-1">
        <p className="flex items-center gap-1 justify-center">
          <a href="https://farrassyuja.my.id/" target="_BLANK" className="font-semibold text-blue-700">Farras Syuja</a>
        </p>
        <p>© {new Date().getFullYear()} Edukasi Gagal Jantung. All rights reserved.</p>
      </div>
    </footer>
  );
}
