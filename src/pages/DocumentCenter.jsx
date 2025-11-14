import React, { useState, useEffect } from "react";

const documents = [
  {
    id: "leaflet",
    title: "Leaflet Edukasi Gagal Jantung",
    file: "/files/LEAFLET_compressed.pdf",
    color: "bg-green-600",
    description: "Panduan singkat tentang gejala dan perawatan gagal jantung.",
  },
  {
    id: "booklet",
    title: "Booklet Jantung",
    file: "/files/BOOKLET-JANTUNG_compressed.pdf",
    color: "bg-blue-600",
    description:
      "Buku panduan lengkap pasien gagal jantung dan perawatan mandiri.",
  },
];

export default function DocumentCenter() {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [readDocs, setReadDocs] = useState(() => {
    const saved = localStorage.getItem("readDocs");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("readDocs", JSON.stringify(readDocs));
  }, [readDocs]);

  const handleSelectDoc = (doc) => {
    setSelectedDoc(doc);
    setReadDocs((prev) => ({ ...prev, [doc.id]: true }));
  };

  const toggleChecklist = (id) => {
    setReadDocs((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem("readDocs", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div
      className="
        fixed inset-0
        bg-gray-900 text-gray-100
        mt-[64px]    /* memberi jarak di bawah navbar */
        flex flex-col md:flex-row
        overflow-hidden
        z-0
      "
    >
      {/* === SIDEBAR === */}
      <div className="md:w-[350px] w-full bg-gray-100 text-gray-900 p-6 border-r border-gray-300 overflow-y-auto">
        <h1 className="text-2xl font-bold text-center mb-3 flex items-center justify-center gap-2">
          📚 Pusat Edukasi Jantung
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Silakan pilih dokumen untuk dibaca:
        </p>

        <div className="space-y-4">
          {documents.map((doc) => {
            const isActive = selectedDoc?.file === doc.file;
            const isRead = readDocs[doc.id] || false;

            return (
              <div key={doc.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isRead}
                  onChange={() => toggleChecklist(doc.id)}
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                />
                <button
                  onClick={() => handleSelectDoc(doc)}
                  className={`flex-1 ${
                    doc.color
                  } text-white rounded-lg px-4 py-3 text-left shadow-md transition-transform transform hover:scale-[1.03] ${
                    isActive ? "ring-2 ring-blue-400" : ""
                  }`}
                >
                  <strong className="block text-base">{doc.title}</strong>
                  <span className="text-sm opacity-90">{doc.description}</span>
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("readDocs");
            setReadDocs({});
          }}
          className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-md transition"
        >
          🔁 Hapus Semua Checklist
        </button>
      </div>


      <div className="flex-1 bg-gray-900 flex items-center justify-center overflow-hidden">
        {selectedDoc ? (
          <iframe
            src={selectedDoc.file}
            title={selectedDoc.title}
            className="w-full h-full border-none bg-white"
          ></iframe>
        ) : (
          <p className="text-gray-400 text-lg text-center p-4">
            Pilih dokumen untuk dibaca
          </p>
        )}
      </div>
    </div>
  );
}
