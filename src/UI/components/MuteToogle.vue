<script setup>
import { ref, onMounted, watch } from "vue";
import eventBus from "../EventBus";
import volumeOn from "../../../public/textures/UI/volume_on.svg";
import volumeOff from "../../../public/textures/UI/volume_off.svg";

const isHovering = ref(false);
const isActive = ref(false);
const muted = ref(false);
const windowWidth = ref(window.innerWidth);

const onMouseDownHandler = (event) => {
  isActive.value = true;
  event.preventDefault();
  muted.value = !muted.value;
};

const onMouseUpHandler = () => {
  isActive.value = false;
};

const updateWindowSize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", updateWindowSize);
});

watch(muted, (newMuted) => {
  eventBus.emit("muteToggle", newMuted);
});
</script>

<template>
  <div
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    @mousedown="onMouseDownHandler"
    @mouseup="onMouseUpHandler"
    class="icon-control-container bg-black pl-2! pr-2! text-center flex box-border justify-center items-center cursor-pointer"
    id="prevent-click"
  >
    <img
      id="prevent-click"
      :src="muted ? volumeOff : volumeOn"
      :style="{ opacity: isActive ? 0.2 : isHovering ? 0.8 : 1 }"
      :width="windowWidth < 768 ? 8 : 10"
    />
  </div>
</template>
