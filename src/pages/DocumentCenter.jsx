import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import api from "../api";

export default function DocumentCenter() {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [readDocs, setReadDocs] = useState(() => {
    const saved = localStorage.getItem("readDocs");
    return saved ? JSON.parse(saved) : {};
  });
  const [loadingDocs, setLoadingDocs] = useState(true);
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-10">
      <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const isAdmin = username === "admin";

  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);

  const [newDoc, setNewDoc] = useState({
    title: "",
    description: "",
    color: "bg-blue-600",
    fileObj: null,
  });

  const [editData, setEditData] = useState({
    title: "",
    description: "",
    color: "bg-blue-600",
    fileObj: null,
    file_url: "",
  });

  const [isUploading, setIsUploading] = useState(false);

  const loadDocuments = async () => {
    try {
      setLoadingDocs(true);

      const res = await api.get(`api/documents`);
      setDocuments(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    localStorage.setItem("readDocs", JSON.stringify(readDocs));
  }, [readDocs]);

  const toggleChecklist = (id) => {
    setReadDocs((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem("readDocs", JSON.stringify(updated));
      return updated;
    });
  };

  const handleSelectDoc = (doc) => {
    setSelectedDoc(doc);

    if (!isAdmin) {
      setReadDocs((prev) => ({ ...prev, [doc.id]: true }));
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      Swal.fire({
        title: "Mengupload file...",
        text: "Mohon tunggu sebentar",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const uploadRes = await api.post(`api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (uploadRes.data.status !== "success") {
        throw new Error(uploadRes.data.message || "Upload gagal");
      }

      Swal.close();
      return uploadRes.data.url;
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Upload Gagal",
        text: "Coba untuk login ulang",
      });
      throw err;
    }
  };

  const handleAddDoc = async () => {
    if (!newDoc.title || !newDoc.fileObj) {
      Swal.fire("Error", "Judul dan File wajib diisi!", "error");
      return;
    }

    try {
      Swal.fire({
        title: "Mengunggah...",
        text: "Dokumen sedang diproses",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const fileUrl = await uploadFile(newDoc.fileObj);

      const res = await api.post(
        `api/documents`,
        {
          title: newDoc.title,
          description: newDoc.description,
          file_url: fileUrl,
          color: newDoc.color,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.close();

      if (res.data.status === "success") {
        await loadDocuments();
        setShowForm(false);
        setNewDoc({
          title: "",
          description: "",
          color: "bg-blue-600",
          fileObj: null,
        });

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Dokumen berhasil ditambahkan!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Menambah Dokumen",
        text: "Coba untuk login ulang",
      });
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Dokumen akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    try {
      Swal.fire({
        title: "Menghapus...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await api.delete(`api/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.close();

      if (res.data.status === "success") {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
        setSelectedDoc(null);

        Swal.fire("Berhasil", "Dokumen berhasil dihapus!", "success");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Menghapus",
        text: "Coba untuk login ulang",
      });
    }
  };

  const openEditForm = (doc) => {
    setEditingDoc(doc);
    setEditData({
      title: doc.title,
      description: doc.description,
      color: doc.color,
      fileObj: null,
      file_url: doc.file_url,
    });
    setShowEditForm(true);
  };

  const handleUpdateDoc = async () => {
    try {
      Swal.fire({
        title: "Menyimpan perubahan...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      let finalUrl = editData.file_url;

      if (editData.fileObj) {
        finalUrl = await uploadFile(editData.fileObj);
      }

      const res = await api.put(
        `api/documents/${editingDoc.id}`,
        {
          title: editData.title,
          description: editData.description,
          color: editData.color,
          file_url: finalUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.close();

      if (res.data.status === "success") {
        await loadDocuments();
        setShowEditForm(false);

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Dokumen berhasil diperbarui!",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal Update Dokumen",
        text: "Coba untuk login ulang",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 text-gray-100 mt-[64px] flex flex-col md:flex-row overflow-hidden">
      <div className="md:w-[350px] bg-gray-100 text-gray-900 p-6 border-r overflow-y-auto">
        <h1 className="text-2xl font-bold text-center mb-2">
          📚 Pusat Edukasi Jantung
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Pilih dokumen untuk {isAdmin ? "diatur:" : "dibaca:"}
        </p>

        <div className="space-y-4">
          {loadingDocs && <LoadingSpinner />}

          {!loadingDocs &&
            documents.map((doc) => {
              const isActive = selectedDoc?.id === doc.id;
              const isRead = readDocs[doc.id] || false;

              return (
                <div key={doc.id} className="flex items-center gap-3">
                  {!isAdmin && (
                    <input
                      type="checkbox"
                      checked={isRead}
                      onChange={() => toggleChecklist(doc.id)}
                      className="w-5 h-5 accent-blue-600 cursor-pointer"
                    />
                  )}

                  <button
                    onClick={() => handleSelectDoc(doc)}
                    className={`flex-1 px-4 py-3 rounded-lg text-left shadow-md text-white transition-transform hover:scale-[1.03] ${
                      doc.color
                    } ${isActive ? "ring-2 ring-blue-400" : ""}`}
                  >
                    <strong>{doc.title}</strong>
                    <p className="text-sm opacity-90">{doc.description}</p>
                  </button>

                  {isAdmin && (
                    <>
                      <button
                        onClick={() => openEditForm(doc)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✏️
                      </button>

                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ❌
                      </button>
                    </>
                  )}
                </div>
              );
            })}
        </div>

        {isAdmin && !showForm && !showEditForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
          >
            ➕ Tambah Booklet
          </button>
        )}

        {isAdmin && showEditForm && (
          <div className="mt-6 p-4 bg-white rounded-lg shadow border border-blue-100 relative">
            <button
              onClick={() => setShowEditForm(false)}
              className="absolute right-2 top-2 text-gray-400 hover:text-red-500 transition"
            >
              ✖
            </button>

            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-700">
              ✏️ Edit Dokumen
            </h2>

            <input
              type="text"
              placeholder="Judul dokumen"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              className="w-full p-2.5 mb-3 border border-blue-200 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                setEditData({ ...editData, fileObj: e.target.files[0] })
              }
              className="w-full p-2.5 mb-3 border border-blue-200 rounded bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100 transition"
            />

            <textarea
              placeholder="Deskripsi"
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              className="w-full p-2.5 mb-3 border border-blue-200 rounded h-24 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />

            <select
              value={editData.color}
              onChange={(e) =>
                setEditData({ ...editData, color: e.target.value })
              }
              className="w-full p-2.5 mb-4 border border-blue-200 rounded text-gray-700 focus:ring-2 focus:ring-blue-400"
            >
              <option value="bg-blue-600">Biru</option>
              <option value="bg-green-600">Hijau</option>
              <option value="bg-red-600">Merah</option>
              <option value="bg-yellow-600">Kuning</option>
            </select>

            <button
              disabled={isUploading}
              onClick={handleUpdateDoc}
              className="w-full bg-blue-600 text-white py-2.5 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isUploading ? "Mengupload..." : "Simpan Perubahan"}
            </button>
          </div>
        )}

        {isAdmin && showForm && !showEditForm && (
          <div className="mt-6 p-4 bg-white rounded-lg shadow border border-blue-100 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute right-2 top-2 text-gray-400 hover:text-red-500 transition"
            >
              ✖
            </button>

            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-700">
              🩺 Tambah Dokumen
            </h2>

            <input
              type="text"
              placeholder="Judul dokumen"
              value={newDoc.title}
              onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
              className="w-full p-2.5 mb-3 border border-blue-200 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                setNewDoc({ ...newDoc, fileObj: e.target.files[0] })
              }
              className="w-full p-2.5 mb-3 border border-blue-200 rounded bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100 transition"
            />

            <textarea
              placeholder="Deskripsi"
              value={newDoc.description}
              onChange={(e) =>
                setNewDoc({ ...newDoc, description: e.target.value })
              }
              className="w-full p-2.5 mb-3 border border-blue-200 rounded h-24 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />

            <select
              value={newDoc.color}
              onChange={(e) => setNewDoc({ ...newDoc, color: e.target.value })}
              className="w-full p-2.5 mb-4 border border-blue-200 rounded text-gray-700 focus:ring-2 focus:ring-blue-400"
            >
              <option value="bg-blue-600">Biru</option>
              <option value="bg-green-600">Hijau</option>
              <option value="bg-red-600">Merah</option>
              <option value="bg-yellow-600">Kuning</option>
            </select>

            <button
              disabled={isUploading}
              onClick={handleAddDoc}
              className="w-full bg-blue-600 text-white py-2.5 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isUploading ? "Mengupload..." : "Simpan"}
            </button>
          </div>
        )}

        {!isAdmin && (
          <button
            onClick={() => {
              localStorage.removeItem("readDocs");
              setReadDocs({});
            }}
            className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
          >
            🔁 Reset Checklist
          </button>
        )}
      </div>

      <div className="flex-1 bg-gray-900 flex items-center justify-center">
        {selectedDoc ? (
          <iframe
            src={selectedDoc.file_url}
            title={selectedDoc.title}
            className="w-full h-full bg-white"
          ></iframe>
        ) : (
          <p className="text-gray-400 text-lg">Pilih dokumen untuk dibaca</p>
        )}
      </div>
    </div>
  );
}
