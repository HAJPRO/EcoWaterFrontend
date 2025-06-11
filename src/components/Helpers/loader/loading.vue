<template>
  <div
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 w-full"
  >
    <div
      class="bg-opacity-50 rounded-lg relative flex flex-col items-center justify-center"
    >
      <!-- Logo with rotating color ring -->
      <div class="relative w-36 h-36 flex items-center justify-center">
        <!-- Rotating gradient ring with animated colors -->
        <div
          class="absolute inset-0 rounded-full ring-gradient animate-gradient"
        ></div>

        <!-- Logo itself -->
        <img
          src="/public/eco_logo.jpg"
          alt="logo"
          class="w-28 h-28 drop-shadow-xl animate-pulse-slow rounded-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const colors = [
  "#2563EB", // blue-600
  "#4F46E5", // indigo-600
  "#EC4899", // pink-500
  "#F59E0B", // amber-500
  "#10B981", // emerald-500
  "#3B82F6", // blue-500
  "#8B5CF6", // violet-500
];
</script>

<style scoped>
@keyframes bounce-custom {
  0%,
  100% {
    transform: translateY(0);
    opacity: 1;
  }
  50% {
    transform: translateY(-18px);
    opacity: 0.4;
  }
}
.animate-bounce-custom {
  display: inline-block;
  animation: bounce-custom 1.2s ease-in-out infinite;
  will-change: transform, opacity;
  user-select: none;
}

/* Slow pulse for logo */
@keyframes pulse-slow {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.2);
  }
}
.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}

/* Gradient ring with color animation */
@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.animate-gradient {
  background: conic-gradient(from 0deg, #ec4899, #f59e0b, #10b981, #8b5cf6);
  background-size: 200% 200%;
  background-repeat: no-repeat;
  animation: gradient-shift 0.5s linear infinite;

  border-radius: 50%;
  padding: 6px;

  /* Transparent middle ring */
  mask: radial-gradient(
    farthest-side,
    transparent calc(100% - 6px),
    black calc(100% - 5px)
  );
  -webkit-mask: radial-gradient(
    farthest-side,
    transparent calc(100% - 6px),
    black calc(100% - 5px)
  );
}
</style>
