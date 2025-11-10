import React, { useState, useEffect } from "react";

const documents = [
  {
    id: "leaflet",
    title: "Leaflet Edukasi Gagal Jantung",
    file: "/files/LEAFLET_compressed.pdf",
    color: "#28a745",
    description: "Panduan singkat tentang gejala dan perawatan gagal jantung.",
  },
  {
    id: "booklet",
    title: "Booklet Jantung",
    file: "/files/BOOKLET-JANTUNG_compressed.pdf",
    color: "#007bff",
    description:
      "Buku panduan lengkap pasien gagal jantung dan perawatan mandiri.",
  },
];

const DocumentCenter = () => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [readDocs, setReadDocs] = useState(() => {
    const saved = localStorage.getItem("readDocs");
    return saved ? JSON.parse(saved) : {};
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("readDocs", JSON.stringify(readDocs));
  }, [readDocs]);

  const isMobile = windowWidth < 900;

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
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        width: "100vw",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#2b2b2b",
        overflow: "hidden",
        margin: 0,
      }}
    >
      {/* ==== SIDEBAR (KIRI) ==== */}
      <div
        style={{
          flex: isMobile ? "none" : "0 0 350px",
          width: isMobile ? "100%" : "350px",
          backgroundColor: "#f2f4f7",
          padding: "30px 20px",
          borderRight: isMobile ? "none" : "2px solid #ddd",
          textAlign: "center",
          boxSizing: "border-box",
          overflowY: "auto",
          height: isMobile ? "auto" : "100vh",
        }}
      >
        <h1
          style={{
            color: "#222",
            fontSize: isMobile ? "22px" : "26px",
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          📚 Pusat Edukasi Jantung
        </h1>

        <p
          style={{
            color: "#555",
            fontSize: isMobile ? "16px" : "18px",
            marginBottom: "25px",
          }}
        >
          Silakan pilih dokumen untuk dibaca:
        </p>

        {documents.map((doc, i) => {
          const isActive = selectedDoc?.file === doc.file;
          const isRead = readDocs[doc.id] || false;

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: doc.color,
                color: "white",
                borderRadius: "10px",
                padding: isMobile ? "12px" : "15px",
                marginBottom: "15px",
                boxShadow: isActive
                  ? "0 0 10px rgba(0,0,0,0.3)"
                  : "0 4px 10px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "transform 0.2s ease, background 0.3s ease",
              }}
              onMouseOver={(e) => {
                if (!isActive) e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {/* Checkbox di sebelah kiri */}
              <input
                type="checkbox"
                checked={isRead}
                onChange={() => toggleChecklist(doc.id)}
                style={{
                  marginRight: "10px",
                  width: "22px",
                  height: "22px",
                  accentColor: "white",
                  cursor: "pointer",
                }}
              />

              {/* Konten tombol */}
              <button
                onClick={() => handleSelectDoc(doc)}
                style={{
                  flex: 1,
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  color: "white",
                  fontSize: isMobile ? "16px" : "18px",
                  cursor: "pointer",
                }}
              >
                <strong>{doc.title}</strong>
                <div
                  style={{
                    fontSize: isMobile ? "13px" : "15px",
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  {doc.description}
                </div>
              </button>
            </div>
          );
        })}

        {/* Tombol reset checklist */}
        <button
          onClick={() => {
            localStorage.removeItem("readDocs");
            setReadDocs({});
          }}
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px 15px",
            marginTop: "10px",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          🔁 Hapus Semua Checklist
        </button>
      </div>

      {/* ==== AREA PDF (KANAN) ==== */}
      <div
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#2b2b2b",
          overflow: "hidden",
        }}
      >
        {selectedDoc ? (
          <iframe
            src={selectedDoc.file}
            title={selectedDoc.title}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              backgroundColor: "white",
            }}
          ></iframe>
        ) : (
          <p
            style={{
              color: "#bbb",
              fontSize: isMobile ? "16px" : "20px",
              textAlign: "center",
              padding: "10px",
            }}
          >
            Pilih dokumen
          </p>
        )}
      </div>
    </div>
  );
};

export default DocumentCenter;
