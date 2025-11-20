import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { FaEdit, FaTrash, FaEye, FaFileExcel } from "react-icons/fa";
import { ChevronRight } from "lucide-react";

export default function Home() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [expandedRows, setExpandedRows] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const tableRef = React.useRef(null);
  const [expandedColumnsRows, setExpandedColumnsRows] = useState([]);
  const [expandedDetailRows, setExpandedDetailRows] = useState([]);

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-10">
      <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const handleExport = async () => {
    try {
      const response = await api.get("/export-edukasi", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "data-edukasi.xlsx";
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export gagal", error);
      Swal.fire({
        icon: "error",
        title: "Gagal mengekspor data!",
        text: "Terjadi kesalahan saat mengambil file dari server.",
      });
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (!tableRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;

      if (width < 600) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    });

    observer.observe(tableRef.current);

    return () => observer.disconnect();
  }, []);

  const toggleColumnsRow = (rowId) => {
    setExpandedColumnsRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    );
  };

  const toggleDetailRow = (rowId) => {
    setExpandedDetailRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    );
  };

  const ExpandedDetailComponent = ({ data }) => {
    return (
      <div className="p-2 bg-[#e9f4ff] border border-blue-200 rounded-lg shadow-sm text-xs mb-3">
        <div className="mb-2 bg-white p-2 rounded-md border border-blue-100 shadow-sm">
          <p className="font-semibold text-[#0F3C64] mb-1">Riwayat Obat</p>
          <p className="text-gray-700 whitespace-pre-line leading-normal">
            {data.riwayat_obat || "Tidak ada data"}
          </p>
        </div>

        <div className="bg-white p-2 rounded-md border border-blue-100 shadow-sm">
          <p className="font-semibold text-[#0F3C64] mb-1">
            Riwayat Pemeriksaan
          </p>
          <p className="text-gray-700 whitespace-pre-line leading-normal">
            {data.riwayat_pemeriksaan || "Tidak ada data"}
          </p>
        </div>
      </div>
    );
  };

  const ExpandedColumnsComponent = ({ data }) => {
    return (
      <div className="p-2 bg-[#e7f3ff] border border-blue-200 rounded-xl shadow-sm text-sm">
        <p className="font-semibold text-[#0F3C64] text-sm mb-2">
          Detail Informasi Pasien
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="bg-white p-2 rounded-lg border border-blue-100 shadow-sm">
            <strong className="text-[#0F3C64]">No. RM:</strong>
            <p className="text-gray-700">{data.no_rm}</p>
          </div>

          <div className="bg-white p-2 rounded-lg border border-blue-100 shadow-sm">
            <strong className="text-[#0F3C64]">Tanggal Edukasi:</strong>
            <p className="text-gray-700">
              {new Date(data.tanggal_edukasi).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="bg-white p-2 rounded-lg border border-blue-100 shadow-sm">
            <strong className="text-[#0F3C64]">Edukator:</strong>
            <p className="text-gray-700">{data.edukator}</p>
          </div>

          <div className="bg-white p-2 rounded-lg border border-blue-100 shadow-sm">
            <strong className="text-[#0F3C64]">Kesimpulan:</strong>
            <div className="mt-1">
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${
                  data.kesimpulan === "Siap pulang"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {data.kesimpulan === "Siap pulang" ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                {data.kesimpulan}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          {localStorage.getItem("token") ? (
            <div className="flex gap-2">
              <Link
                to={`/detail/${data.id}`}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg shadow transition"
              >
                <FaEye />
                Detail
              </Link>

              <Link
                to={`/edit/${data.id}`}
                className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1.5 rounded-lg shadow transition"
              >
                <FaEdit />
                Edit
              </Link>

              <button
                onClick={() => handleDelete(data.id)}
                className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg shadow transition"
              >
                <FaTrash />
                Hapus
              </button>
            </div>
          ) : (
            <Link
              to={`/detail/${data.id}`}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg shadow transition"
            >
              <FaEye />
              Detail
            </Link>
          )}
        </div>
      </div>
    );
  };

  // const toggleRow = (rowId) => {
  //   setExpandedRows((prev) =>
  //     prev.includes(rowId)
  //       ? prev.filter((id) => id !== rowId)
  //       : [...prev, rowId]
  //   );
  // };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/api/edukasi?search=${search}&sort=${sort}&page=${page}&limit=${limit}`
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
        await api.delete(`/api/edukasi/${id}`);
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
      name: "",
      width: "40px",
      omit: !collapsed,
      cell: (row) => {
        const isExpanded = expandedColumnsRows.includes(row.id);
        return (
          <ChevronRight
            onClick={() => toggleColumnsRow(row.id)}
            className={`w-5 h-5 text-blue-600 cursor-pointer transition-transform ${
              isExpanded ? "rotate-90" : ""
            }`}
          />
        );
      },
      ignoreRowClick: true,
    },

    {
      name: "No",
      selector: (row, index) => (page - 1) * limit + index + 1,
      width: "70px",
      $center: true,
    },
    {
      name: "Nama",
      selector: (row) => row.nama_pasien,
      sortable: true,
      cell: (row) => {
        const isExpanded = expandedDetailRows.includes(row.id);

        return (
          <div
            onClick={() => toggleDetailRow(row.id)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-blue-600 font-semibold">
              {row.nama_pasien}
            </span>

            <ChevronRight
              className={`w-4 h-4 text-blue-600 transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          </div>
        );
      },
    },

    {
      name: "No. RM",
      selector: (row) => row.no_rm,
      sortable: true,
      width: "120px",
      omit: collapsed,
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
      $center: true,
      sortFunction: (a, b) => {
        return new Date(a.tanggal_edukasi) - new Date(b.tanggal_edukasi);
      },
      omit: collapsed,
    },
    {
      name: "Edukator",
      selector: (row) => row.edukator,
      sortable: true,
      omit: collapsed,
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
      sortable: false,
      omit: collapsed,
    },
    {
      name: "Aksi",
      cell: (row) =>
        localStorage.getItem("token") ? (
          <div className="flex gap-2">
            <Link
              to={`/detail/${row.id}`}
              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition"
            >
              <FaEye />
            </Link>

            <Link
              to={`/edit/${row.id}`}
              className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md transition"
            >
              <FaEdit />
            </Link>

            <button
              onClick={() => handleDelete(row.id)}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
            >
              <FaTrash />
            </button>
          </div>
        ) : (
          <Link
            to={`/detail/${row.id}`}
            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition"
          >
            <FaEye />
          </Link>
        ),
      ignoreRowClick: true,
      $allowOverflow: true,
      $button: true,
      width: "220px",
      omit: collapsed,
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

        {totalRows > 0 ? (
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            <FaFileExcel className="text-white" />
            Export Excel
          </button>
        ) : (
          <p>Minimal 1 data pasien untuk export Excel.</p>
        )}
      </div>

      <div ref={tableRef}>
        <DataTable
          title="🩺 Data Edukasi Pasien"
          columns={columns}
          data={data}
          progressPending={loading}
          progressComponent={<LoadingSpinner />}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationPerPage={limit}
          expandOnRowClicked={false}
          expandableRows
          expandableRowsComponent={({ data }) => (
            <div>
              {expandedColumnsRows.includes(data.id) && (
                <ExpandedColumnsComponent data={data} />
              )}

              {expandedDetailRows.includes(data.id) && (
                <ExpandedDetailComponent data={data} />
              )}
            </div>
          )}
          expandableRowExpanded={(row) =>
            expandedColumnsRows.includes(row.id) ||
            expandedDetailRows.includes(row.id)
          }
          expandableRowsHideExpander
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
    </div>
  );
}
