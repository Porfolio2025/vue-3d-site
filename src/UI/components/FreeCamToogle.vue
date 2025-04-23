<script setup>
import { ref, onMounted, watch } from "vue";
import eventBus from "../EventBus";
import cameraIcon from "../../../public/textures/UI/camera.svg";
import mouseIcon from "../../../public/textures/UI/mouse.svg";

const isHovering = ref(false);
const isActive = ref(false);
const freeCamActive = ref(false);
const windowWidth = ref(window.innerWidth);

const onMouseDownHandler = (event) => {
  isActive.value = true;
  event.preventDefault();
  freeCamActive.value = !freeCamActive.value;
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

watch(freeCamActive, (newState) => {
  eventBus.emit("freeCamToggle", newState);
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
      :src="freeCamActive ? mouseIcon : cameraIcon"
      :style="{
        opacity: isActive ? 0.2 : isHovering ? 0.8 : 1,
        width: windowWidth < 768 ? '1.5rem' : '2rem',
        height: '0.5rem',
        objectFit: 'contain',
      }"
      :width="windowWidth < 768 ? 8 : 10"
    />
  </div>
</template>
