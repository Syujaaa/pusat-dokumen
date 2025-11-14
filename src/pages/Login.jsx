import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorUser, setErrorUser] = useState("");
  const [errorPass, setErrorPass] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    let hasError = false;

    if (!username.trim()) {
      setErrorUser("Username tidak boleh kosong");
      hasError = true;
    }
    if (!password.trim()) {
      setErrorPass("Password tidak boleh kosong");
      hasError = true;
    }

    if (hasError) return;

    Swal.fire({
      title: "Loading...",
      text: "Tunggu sebentar...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const res = await api.post(
        "https://edukasijantungapi.syujaaa.deno.net/api/login",
        {
          username,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);

      await Swal.fire({
        icon: "success",
        title: "Login Berhasil!",
        text: `Selamat datang, ${res.data.username}!`,
        confirmButtonColor: "#2563eb",
      });

      navigate("/");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Login gagal. Periksa username dan password.";

      await Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: msg,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-[85vh] ">
      <div className="w-full max-w-sm p-8 bg-white rounded-3xl shadow-xl border border-blue-100">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-10 h-10"
            >
              <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-5 14h-4v-3H7v-4h3V7h4v3h3v4h-3v3z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-800">Login Admin</h2>
          <p className="text-gray-500 text-sm mt-1">
            Sistem Edukasi Pasien
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:outline-none bg-gray-50 ${
                errorUser
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errorUser) setErrorUser("");
              }}
              placeholder="Masukkan username"
            />
            {errorUser && (
              <p className="mt-1 text-sm text-red-600">{errorUser}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full px-4 py-2.5 border rounded-xl pr-12 focus:ring-2 focus:outline-none bg-gray-50 ${
                  errorPass
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorPass) setErrorPass("");
                }}
                placeholder="Masukkan password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.03 5.228 7.178 10.066 7.178 1.72 0 3.36-.37 4.823-1.037M6.228 6.228A10.451 10.451 0 0112 4.822c4.838 0 8.774 3.148 10.066 7.178a10.523 10.523 0 01-4.132 5.527M6.228 6.228l11.544 11.544M6.228 6.228L4.5 4.5m13.272 13.272L19.5 19.5"
                    />
                  </svg>
                )}
              </button>
            </div>

            {errorPass && (
              <p className="mt-1 text-sm text-red-600">{errorPass}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 mt-4 text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition font-semibold shadow-md"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
