<script setup>
import { ref, onMounted, watch } from "vue";
import eventBus from "../EventBus";
import InfoOverlay from "./InfoOverlay.vue";

const initLoad = ref(true);
const visible = ref(false);
const loading = ref(true);
const interfaceRef = ref(null);

onMounted(() => {
  eventBus.on("loadingScreenDone", () => {
    loading.value = false;
  });

  interfaceRef.value = document.getElementById("ui-interactive");
});

const initMouseDownHandler = () => {
  visible.value = true;
  initLoad.value = false;
};

watch([loading, initLoad], ([newLoading, newInitLoad]) => {
  if (!newLoading && newInitLoad) {
    document.addEventListener("mousedown", initMouseDownHandler);
    return () => {
      document.removeEventListener("mousedown", initMouseDownHandler);
    };
  }
});

onMounted(() => {
  eventBus.on("enterMonitor", () => {
    visible.value = false;
    initLoad.value = false;
    if (interfaceRef.value) {
      interfaceRef.value.style.pointerEvents = "none";
    }
  });

  eventBus.on("leftMonitor", () => {
    visible.value = true;
    if (interfaceRef.value) {
      interfaceRef.value.style.pointerEvents = "auto";
    }
  });
});
</script>

<template>
  <transition name="fade">
    <div
      v-if="!loading"
      class="w-full flex absolute box-border interface-wrapper"
      id="prevent-click"
    >
      <InfoOverlay :visible="visible" />
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-32px);
}
</style>
