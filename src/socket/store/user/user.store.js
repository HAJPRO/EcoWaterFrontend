import { defineStore } from "pinia";
import  socket  from "../../socket"; // Socket.io ulanishi

export const UserSocketStore = defineStore("socket", {
    state: () => ({
        onlineUsers: [], // Tizimga kirgan foydalanuvchilar ro‘yxati
        isConnected: false, // Socket ulanish holati
    }),

    actions: {
        SocketConnect(user) {
            console.log("🟢 Serverga foydalanuvchi ulandi", user);
            this.onlineUsers.push(user); // Foydalanuvchilar ro‘yxatini tozalash
            socket.emit("register", user); // 🟢 Serverga foydalanuvchini yuborish

            socket.on("connect", () => {
                console.log("✅ Socket.io bog‘landi:", socket.id);
                this.isConnected = true;
            });

            socket.on("disconnect", () => {
                console.log("❌ Socket.io uzildi");
                this.isConnected = false;
            });

            // 🔵 **"OnlineUsers" eventini tinglash** va foydalanuvchilarni yangilash
            socket.on("OnlineUsers", (user) => {
                console.log(user);
                
                // const exists = this.onlineUsers.some(user => user.id === newUser.id);
                // if (!exists) {
                //     this.onlineUsers.push(newUser);
                //     console.log("🟢 Yangi foydalanuvchi qo‘shildi:", newUser);
                // }
            });
        },

        disconnect() {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("OnlineUsers");
        },
    },
});