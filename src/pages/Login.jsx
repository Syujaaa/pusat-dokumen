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

    try {
      const res = await api.post("https://edukasijantungapi.onrender.com/api/login", {
        username,
        password,
      });

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
    <div className="flex items-center justify-center mt-50 bg-gray-100 overflow-hidden">
      <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login Admin
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                errorUser
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-blue-500"
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
            <input
              type="password"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                errorPass
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-blue-500"
              }`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorPass) setErrorPass(""); 
              }}
              placeholder="Masukkan password"
            />
            {errorPass && (
              <p className="mt-1 text-sm text-red-600">{errorPass}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
