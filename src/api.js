import axios from "axios";

const api = axios.create({
  baseURL: "https://edukasiJantung.42web.io/pusatdokumen/api/edukasi.php", 
});

export default api;
