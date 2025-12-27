<template>
  <div
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
  >
    <div class="relative flex flex-col items-center justify-center">
      <!-- Rotating gradient ring with glow -->
      <div class="relative w-40 h-40 flex items-center justify-center">
        <!-- Outer glowing animated ring -->
        <div class="absolute inset-0 animate-gradient ring-glow"></div>

        <!-- Safy logo -->
        <img
           src="/public/Flowbit_logo_3.jpg"
          alt="Safy Logo"
          class="w-32 h-32 drop-shadow-2xl animate-pulse-slow animate-rotate-logo rounded-full"
        />
      </div>

      <!-- Optional text under logo -->
      <p
        class="mt-6 text-indigo-200 font-semibold text-lg tracking-widest animate-fade-in"
      >
        Loading Safymilk...
      </p>
    </div>
  </div>
</template>

<script setup>
// Optional future dynamic color cycling if needed
const colors = [
  "#2563EB", // blue-600
  "#4F46E5", // indigo-600
  "#3B82F6", // blue-500
  "#8B5CF6", // violet-500
];
</script>

<style scoped>
/* Rotating Cemtrix logo */
@keyframes rotate-logo {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.animate-rotate-logo {
  animation: rotate-logo 5s linear infinite;
}

/* Slow pulsing effect */
@keyframes pulse-slow {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.15);
  }
}
.animate-pulse-slow {
  animation: pulse-slow 2.5s ease-in-out infinite;
}

/* Smooth fade-in for text */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 1.5s ease forwards;
}

/* Gradient halo with indigo-blue spectrum */
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
  background: conic-gradient(
    from 0deg,
    #4f46e5,
    #2563eb,
    #3b82f6,
    #8b5cf6,
    #4f46e5
  );
  background-size: 200% 200%;
  background-repeat: no-repeat;
  animation: gradient-shift 3s ease-in-out infinite;
  border-radius: 50%;
  padding: 8px;
  mask: radial-gradient(
    farthest-side,
    transparent calc(100% - 6px),
    black calc(100% - 2px)
  );
  -webkit-mask: radial-gradient(
    farthest-side,
    transparent calc(100% - 6px),
    black calc(100% - 2px)
  );
}

/* Soft glowing ring around logo */
.ring-glow::after {
  content: "";
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  box-shadow: 0 0 25px 10px rgba(79, 70, 229, 0.4),
    0 0 50px 20px rgba(37, 99, 235, 0.2);
  animation: pulse-glow 3s ease-in-out infinite;
}
@keyframes pulse-glow {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}
</style>
