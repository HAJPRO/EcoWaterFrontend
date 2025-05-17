import { defineStore } from "pinia";
import socket from "../../socket";

export const UserSocketStore = defineStore("UserSocketStore", {
    state: () => ({
        onlineUsers: [],     // Tizimga kirgan foydalanuvchilar ro‘yxati
        drivers: [],   // Tizimga kirgan haydovchilar ro‘yxati
        isConnected: false,  // Socket ulanish holati
    }),

    actions: {
        SocketConnect(user) {
            this.disconnect(); // 🔄 Avvalgi tinglovchilarni o‘chirish

            socket.on("connect", () => {
                console.log("✅ Socket.io bog‘landi:", socket.id);
                this.isConnected = true;

                // 🔗 Serverga user va lokatsiyani yuborish
                socket.emit("register", user);
                socket.emit("driverLocation", user);
            });

            socket.on("disconnect", () => {
                console.log("❌ Socket.io uzildi");
                this.isConnected = false;
            });

            socket.on("OnlineUsers", (users) => {
                this.onlineUsers = users;
                console.log("🟢 Online foydalanuvchilar:", users);
            });


        },

        // 📡 Haydovchi lokatsiyasi yangilanishini tinglash


        disconnect() {
            // 🎯 Oldingi eventlarni tozalash
            socket.off("connect");
            socket.off("disconnect");
            socket.off("OnlineUsers");
            this.isConnected = false;
        },
    }
});
