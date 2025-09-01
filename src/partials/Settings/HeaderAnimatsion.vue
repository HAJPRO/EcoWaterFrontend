<template>
  <div class="season-falling z-0">
    <div
      v-for="n in totalIcons"
      :key="n"
      :class="['falling-icon', seasonClass]"
      :style="getStyle(n)"
    ></div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  season: {
    type: String,
    default: "0",
    validator: (val) => ["1", "2", "3", "4"].includes(val),
  },
});

const iconMap = {
  1: "https://cdn-icons-png.flaticon.com/512/765/765449.png", // Bahor - gul
  2: "https://cdn-icons-png.flaticon.com/512/2909/2909937.png", // Yoz - yashil barg
  3: "https://cdn-icons-png.flaticon.com/512/2909/2909591.png", // Kuz - sariq barg
  4: "../../../public/lovepik-autumn-yellow-leaves-png-image_401554896_wh1200.png", // Qish - qor
};

const seasonClass = computed(() => `season-${props.season}`);

// Mos ravishda 30 ta icon hosil qilamiz
const totalIcons = 10;

function getStyle(index) {
  const left = Math.random() * 100;
  const delay = (Math.random() * 10).toFixed(2);
  const size = 20 + Math.random() * 30;
  const duration = 6 + Math.random() * 30; // tezlik oshirilgan
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`,
  };
}
</script>

<style scoped>
.season-falling {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.falling-icon {
  position: absolute;
  top: -60px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.7;
  animation-name: fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

/* Animatsiya */
@keyframes fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.9;
  }
  100% {
    transform: translateY(120vh) rotate(360deg);
    opacity: 0;
  }
}

/* Har fasl uchun fon rasmi */
.season-1 {
  background-image: url("https://marketplace.canva.com/ARZ8E/MAFmAUARZ8E/1/tl/canva-natural-leaf-icon.-100%25-naturals-vector-image-MAFmAUARZ8E.png");
}

.season-2 {
  background-image: url("https://cdn-icons-png.flaticon.com/512/869/869869.png");
}

.season-3 {
  background-image: url("https://images.vexels.com/media/users/3/265149/isolated/preview/a2c6bb895ba8c8d465157f149639e67f-autumn-yellow-leaf.png");
}

.season-4 {
  background-image: url("https://cdn-icons-png.flaticon.com/512/2530/2530064.png");
}
</style>
