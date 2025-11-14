import React from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import animation404 from "../assets/404.json";

export default function NotFound() {
  return (
    <div className="relative w-full h-[80vh]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center px-5">
        <div className="w-[500px] md:w-[800px]">
          <Lottie animationData={animation404} loop={true} />
        </div>

        <p className="text-xl text-gray-600 mb-6 mt-4 text-center">
          Halaman yang Anda cari tidak ditemukan.
        </p>

        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white text-lg rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
