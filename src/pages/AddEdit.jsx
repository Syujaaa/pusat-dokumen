import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import Swal from "sweetalert2";
import { FaEdit, FaSave } from "react-icons/fa";

export default function AddEdit() {
  const initialForm = {
    // Identitas Pasien
    nama_pasien: "",
    no_rm: "",
    tanggal_edukasi: "",
    edukator: "",

    // 1. Diagnosis & Kondisi
    diagnosis_dijelaskan: false,
    diagnosis_dipahami: false,
    penyebab_dijelaskan: false,
    penyebab_dipahami: false,
    tanda_perburukan_dijelaskan: false,
    tanda_perburukan_dipahami: false,
    tanda_bahaya: "",

    // 2. Obat-obatan
    obat_dijelaskan: false,
    obat_dipahami: false,
    jadwal_obat_dijelaskan: false,
    jadwal_obat_dipahami: false,
    efek_samping_dijelaskan: false,
    efek_samping_dipahami: false,
    obat_dihindari_dijelaskan: false,
    obat_dihindari_dipahami: false,

    // 3. Pemantauan
    catatan_harian_dijelaskan: false,
    catatan_harian_dipahami: false,
    cara_timbang_dijelaskan: false,
    cara_timbang_dipahami: false,
    target_berat_badan_dijelaskan: false,
    target_berat_badan_dipahami: false,
    target_berat_badan: "",
    hubungi_faskes_dijelaskan: false,
    hubungi_faskes_dipahami: false,

    // 4. Diet
    diet_rendah_garam_dijelaskan: false,
    diet_rendah_garam_dipahami: false,
    pembatasan_cairan_dijelaskan: false,
    pembatasan_cairan_dipahami: false,
    pembatasan_cairan: "",
    hindari_makanan_natrium_dijelaskan: false,
    hindari_makanan_natrium_dipahami: false,
    baca_label_garam_dijelaskan: false,
    baca_label_garam_dipahami: false,

    // 5. Aktivitas & Gaya Hidup
    aktivitas_ringan_dijelaskan: false,
    aktivitas_ringan_dipahami: false,
    larangan_berat_dijelaskan: false,
    larangan_berat_dipahami: false,
    stop_merokok_alkohol_dijelaskan: false,
    stop_merokok_alkohol_dipahami: false,
    manajemen_stres_tidur_dijelaskan: false,
    manajemen_stres_tidur_dipahami: false,

    // 6. Kontrol
    jadwal_kontrol_dijelaskan: false,
    jadwal_kontrol_dipahami: false,
    poli_tujuan_dijelaskan: false,
    poli_tujuan_dipahami: false,
    kontak_faskes_dijelaskan: false,
    kontak_faskes_dipahami: false,

    // 7. Keluarga
    keluarga_pahami_tanda_bahaya: false,
    keluarga_dukung_diet_obat: false,

    // 8. Materi Edukasi
    materi_booklet: false,
    materi_catatan_harian: false,
    materi_kontak_darurat: false,

    // Evaluasi Pemahaman
    metode_edukasi: "",
    kesimpulan: "",
    topik_perlu_edukasi_ulang: "",
  };

  const [form, setForm] = useState(initialForm);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      api.get(`/${id}`).then((res) => {
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
        }
      });
    } else {
      setForm(initialForm);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        const result = await Swal.fire({
          title: "Yakin akan mengubah data?",
          text: "Data yang diubah akan diperbarui di sistem.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ya, ubah",
          cancelButtonText: "Batal",
        });

        if (!result.isConfirmed) return;

        await api.put(
          `/${id}`,
          { ...form, id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data berhasil diperbarui.",
          confirmButtonColor: "#3085d6",
        });
      } else {
        await api.post("", form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data berhasil ditambahkan.",
          confirmButtonColor: "#3085d6",
        });
      }
      navigate("/");
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan!",
        text: "Coba logout kemudian login kembali.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Oke",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white shadow p-6 rounded mt-15"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">
        {isEdit
          ? "Edit Checklist Edukasi Pasien Gagal Jantung"
          : "Checklist Edukasi Pasien Gagal Jantung"}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            type="date"
            id="tanggal_edukasi"
            name="tanggal_edukasi"
            value={form.tanggal_edukasi}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
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
            onChange={handleChange}
            placeholder="Masukkan nama edukator"
            className="border px-3 py-2 rounded"
          />
        </div>
      </div>

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
              <input
                type="checkbox"
                name={`${key}_dijelaskan`}
                checked={form[`${key}_dijelaskan`]}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-600"
              />{" "}
              Sudah Dijelaskan
            </label>
            <label>
              <input
                type="checkbox"
                name={`${key}_dipahami`}
                checked={form[`${key}_dipahami`]}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-600"
              />{" "}
              Dipahami
            </label>
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
        name="tanda_bahaya"
        value={form.tanda_bahaya}
        onChange={handleChange}
        className="border w-full px-3 py-2 rounded mb-4"
        placeholder="Catat tanda bahaya seperti: sesak, bengkak, jantung berdebar..."
      />

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
              <input
                type="checkbox"
                name={`${key}_dijelaskan`}
                checked={form[`${key}_dijelaskan`]}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-600"
              />{" "}
              Sudah Dijelaskan
            </label>
            <label>
              <input
                type="checkbox"
                name={`${key}_dipahami`}
                checked={form[`${key}_dipahami`]}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-600"
              />{" "}
              Dipahami
            </label>
          </div>
        </div>
      ))}

      <h3 className="font-semibold mt-4 mb-2">
        3. Pemantauan Mandiri di Rumah (Self-Monitoring){" "}
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
          <div className="flex gap-4">
            {key == "target_berat_badan" && (
              <div className="mb-3">
                <label>(Kg)</label>
                <input
                  type="number"
                  step="0.1"
                  name="target_berat_badan"
                  value={form.target_berat_badan}
                  onChange={handleChange}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
            )}
            <label>
              <input
                type="checkbox"
                name={`${key}_dijelaskan`}
                checked={form[`${key}_dijelaskan`]}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-600"
              />{" "}
              Sudah
            </label>
            <label>
              <input
                type="checkbox"
                name={`${key}_dipahami`}
                checked={form[`${key}_dipahami`]}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-600"
              />{" "}
              Dipahami
            </label>
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
                  onChange={handleChange}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
            )}
            <label>
              <input
                type="checkbox"
                name={`${key}_dijelaskan`}
                checked={form[`${key}_dijelaskan`]}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-600"
              />{" "}
              Sudah
            </label>
            <label>
              <input
                type="checkbox"
                name={`${key}_dipahami`}
                checked={form[`${key}_dipahami`]}
                onChange={handleChange}
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
                onChange={handleChange}
                className="w-5 h-5 accent-blue-600"
              />{" "}
              Sudah
            </label>
            <label>
              <input
                type="checkbox"
                name={`${key}_dipahami`}
                checked={form[`${key}_dipahami`]}
                onChange={handleChange}
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
                onChange={handleChange}
                className="w-5 h-5 accent-blue-600"
              />{" "}
              Sudah
            </label>
            <label>
              <input
                type="checkbox"
                name={`${key}_dipahami`}
                checked={form[`${key}_dipahami`]}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-600"
              />{" "}
              Dipahami
            </label>
          </div>
        </div>
      ))}

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
              onChange={handleChange}
              className="w-5 h-5 accent-blue-600"
            />
          </div>
        ))}
      </div>

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
              onChange={handleChange}
              className="w-5 h-5 accent-blue-600"
            />
          </div>
        ))}
      </div>

      <h3 className="font-semibold mt-4 mb-2">Evaluasi Pemahaman Pasien</h3>
      <div className="border p-3 rounded mb-4">
        <p className="font-medium mb-2">Metode Edukasi (pilih salah satu):</p>
        {["Teach-back", "Tanya jawab", "Demonstrasi"].map((metode) => (
          <label key={metode} className="block mb-1">
            <input
              type="checkbox"
              name="metode_edukasi"
              checked={form.metode_edukasi === metode}
              onChange={() =>
                setForm({
                  ...form,
                  metode_edukasi: form.metode_edukasi === metode ? "" : metode,
                })
              }
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
              onChange={() =>
                setForm({
                  ...form,
                  kesimpulan: form.kesimpulan === opt.value ? "" : opt.value,
                  topik_perlu_edukasi_ulang:
                    opt.value === "Edukasi ulang diperlukan"
                      ? form.topik_perlu_edukasi_ulang
                      : "",
                })
              }
              className="mr-2 accent-blue-600"
            />
            {opt.label}
          </label>
        ))}

        {form.kesimpulan === "Edukasi ulang diperlukan" && (
          <textarea
            name="topik_perlu_edukasi_ulang"
            value={form.topik_perlu_edukasi_ulang}
            onChange={handleChange}
            placeholder="Tuliskan topik yang perlu edukasi ulang..."
            className="border w-full px-3 py-2 rounded mt-3"
            rows="3"
            required
          />
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
      >
        {isEdit ? (
          <>
            <FaEdit /> Perbarui Data
          </>
        ) : (
          <>
            <FaSave /> Simpan Data
          </>
        )}
      </button>
    </form>
  );
}
