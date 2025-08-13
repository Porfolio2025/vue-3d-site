<script setup>
import { ref, onMounted, watch } from "vue";
import UIEventBus from "../EventBus";

const HELP_TEXT = "Click to start";

const helpText = ref("");
const visible = ref(true);
const visRef = ref(visible.value);

const typeHelpText = (i, curText) => {
  if (i < HELP_TEXT.length && visRef.value) {
    setTimeout(() => {
      window.postMessage(
        { type: "keydown", key: `_AUTO_${HELP_TEXT[i]}` },
        "*"
      );
      helpText.value = curText + HELP_TEXT[i];
      typeHelpText(i + 1, curText + HELP_TEXT[i]);
    }, Math.random() * 120 + 50);
  }
};

onMounted(() => {
  setTimeout(() => {
    typeHelpText(0, "");
  }, 500);

  document.addEventListener("mousedown", () => {
    visible.value = false;
  });

  UIEventBus.on("enterMonitor", () => {
    visible.value = false;
  });
});

watch(visible, (newVal) => {
  if (!newVal) {
    window.postMessage({ type: "keydown", key: `_AUTO_` }, "*");
  }
  visRef.value = newVal;
});
</script>

<template>
  <Transition name="fade">
    <div
      v-if="helpText.length > 0"
      class="absolute bottom-[64px]! bg-black px-4! py-1! text-center flex items-end"
    >
      <p>{{ helpText }}</p>
      <div class="ml-2! pb-[2px]! pr-1!">
        <div class="blinking-cursor"></div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
