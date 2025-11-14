import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Home() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `?search=${search}&sort=${sort}&page=${page}&limit=${limit}`
      );
      setData(res.data.data || []);
      setTotalRows(res.data.totalRows || 0);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, sort, page, limit]);

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

  const columns = [
    {
      name: "No",
      selector: (row, index) => (page - 1) * limit + index + 1,
      width: "70px",
      center: true,
    },
    {
      name: "Nama",
      selector: (row) => row.nama_pasien,
      sortable: true,
    },
    {
      name: "No. RM",
      selector: (row) => row.no_rm,
      sortable: true,
      width: "120px",
    },
    {
      name: "Tanggal Edukasi",
      selector: (row) =>
        new Date(row.tanggal_edukasi).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      sortable: true,
      width: "170px",
      center: true,
    },
    {
      name: "Edukator",
      selector: (row) => row.edukator,
      sortable: true,
    },
    {
      name: "Kesimpulan",
      cell: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-semibold ${
            row.kesimpulan === "Siap pulang"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {row.kesimpulan === "Siap pulang" ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Aksi",
      cell: (row) =>
        localStorage.getItem("token") ? (
          <div className="flex gap-2">
            <Link
              to={`/edit/${row.id}`}
              className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md transition"
            >
              <FaEdit /> Edit
            </Link>
            <button
              onClick={() => handleDelete(row.id)}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
            >
              <FaTrash /> Hapus
            </button>
          </div>
        ) : (
          <Link
            to={`/detail/${row.id}`}
            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition"
          >
            🔍 Lihat Detail
          </Link>
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "220px",
    },
  ];

  const customStyles = {
    header: {
      style: {
        minHeight: "56px",
        fontSize: "18px",
        color: "#0f3c64",
      },
    },
    headRow: {
      style: {
        backgroundColor: "#0f62ac",
        color: "#fff",
        fontWeight: "600",
      },
    },
    rows: {
      style: {
        backgroundColor: "#fff",
        "&:nth-of-type(odd)": {
          backgroundColor: "#f8fbff",
        },
        "&:hover": {
          backgroundColor: "#e7f3ff",
          cursor: "pointer",
        },
      },
    },
    pagination: {
      style: {
        borderTop: "1px solid #e5e7eb",
        paddingTop: "12px",
        paddingBottom: "12px",
        color: "#0F3C64",
        fontWeight: "600",
        fontSize: "14px",
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8 mt-16 border border-blue-100">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-sm mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-5 14h-4v-3H7v-4h3V7h4v3h3v4h-3v3z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-[#0F3C64]">
          Data Edukasi Pasien
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <input
          type="text"
          placeholder="🔍 Cari nama / RM / edukator..."
          className="border border-blue-200 rounded-lg px-4 py-2.5 w-full sm:w-1/2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      <DataTable
        title="🩺 Data Edukasi Pasien"
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        paginationPerPage={limit}
        onChangePage={(p) => setPage(p)}
        onChangeRowsPerPage={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        highlightOnHover
        striped
        responsive
        customStyles={customStyles}
        noDataComponent={
          <div className="py-6 text-gray-500 italic">
            Tidak ada data ditemukan
          </div>
        }
      />
    </div>
  );
}
