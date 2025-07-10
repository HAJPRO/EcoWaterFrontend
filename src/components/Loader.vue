<!-- <template>
  <section
    class="absolute inset-0 justify-center bg-opacity-50 flex flex-col items-center p-6 bg-gray-400 rounded-lg shadow-lg z-60 w-screen"
  >
    <div class="loading relative w-[250px] h-[250px]">
      <div class="blocks" style="--i: 1"></div>
      <div class="blocks" style="--i: 2"></div>
      <div class="blocks" style="--i: 3"></div>
      <div class="blocks" style="--i: 4"></div>
      <div class="blocks" style="--i: 5"></div>
      <div class="blocks" style="--i: 6"></div>
      <div class="blocks" style="--i: 7"></div>
      <div class="blocks" style="--i: 8"></div>
      <div class="blocks" style="--i: 9"></div>
      <div class="blocks" style="--i: 10"></div>
      <div class="blocks" style="--i: 11"></div>
      <div class="blocks" style="--i: 12"></div>
      <div class="blocks" style="--i: 13"></div>
      <div class="blocks" style="--i: 14"></div>
      <div class="blocks" style="--i: 15"></div>
      <div class="blocks" style="--i: 16"></div>
      <div class="blocks" style="--i: 17"></div>
      <div class="blocks" style="--i: 18"></div>
      <div class="blocks" style="--i: 19"></div>
      <div class="blocks" style="--i: 20"></div>
      <img
        class="text rounded-[50%] w-[100px] h-[100px]"
        src="../../public/haj.jpg"
      />
    </div>
  </section>
</template>
<style scoped>
section {
  animation: animateBackgroundColor 10s ease-in-out infinite;
}
.blocks {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #050c09;
  left: 50%;
  border-radius: 8px;
  transform: rotate(calc(18deg * var(--i)));
  transform-origin: 0 60px;
  animation: animate 1.9s ease-in-out infinite;
  animation-delay: calc(0.05s * var(--i));
}
.text {
  position: absolute;
  left: 50%;
  right: 50%;
  top: 24%;
  transform: translate(-50%, -50%);
  font-size: 2em;
  letter-spacing: 2px;
  animation: animationText 1.9s ease-in-out infinite;
}
@keyframes animateBackgroundColor {
  0% {
    filter: hue-rotate(0deg);
  }

  100% {
    filter: hue-rotate(360deg);
  }
}
@keyframes animate {
  0%,
  50% {
    background: #050c09;
    box-shadow: nano;
  }
  50.1%,
  100% {
    background: #04e273;
    box-shadow: 0 0 5px #04e273, 0 0 15px #04e273, 0 0 30px #04e273,
      0 0 60px #04e273, 0 0 90px #04e273;
  }
}
@keyframes animationText {
  0%,
  50% {
    color: #050c09;
    text-shadow: nano;
  }
  50.1%,
  100% {
    color: #04e273;
    text-shadow: 0 0 5px #04e273, 0 0 15px #04e273, 0 0 30px #04e273,
      0 0 60px #04e273, 0 0 90px #04e273;
  }
}
</style> -->
