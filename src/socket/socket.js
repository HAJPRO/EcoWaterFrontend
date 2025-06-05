import { io } from "socket.io-client";

// Agar token kerak bo'lsa, uni avtomatik qo'shamiz ///
const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

const isProd = window.location.hostname !== 'localhost';
const URL = isProd
    ? 'https://eco.company-erp.uz'
    : 'http://localhost:5000'
const socket = io(URL, {
    autoConnect: false, // Ulanishni avtomatik boshlamaslik
    reconnection: true, // Uzilganidan keyin qayta ulanish
    reconnectionDelay: 1000, // Har bir urinish orasidagi kechikish
    auth: { token }, // JWT token bilan autentifikatsiya
    reconnectionAttempts: Infinity,
    pingInterval: 25000,
    pingTimeout: 300000,
    withCredentials: true,
    transports: ["websocket", "polling"], // Har doim ikkisini yozing
});

// Qo'lda ulanish
socket.connect();

export default socket;
