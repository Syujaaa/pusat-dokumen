import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  ChevronRight,
  Stethoscope,
  AlertTriangle,
  ShieldCheck,
  Brain,
  Activity,
  Droplets,
  Heart,
  Sparkles,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/data-pasien", { replace: true });
    }
  }, [navigate]);

  const isLoggedIn = !!localStorage.getItem("token");

  if (isLoggedIn) {
    return (
      <div className="w-full min-h-screen bg-[#E8F1FF] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Mengarahkan ke halaman data pasien...</p>
        </div>
      </div>
    );
  }

  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            opacity: 0,
            y: Math.random() * 100,
            x: Math.random() * 100,
          }}
          animate={{
            opacity: [0, 0.3, 0],
            y: [Math.random() * 100, Math.random() * -100],
            x: [Math.random() * 100, Math.random() * -100],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        >
          <Heart className="text-blue-200" size={20} />
        </motion.div>
      ))}

      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-blue-100"
          initial={{
            opacity: 0,
            scale: 0,
          }}
          animate={{
            opacity: [0, 0.2, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 8,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 40 + 20}px`,
            height: `${Math.random() * 40 + 20}px`,
          }}
        />
      ))}
    </div>
  );

  const viewportConfig = {
    once: true,
    amount: 0.3,
  };

  return (
    <div className="w-full min-h-screen bg-[#E8F1FF] text-gray-800 mt-20 relative">
      <FloatingElements />

      <section className="relative bg-gradient-to-br from-blue-50 to-white py-24 px-6 md:px-20 text-center rounded-b-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent"></div>

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={viewportConfig}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6"
          >
            <Sparkles size={18} />
            <span className="font-semibold">
              Platform Edukasi Jantung Terlengkap
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-blue-800 mb-6 leading-tight"
          >
            Kenali{" "}
            <motion.span
              initial={{ color: "#1e40af" }}
              whileInView={{ color: ["#1e40af", "#dc2626", "#1e40af"] }}
              viewport={viewportConfig}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block"
            >
              Jantung
            </motion.span>{" "}
            Anda
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportConfig}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-600 mb-8 leading-relaxed"
          >
            Edukasi lengkap tentang fungsi jantung, gejala gagal jantung,
            pencegahan, dan penatalaksanaan berbasis bukti medis.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportConfig}
            transition={{ delay: 0.6, type: "spring" }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#apa-itu"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl shadow-xl transition-all font-bold text-lg"
            >
              Pelajari Lebih Lanjut
              <ArrowRight className="ml-3" size={20} />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#gejala"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-700 border-2 border-blue-200 hover:border-blue-300 rounded-2xl shadow-lg transition-all font-semibold text-lg"
            >
              Kenali Gejala
              <AlertTriangle className="ml-3" size={20} />
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      <section
        id="apa-itu"
        className="py-24 px-6 md:px-24 grid md:grid-cols-2 gap-16 items-start relative"
      >
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewportConfig}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportConfig}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-100 rounded-full blur-xl opacity-60"
          ></motion.div>

          <h2 className="text-4xl font-bold text-blue-800 mb-6 flex items-center gap-3 relative">
            <motion.div
              whileHover={{ scale: 1.2, rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <HeartPulse className="text-red-600" size={40} />
            </motion.div>
            Apa Itu Gagal Jantung?
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ delay: 0.3 }}
            className="space-y-4 text-gray-700 leading-relaxed text-lg"
          >
            <p>
              Gagal jantung adalah kondisi ketika jantung tidak dapat memompa
              darah secara optimal untuk memenuhi kebutuhan tubuh. Ini terjadi
              karena:
            </p>

            <ul className="space-y-3 ml-6">
              {[
                "Otot jantung melemah",
                "Jantung menjadi kaku dan sulit mengisi darah",
                "Masalah struktural seperti katup jantung rusak",
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={viewportConfig}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  {item}
                </motion.li>
              ))}
            </ul>

            <p className="font-semibold text-blue-800 mt-6">
              Ada dua jenis utama gagal jantung:
            </p>

            <div className="grid gap-3 mt-4">
              {[
                {
                  type: "HFrEF",
                  desc: "jantung tidak kuat memompa (Ejection Fraction rendah)",
                },
                {
                  type: "HFpEF",
                  desc: "jantung kaku sehingga pengisian darah berkurang",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportConfig}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-4 rounded-xl shadow-md border-l-4 border-blue-500"
                >
                  <span className="font-bold text-blue-700">{item.type}:</span>{" "}
                  {item.desc}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewportConfig}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white shadow-2xl rounded-3xl p-8 relative overflow-hidden mt-18"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-red-500"></div>
            <img
              src="/photo/heart-failure-congestive-600w.png"
              alt="Ilustrasi gagal jantung"
              onClick={() => setZoom(true)}
              className="cursor-zoom-in rounded-2xl w-full max-h-[350px] md:max-h-[450px] object-contain"
            />
          </motion.div>
        </motion.div>
      </section>

      <section className="py-24 px-6 md:px-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-blue-800 mb-4">
            Penjelasan Lengkap Tentang Jantung
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Memahami jantung secara mendalam untuk pencegahan dan penanganan
            yang lebih baik
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Fungsi Jantung",
              icon: <Heart className="text-red-600" size={32} />,
              desc: "Memompa darah kaya oksigen ke seluruh tubuh dan mengembalikan darah kotor ke paru-paru.",
              color: "from-red-500/10 to-red-100",
            },
            {
              title: "Cara Kerja Jantung",
              icon: <Activity className="text-blue-700" size={32} />,
              desc: "Berdenyut 60–100 kali/menit, mengalirkan ±5 liter darah setiap menit dalam keadaan normal.",
              color: "from-blue-500/10 to-blue-100",
            },
            {
              title: "Sistem Listrik Jantung",
              icon: <Brain className="text-purple-700" size={32} />,
              desc: "Detak jantung dikendalikan sinyal listrik yang teratur agar denyut tetap stabil.",
              color: "from-purple-500/10 to-purple-100",
            },
            {
              title: "Aliran Darah",
              icon: <Droplets className="text-blue-700" size={32} />,
              desc: "Darah mengalir dari tubuh → jantung kanan → paru → jantung kiri → seluruh tubuh.",
              color: "from-cyan-500/10 to-cyan-100",
            },
            {
              title: "Penyebab Gagal Jantung",
              icon: <AlertTriangle className="text-yellow-600" size={32} />,
              desc: "Hipertensi, serangan jantung, penyakit katup jantung, aritmia, diabetes, obesitas.",
              color: "from-yellow-500/10 to-yellow-100",
            },
            {
              title: "Cara Pencegahan",
              icon: <ShieldCheck className="text-green-600" size={32} />,
              desc: "Pola hidup sehat, kontrol tekanan darah, hindari rokok, rutin cek kesehatan.",
              color: "from-green-500/10 to-green-100",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { type: "spring", stiffness: 300 },
              }}
              className={`bg-gradient-to-br ${item.color} p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50`}
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-md mb-6"
              >
                {item.icon}
              </motion.div>
              <h3 className="font-bold text-2xl text-blue-800 mb-4">
                {item.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section
        id="gejala"
        className="py-24 bg-gradient-to-br from-blue-50 to-cyan-50 px-6 md:px-24 relative"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportConfig}
          className="absolute inset-0 bg-pattern opacity-5"
        ></motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative z-10"
        >
          <h2 className="text-4xl font-bold text-blue-800 mb-4">
            Gejala Gagal Jantung
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kenali tanda-tanda awal untuk penanganan yang lebih cepat
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          {[
            {
              icon: <Stethoscope className="text-blue-700" size={40} />,
              title: "Sesak Napas",
              desc: "Kesulitan bernapas saat aktivitas atau berbaring.",
              symptoms: [
                "Napas pendek",
                "Sulit tidur telentang",
                "Batuk kronis",
              ],
            },
            {
              icon: <AlertTriangle className="text-yellow-600" size={40} />,
              title: "Kelelahan Kronis",
              desc: "Tubuh sulit beraktivitas karena darah tidak mengalir optimal.",
              symptoms: [
                "Lelah terus-menerus",
                "Otot lemah",
                "Sulit konsentrasi",
              ],
            },
            {
              icon: <ShieldCheck className="text-green-600" size={40} />,
              title: "Pembengkakan",
              desc: "Bengkak pada kaki, pergelangan, atau perut.",
              symptoms: [
                "Kaki bengkak",
                "Pergelangan membesar",
                "Berat badan naik",
              ],
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-100"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-2xl mb-6"
              >
                {item.icon}
              </motion.div>
              <h3 className="font-bold text-2xl text-blue-800 mb-4">
                {item.title}
              </h3>
              <p className="text-gray-600 mb-6 text-lg">{item.desc}</p>
              <ul className="space-y-2">
                {item.symptoms.map((symptom, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={viewportConfig}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    {symptom}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportConfig}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl text-white"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">
              Data Edukasi Pasien
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed">
              Lihat daftar pasien, status edukasi, tingkat pemahaman, dan hasil
              penilaian secara lengkap untuk perawatan yang lebih
              terpersonalisasi.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link
                  to="/data-pasien"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 md:px-10 md:py-4 bg-white text-blue-700 hover:bg-blue-50 rounded-xl md:rounded-2xl shadow-xl transition-all font-bold text-base md:text-lg"
                >
                  Lihat Data Pasien
                  <ChevronRight className="ml-2 md:ml-3" size={20} />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link
                  to="/booklet"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 md:px-10 md:py-4 bg-transparent text-white border-2 border-white/80 hover:bg-white/10 hover:border-white rounded-xl md:rounded-2xl shadow-xl transition-all font-bold text-base md:text-lg"
                >
                  Lihat Booklet
                  <BookOpen className="ml-2 md:ml-3" size={20} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>
      {zoom && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setZoom(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 cursor-zoom-out"
        >
          <motion.img
            src="/photo/heart-failure-congestive-600w.png"
            alt="Zoomed"
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.6 }}
            onClick={(e) => e.stopPropagation()} // <-- supaya klik gambar tidak menutup
            className="max-w-[90%] max-h-[90%] rounded-2xl shadow-2xl cursor-default"
          />
        </motion.div>
      )}
    </div>
  );
}
