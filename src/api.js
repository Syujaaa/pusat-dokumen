import axios from "axios";

const api = axios.create({
  baseURL: "https://edukasijantung.iceiy.com/api/edukasi.php", 
});

export default api;
