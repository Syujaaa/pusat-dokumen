import React, { useEffect, useState } from "react";
import api from "../api";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";

function formatTanggalIndo(dateString) {
  const d = new Date(dateString);

  const formatter = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return formatter.format(d);
}

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentToken = localStorage.getItem("token");

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/sessions");
      setSessions(res.data.sessions || []);
    } catch (error) {
      console.error("Gagal memuat session:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, token) => {
    if (token === currentToken) {
      Swal.fire({
        icon: "error",
        title: "Tidak bisa menghapus session yang sedang digunakan",
        text: "Anda tidak dapat menghapus session aktif Anda sendiri.",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Hapus session?",
      text: "Session ini akan dikeluarkan dari sistem.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Menghapus...",
        html: "Mohon tunggu sebentar",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      try {
        await api.delete(`/api/sessions/${id}`);
        Swal.fire({
          icon: "success",
          title: "Session dihapus!",
          timer: 1200,
          showConfirmButton: false,
        });
        fetchSessions();
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Gagal menghapus session",
        });
      }
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-8 mt-16 border border-blue-100">
      <h2 className="text-2xl font-bold text-[#0F3C64] mb-6">
        Manajemen Session Login
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border border-blue-200 rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">Mulai Login</th>
              <th className="p-3">IP Address</th>
              <th className="p-3">Device</th>
              <th className="p-3">Info Perangkat</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : sessions.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-gray-500 italic"
                >
                  Tidak ada session tersedia
                </td>
              </tr>
            ) : (
              sessions.map((s) => {
                const isSelf = s.token === currentToken;

                return (
                  <tr key={s.id} className="odd:bg-blue-50 hover:bg-blue-100">
                    <td className="p-3">{formatTanggalIndo(s.created_at)}</td>
                    <td className="p-3">{s.ip_address || "-"}</td>
                    <td className="p-3">{s.device_type || "-"}</td>
                    <td className="p-3">{s.device_info || "-"}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(s.id, s.token)}
                        disabled={isSelf}
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-1 mx-auto ${
                          isSelf
                            ? "bg-gray-400 cursor-not-allowed text-white"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                      >
                        <FaTrash /> Hapus
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
