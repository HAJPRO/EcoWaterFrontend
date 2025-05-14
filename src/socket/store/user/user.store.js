import { defineStore } from "pinia";
import socket from "../../socket";

export const UserSocketStore = defineStore("UserSocketStore", {
    state: () => ({
        onlineUsers: [], // Tizimga kirgan foydalanuvchilar ro‘yxati
        onlineDrivers: [], // Tizimga kirgan haydovchilar ro‘yxati
        isConnected: false, // Socket ulanish holati
    }),

    actions: {
        SocketConnect(user) {
            // 🔄 Avvalgi tinglovchilarni o‘chirish
            this.disconnect();

            // 🧩 "connect" event — birinchi bo‘lishi kerak
            socket.on("connect", () => {
                console.log("✅ Socket.io bog‘landi:", socket.id);
                this.isConnected = true;

                // 🔗 Serverga user va lokatsiyani yuborish
                socket.emit("register", user);
                socket.emit("driverLocation", user);
            });

            // ❌ Ulanish uzildi
            socket.on("disconnect", () => {
                console.log("❌ Socket.io uzildi");
                this.isConnected = false;
            });

            // 👥 Online foydalanuvchilar
            socket.on("OnlineUsers", (users) => {
                this.onlineUsers = users;
                console.log("🟢 Online foydalanuvchilar:", users);
            });
        },
        DriverLocation(driverLocation) {

            // 🔄 Faqatgina lokatsiyani yuborish
            if (this.isConnected) {
                this.onlineDrivers.push(driverLocation);
                console.log("🟢 Online haydovchilar:", this.onlineDrivers);

                socket.emit("driverLocation", driverLocation);
            }
        },

        disconnect() {
            // 🎯 Oldingi barcha eventlarni o‘chirish
            socket.off("connect");
            socket.off("disconnect");
            socket.off("OnlineUsers");
            this.isConnected = false;
        },
    }

});
