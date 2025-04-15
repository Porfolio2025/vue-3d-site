<template>
  <div id="ui-app">
    <LoadingScreen v-if="loading" />
    <HelpPrompt v-if="!loading" />
  </div>
</template>

<script setup>
import "./style.css";
import { ref, onMounted } from "vue";
import LoadingScreen from "./components/LoadingScreen.vue";
import HelpPrompt from "./components/HelpPrompt.vue";
import eventBus from "./EventBus";
import { createUI, createVolumeUI } from "./ui.ts";

const loading = ref(true);

onMounted(() => {
  console.log("🟢 App.vue montado. Escuchando 'loadingScreenDone'...");

  eventBus.on("loadingScreenDone", () => {
    console.log(
      "✅ Evento 'loadingScreenDone' recibido. Ocultando pantalla de carga."
    );
    loading.value = false;
  });

  // Iniciar la UI
  createUI();
  createVolumeUI();
});
</script>
