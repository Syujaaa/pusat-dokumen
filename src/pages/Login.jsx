import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hcaptchaToken, setHcaptchaToken] = useState("");

  const [errorUser, setErrorUser] = useState("");
  const [errorPass, setErrorPass] = useState("");
  const [errorCaptcha, setErrorCaptcha] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

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
    if (!hcaptchaToken) {
      setErrorCaptcha("Silakan centang hCaptcha terlebih dahulu");
      hasError = true;
    }

    if (hasError) return;

    Swal.fire({
      title: "Loading...",
      text: "Tunggu sebentar...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await api.post("/api/login", {
        username,
        password,
        hcaptcha: hcaptchaToken,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("user_id", res.data.id);

      api.defaults.headers.common["Authorization"] =
        `Bearer ${res.data.token}`;

      await Swal.fire({
        icon: "success",
        title: "Login Berhasil!",
        text: `Selamat datang, ${res.data.username}!`,
        confirmButtonColor: "#2563eb",
      });

      navigate("/data-pasien");
    } catch (err) {
      const msg = err.response?.data?.message || "Login gagal.";

      await Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: msg,
        confirmButtonColor: "#ef4444",
      });

      setHcaptchaToken("");
    }
  };

  return (
    <div className="flex items-center justify-center h-[85vh]">
      <div className="w-full max-w-sm p-8 bg-white rounded-3xl shadow-xl border border-blue-100">

        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              fill="currentColor" className="w-10 h-10">
              <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-5 14h-4v-3H7v-4h3V7h4v3h3v4h-3v3z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-800">Login Admin</h2>
          <p className="text-gray-500 text-sm mt-1">Sistem Edukasi Pasien</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 bg-gray-50 ${
                errorUser ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
              }`}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrorUser("");
              }}
              placeholder="Masukkan username"
            />
            {errorUser && <p className="mt-1 text-sm text-red-600">{errorUser}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full px-4 py-2.5 border rounded-xl pr-12 focus:ring-2 bg-gray-50 ${
                  errorPass ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
                }`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorPass("");
                }}
                placeholder="Masukkan password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {errorPass && <p className="mt-1 text-sm text-red-600">{errorPass}</p>}
          </div>

          <div className="flex justify-center">
            <div>
              <HCaptcha
                sitekey="3c52a37e-8f62-4896-8dfa-cb0ae51a0728"
                onVerify={(token) => {
                  setHcaptchaToken(token);
                  setErrorCaptcha("");
                }}
              />
              {errorCaptcha && <p className="mt-1 text-sm text-red-600">{errorCaptcha}</p>}
            </div>
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
