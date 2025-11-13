import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

export default function Home() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("desc");

  const fetchData = async () => {
    try {
      const res = await api.get(`?search=${search}&sort=${sort}`);
      setData(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, sort]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus data ini?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/${id}`);
        Swal.fire({
          icon: "success",
          title: "Data berhasil dihapus!",
          showConfirmButton: false,
          timer: 1500,
        });
        fetchData();
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Gagal menghapus data!",
          text: "Terjadi kesalahan pada server.",
        });
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-16">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <input
          type="text"
          placeholder="🔍 Cari nama / RM / edukator..."
          className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="desc">📅 Terbaru</option>
          <option value="asc">⏳ Terlama</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full border-collapse bg-white text-sm text-gray-700">
          <thead className="bg-blue-600 text-white sticky top-0">
            <tr>
              <th className="px-4 py-3 text-center font-semibold">No</th>
              <th className="px-4 py-3 text-left font-semibold">Nama Pasien</th>
              <th className="px-4 py-3 text-left font-semibold">No. RM</th>
              <th className="px-4 py-3 text-center font-semibold">
                Tanggal Edukasi
              </th>
              <th className="px-4 py-3 text-left font-semibold">Edukator</th>
              <th className="px-4 py-3 text-left font-semibold">Kesimpulan</th>
              <th className="px-4 py-3 text-center font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, i) => (
                <tr
                  key={item.id}
                  className="hover:bg-blue-50 transition-colors duration-150 border-b"
                >
                  <td className="px-4 py-2 text-center">{i + 1}</td>
                  <td className="px-4 py-2 font-medium">{item.nama_pasien}</td>
                  <td className="px-4 py-2">{item.no_rm}</td>
                  <td className="px-4 py-2 text-center">
                    {new Date(item.tanggal_edukasi).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </td>
                  <td className="px-4 py-2">{item.edukator}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-md text-sm font-semibold ${
                        item.kesimpulan === "Siap pulang"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.kesimpulan}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center flex justify-center gap-2">
                    {localStorage.getItem("token") ? (
                      <>
                        <Link
                          to={`/edit/${item.id}`}
                          className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md transition"
                        >
                          <FaEdit /> Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                        >
                          <FaTrash /> Hapus
                        </button>
                      </>
                    ) : (
                      <Link
                        to={`/detail/${item.id}`}
                        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition"
                      >
                        🔍 Lihat Detail
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500 italic"
                >
                  Tidak ada data ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
