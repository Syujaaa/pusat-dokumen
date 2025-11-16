import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Swal from "sweetalert2";
import { FaArrowLeft } from "react-icons/fa";

export default function ViewDetail() {
  const [form, setForm] = useState(null);
  const { id } = useParams();
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-10 mt-10">
      <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  useEffect(() => {
    api.get(`/api/edukasi/${id}`).then((res) => {
      if (res.data.status === "success") {
        const data = res.data.data;

        if (data.tanggal_edukasi) {
          const d = new Date(data.tanggal_edukasi);
          if (!isNaN(d)) {
            data.tanggal_edukasi = d.toISOString().split("T")[0];
          }
        }
        setForm(data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Data tidak ditemukan",
          text: res.data.message,
        });
        navigate("/");
      }
    });
  }, [id]);

  if (!form) {
    return (
      <LoadingSpinner />
    );
  }

  const renderCheckbox = (name) => (
    <input
      type="checkbox"
      checked={form[name]}
      disabled
      className="w-5 h-5 accent-blue-600 cursor-not-allowed"
    />
  );

  return (
    <div className="max-w-4xl mx-auto bg-white shadow p-6 rounded mt-15">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Detail Edukasi Pasien Gagal Jantung
      </h2>

      <h3 className="font-semibold mb-2">Identitas Pasien</h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex flex-col">
          <label htmlFor="nama_pasien" className="mb-1 font-medium">
            Nama Pasien
          </label>
          <input
            type="text"
            id="nama_pasien"
            name="nama_pasien"
            value={form.nama_pasien}
            disabled
            placeholder="Masukkan nama pasien"
            className="border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="no_rm" className="mb-1 font-medium">
            No. Rekam Medis (RM)
          </label>
          <input
            type="text"
            id="no_rm"
            name="no_rm"
            value={form.no_rm}
            disabled
            placeholder="Masukkan No. RM"
            className="border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="tanggal_edukasi" className="mb-1 font-medium">
            Tanggal Edukasi
          </label>

          <input
            type="text"
            id="tanggal_edukasi"
            value={new Date(form.tanggal_edukasi).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
            disabled
            className="border px-3 py-2 rounded bg-gray-100"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="edukator" className="mb-1 font-medium">
            Edukator
          </label>
          <input
            type="text"
            id="edukator"
            name="edukator"
            value={form.edukator}
            disabled
            placeholder="Masukkan nama edukator"
            className="border px-3 py-2 rounded"
          />
        </div>
      </div>

      {/* 1. Diagnosis & Kondisi */}
      <h3 className="font-semibold mt-4 mb-2">
        1. Pemahaman Diagnosis & Kondisi Pasien
      </h3>
      {[
        ["diagnosis", "Apa itu gagal jantung & kondisi pasien saat dirawat"],
        ["penyebab", "Penyebab gagal jantung pasien"],
        ["tanda_perburukan", "Tanda perburukan & kapan harus ke IGD"],
      ].map(([key, label]) => (
        <div
          key={key}
          className="flex items-center justify-between mb-2 border-b pb-2"
        >
          <span>{label}</span>
          <div className="flex gap-4">
            <label>
              {renderCheckbox(`${key}_dijelaskan`)} Sudah Dijelaskan
            </label>
            <label>{renderCheckbox(`${key}_dipahami`)} Dipahami</label>
          </div>
        </div>
      ))}

      <div className="mt-4 mb-4">
        <p className="font-bold mb-2">
          Tanda bahaya yang harus diketahui pasien:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Sesak memburuk</li>
          <li>Berat badan naik ≥2 kg/2 hari</li>
          <li>Bengkak bertambah</li>
          <li>Jantung berdebar/nyeri dada</li>
          <li>Tidak nafsu makan, lemah ekstrem</li>
        </ul>
      </div>
      <label>Catatan tanda bahaya</label>
      <textarea
        value={form.tanda_bahaya}
        disabled
        placeholder="Tidak ada catat tanda bahaya seperti: sesak, bengkak, jantung berdebar..."
        className="border w-full px-3 py-2 rounded bg-gray-100 cursor-not-allowed mb-4"
      />

      {/* 2. Obat-Obatan */}
      <h3 className="font-semibold mt-4 mb-2">2. Obat-Obatan & Kepatuhan</h3>
      {[
        ["obat", "Nama obat HF & manfaatnya"],
        ["jadwal_obat", "Jadwal minum obat & cara minum"],
        ["efek_samping", "Efek samping yang perlu diwaspadai"],
        [
          "obat_dihindari",
          "Obat yang harus dihindari (NSAID, herbal tertentu)",
        ],
      ].map(([key, label]) => (
        <div
          key={key}
          className="flex items-center justify-between mb-2 border-b pb-2"
        >
          <span>{label}</span>
          <div className="flex gap-4">
            <label>
              {renderCheckbox(`${key}_dijelaskan`)} Sudah Dijelaskan
            </label>
            <label>{renderCheckbox(`${key}_dipahami`)} Dipahami</label>
          </div>
        </div>
      ))}

      {/* 3. Pemantauan */}
      <h3 className="font-semibold mt-4 mb-2">
        3. Pemantauan Mandiri di Rumah (Self-Monitoring)
      </h3>
      {[
        [
          "catatan_harian",
          "Catatan harian pasien HF (BB, tensi, nadi, gejala)",
        ],
        ["cara_timbang", "Cara menimbang badan setiap hari"],
        ["target_berat_badan", "Target berat badan pasien:"],
        ["hubungi_faskes", "Kapan harus menghubungi fasilitas kesehatan"],
      ].map(([key, label]) => (
        <div
          key={key}
          className="flex items-center justify-between mb-2 border-b pb-2"
        >
          <span>{label}</span>
          <div className="flex gap-4 items-center">
            {key === "target_berat_badan" && (
              <div className="mb-3">
                <label>(Kg)</label>
                <input
                  type="number"
                  step="0.1"
                  name="target_berat_badan"
                  value={form.target_berat_badan}
                  disabled
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
            )}
            <label>{renderCheckbox(`${key}_dijelaskan`)} Sudah</label>
            <label>{renderCheckbox(`${key}_dipahami`)} Dipahami</label>
          </div>
        </div>
      ))}

      <h3 className="font-semibold mt-4 mb-2">4. Diet & Pembatasan</h3>
      {[
        ["diet_rendah_garam", "Diet rendah garam (<2 g/hari)"],
        ["pembatasan_cairan", "Pembatasan cairan"],
        ["hindari_makanan_natrium", "Hindari makanan tinggi natrium"],
        ["baca_label_garam", "Edukasi membaca label kandungan garam"],
      ].map(([key, label]) => (
        <div
          key={key}
          className="flex items-center justify-between mb-2 border-b pb-2"
        >
          <span>{label}</span>
          <div className="flex gap-4">
            {key == "pembatasan_cairan" && (
              <div className="mb-3">
                <label>(L/hari)</label>
                <input
                  type="number"
                  step="0.1"
                  name="pembatasan_cairan"
                  value={form.pembatasan_cairan}
                  disabled
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
            )}
            <label>
              <input
                type="checkbox"
                name={`${key}_dijelaskan`}
                checked={form[`${key}_dijelaskan`]}
                disabled
                className="w-5 h-5 accent-blue-600"
              />{" "}
              Sudah
            </label>
            <label>
              <input
                type="checkbox"
                name={`${key}_dipahami`}
                checked={form[`${key}_dipahami`]}
                disabled
                className="w-5 h-5 accent-blue-600"
              />{" "}
              Dipahami
            </label>
          </div>
        </div>
      ))}

      <h3 className="font-semibold mt-4 mb-2">
        5. Aktivitas Fisik & Gaya Hidup
      </h3>
      {[
        [
          "aktivitas_ringan",
          "Aktivitas fisik ringan & bertahap (rehabilitasi jantung bila ada)",
        ],
        ["larangan_berat", "Larangan aktivitas berat mendadak"],
        ["stop_merokok_alkohol", "Stop merokok & alkohol"],
        ["manajemen_stres_tidur", "Manajemen stres & tidur cukup"],
      ].map(([key, label]) => (
        <div
          key={key}
          className="flex items-center justify-between mb-2 border-b pb-2"
        >
          <span>{label}</span>
          <div className="flex gap-4">
            <label>
              <input
                type="checkbox"
                name={`${key}_dijelaskan`}
                checked={form[`${key}_dijelaskan`]}
                disabled
                className="w-5 h-5 accent-blue-600"
              />{" "}
              Sudah
            </label>
            <label>
              <input
                type="checkbox"
                name={`${key}_dipahami`}
                checked={form[`${key}_dipahami`]}
                disabled
                className="w-5 h-5 accent-blue-600"
              />{" "}
              Dipahami
            </label>
          </div>
        </div>
      ))}

      <h3 className="font-semibold mt-4 mb-2">6. Kontrol & Tindak Lanjut</h3>
      {[
        ["jadwal_kontrol", "Jadwal kontrol pertama setelah pulang "],
        ["poli_tujuan", "Poli/klinik tujuan (HF clinic jika ada) "],
        ["kontak_faskes", "Kontak fasilitas kesehatan jika ada keluhan "],
      ].map(([key, label]) => (
        <div
          key={key}
          className="flex items-center justify-between mb-2 border-b pb-2"
        >
          <span>{label}</span>
          <div className="flex gap-4">
            <label>
              <input
                type="checkbox"
                name={`${key}_dijelaskan`}
                checked={form[`${key}_dijelaskan`]}
                disabled
                className="w-5 h-5 accent-blue-600"
              />{" "}
              Sudah
            </label>
            <label>
              <input
                type="checkbox"
                name={`${key}_dipahami`}
                checked={form[`${key}_dipahami`]}
                disabled
                className="w-5 h-5 accent-blue-600"
              />{" "}
              Dipahami
            </label>
          </div>
        </div>
      ))}

      {/* Bagian 7 */}
      <h3 className="font-semibold mt-4 mb-2">7. Edukasi untuk Keluarga</h3>
      <div className="mb-4">
        <div className="flex justify-between px-2 py-1 font-medium text-gray-700">
          <span>Materi Edukasi</span>
          <span>Sudah</span>
        </div>

        {[
          {
            label: "Keluarga memahami tanda bahaya & rencana pulang",
            name: "keluarga_pahami_tanda_bahaya",
          },
          {
            label: "Keluarga mampu support diet & kepatuhan obat",
            name: "keluarga_dukung_diet_obat",
          },
        ].map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between px-2 py-1 hover:bg-gray-50"
          >
            <span>{item.label}</span>
            <input
              type="checkbox"
              name={item.name}
              checked={form[item.name]}
              disabled
              className="w-5 h-5 accent-blue-600"
            />
          </div>
        ))}
      </div>

      {/* Bagian 8 – Materi Edukasi yang Diberikan */}
      <h3 className="font-semibold mt-4 mb-2">
        8. Materi Edukasi yang Diberikan
      </h3>
      <div className="mb-4">
        <div className="flex justify-between px-2 py-1 font-medium text-gray-700">
          <span>Materi</span>
          <span>Diberikan</span>
        </div>

        {[
          { label: "Booklet edukasi gagal jantung", name: "materi_booklet" },
          { label: "Catatan harian pasien", name: "materi_catatan_harian" },
          { label: "Kontak darurat", name: "materi_kontak_darurat" },
        ].map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between px-2 py-1 hover:bg-gray-50"
          >
            <span>{item.label}</span>
            <input
              type="checkbox"
              name={item.name}
              checked={form[item.name]}
              disabled
              className="w-5 h-5 accent-blue-600"
            />
          </div>
        ))}
      </div>

      {/* Evaluasi */}
      <h3 className="font-semibold mt-4 mb-2">Evaluasi Pemahaman Pasien</h3>
      <div className="border p-3 rounded mb-4">
        <p className="font-medium mb-2">Metode Edukasi (pilih salah satu):</p>
        {["Teach-back", "Tanya jawab", "Demonstrasi"].map((metode) => (
          <label key={metode} className="block mb-1">
            <input
              type="checkbox"
              name="metode_edukasi"
              checked={form.metode_edukasi === metode}
              disabled
              className="mr-2 accent-blue-600"
            />
            {metode}
          </label>
        ))}
      </div>

      <div className="border p-3 rounded mb-4">
        <p className="font-medium mb-2">Kesimpulan:</p>
        {[
          { label: "Pasien siap pulang", value: "Siap pulang" },
          {
            label: "Edukasi ulang diperlukan",
            value: "Edukasi ulang diperlukan",
          },
        ].map((opt) => (
          <label key={opt.value} className="block mb-1">
            <input
              type="checkbox"
              name="kesimpulan"
              checked={form.kesimpulan === opt.value}
              disabled
              className="mr-2 accent-blue-600"
            />
            {opt.label}
          </label>
        ))}

        {form.kesimpulan === "Edukasi ulang diperlukan" && (
          <textarea
            name="topik_perlu_edukasi_ulang"
            value={form.topik_perlu_edukasi_ulang}
            disabled
            placeholder="Tuliskan topik yang perlu edukasi ulang..."
            className="border w-full px-3 py-2 rounded mt-3"
            rows="3"
          />
        )}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => window.history.back()}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center justify-center gap-2"
        >
          <FaArrowLeft /> Kembali
        </button>
      </div>
    </div>
  );
}
