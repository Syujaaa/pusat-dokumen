import React from "react";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#F5F9FF] border-t border-blue-200 mt-8 py-4 no-print">
      <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm flex flex-col items-center gap-1">
        <p className="flex items-center gap-1 justify-center">
          <a
            href="https://farrassyuja.my.id/"
            target="_BLANK"
            className="font-semibold text-blue-700 hover:underline"
          >
            Farras Syuja
          </a>
        </p>

        <p className="text-gray-700">
          © {new Date().getFullYear()} Edukasi Gagal Jantung. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
