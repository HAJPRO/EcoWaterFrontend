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

            // 🔊 Haydovchilarni tinglash
            this.listenEvents();
        },

        // 📡 Haydovchi lokatsiyasi yangilanishini tinglash
        listenEvents() {
            socket.on("driverLocationUpdate", (driverData) => {
                this.updateDriver(driverData);
            });
        },

        // 📥 Haydovchini qo‘shish yoki yangilash
        updateDriver(driverData) {
            const index = this.drivers.findIndex(d => d.id === driverData.id);

            if (index !== -1) {
                // Mavjud haydovchi - koordinatalarni yangilash
                const driver = this.drivers[index];
                driver.lat = driverData.lat;
                driver.lng = driverData.lng;
                driver.trajectory.push([driverData.lat, driverData.lng]);
            } else {
                // Yangi haydovchi
                this.drivers.push({
                    ...driverData,
                    trajectory: [[driverData.lat, driverData.lng]],
                });
            }
            console.log(this.drivers);

        },

        disconnect() {
            // 🎯 Oldingi eventlarni tozalash
            socket.off("connect");
            socket.off("disconnect");
            socket.off("OnlineUsers");
            socket.off("driverLocationUpdate");
            this.isConnected = false;
        },
    }
});
