import { io } from "socket.io-client";

// Agar token kerak bo'lsa, uni avtomatik qo'shamiz
const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

// URL manzilingiz
const URL = "https://eco.company-erp.uz";
// const URL = "http://localhost:5000"


const socket = io(URL, {
    autoConnect: false, // Ulanishni avtomatik boshlamaslik
    reconnection: true, // Uzilganidan keyin qayta ulanish
    reconnectionAttempts: 5, // 5 marta qayta urinish
    reconnectionDelay: 2000, // Har bir urinish orasidagi kechikish
    auth: { token }, // JWT token bilan autentifikatsiya
});

// Qo'lda ulanish
socket.connect();

export default socket;
