import { io } from "socket.io-client";

// Agar token kerak bo'lsa, uni avtomatik qo'shamiz
const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

const socket = io("http://localhost:5000", {
    autoConnect: false, // ⚠️ Auto connectni o‘chirib qo‘yamiz, qo‘lda ulaymiz!
    reconnection: true, // Uzilib qolsa, qayta ulanadi
    reconnectionAttempts: 5, // 5 marta qayta ulanib ko‘radi
    reconnectionDelay: 2000, // Har bir urinishdan keyin 2 soniya kutadi
    auth: { token }, // Agar server JWT bilan ishlasa
});

export default socket;


