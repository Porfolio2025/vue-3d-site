<script setup>
import { ref, onMounted, watch } from "vue";
import eventBus from "../EventBus";

const progress = ref(0);
const toLoad = ref(0);
const loaded = ref(0);
const overlayOpacity = ref(1);
const loadingTextOpacity = ref(1);
const startPopupOpacity = ref(0);
const webGLErrorOpacity = ref(0);
const showBiosInfo = ref(false);
const showLoadingResources = ref(false);
const doneLoading = ref(false);
const webGLError = ref(false);
const resources = ref([]);
const mobileWarning = ref(window.innerWidth < 768);

const onResize = () => {
  mobileWarning.value = window.innerWidth < 768;
};

window.addEventListener("resize", onResize);

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("debug")) {
    start();
  } else if (!detectWebGLContext()) {
    webGLError.value = true;
  } else {
    showBiosInfo.value = true;
  }

  eventBus.on("loadedSource", (data) => {
    progress.value = data.progress;
    toLoad.value = data.toLoad;
    loaded.value = data.loaded;
    resources.value.push(
      `Loaded ${data.sourceName}${getSpace(data.sourceName)} ... ${Math.round(
        data.progress * 100
      )}%`
    );
    if (resources.value.length > 8) {
      resources.value.shift();
    }
  });
});

watch(progress, (newProgress) => {
  if (newProgress >= 1 && !webGLError.value) {
    doneLoading.value = true;
    setTimeout(() => {
      loadingTextOpacity.value = 0;
      setTimeout(() => {
        startPopupOpacity.value = 1;
      }, 500);
    }, 1000);
  }
});

const start = () => {
  overlayOpacity.value = 0;
  eventBus.emit("loadingScreenDone");
  const ui = document.getElementById("ui");
  if (ui) {
    ui.style.pointerEvents = "none";
  }
};

const getCurrentDate = () => {
  const date = new Date();
  return date.toLocaleDateString("en-US");
};

const detectWebGLContext = () => {
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  return !!gl;
};

const getSpace = (sourceName) => {
  let spaces = "";
  for (let i = 0; i < 24 - sourceName.length; i++) spaces += "\xa0";
  return spaces;
};
</script>

<style scoped>
@import "../style.css";
</style>

<template>
  <div
    class="bg-black w-full h-full flex opacity-100"
    :style="{
      transform: `scale(${overlayOpacity === 0 ? 1.1 : 1})`,
    }"
  >
    <div v-if="startPopupOpacity === 0 && loadingTextOpacity === 0">
      <span class="blinking-cursor"></span>
    </div>

    <div v-if="!webGLError" :style="{ opacity: loadingTextOpacity }">
      <div class="p-[48px]!">
        <div class="flex flex-grow">
          <p class="text-[#4df74d]!"><b>Christian Carrasco,</b></p>
          <p class="text-[#4df74d]!"><b>Chris Inc.</b></p>
        </div>
        <div>
          <p>Released: 01/13/2000</p>
          <p>HHBIOS (C)2000 Carrasco Christian Inc.</p>
        </div>
      </div>

      <div class="pr-[48px]! pl-[48px]!">
        <p>HSP S13 2000-2025 Special UC131S</p>
        <div class="h-[16px]"></div>

        <template v-if="showBiosInfo">
          <p>HSP Showcase(tm) XX 113</p>
          <p>Checking RAM: 14000 OK</p>
          <div class="h-[16px]"></div>
          <div class="h-[16px]"></div>
          <p v-if="showLoadingResources">
            {{
              progress === 1
                ? "FINISHED LOADING RESOURCES"
                : `LOADING RESOURCES (${loaded}/${toLoad || "-"})`
            }}
          </p>
          <p v-else class="loading">WAIT</p>
        </template>

        <div class="h-[16px]"></div>
        <div class="flex flex-col">
          <p v-for="source in resources" :key="source">{{ source }}</p>
        </div>

        <div class="h-[16px]"></div>
        <p v-if="showLoadingResources && doneLoading">
          All Content Loaded, launching
          <b class="text-[#4df74d]!">'Christian Carrasco Portfolio Showcase'</b>
          V1.0
        </p>

        <div class="h-[16px]"></div>
        <span class="blinking-cursor"></span>
      </div>

      <div class="p-[48px]! pb-[64px]!">
        <p>Press <b>DEL</b> to enter SETUP , <b>ESC</b> to skip memory test</p>
        <p>{{ getCurrentDate() }}</p>
      </div>
    </div>

    <div
      v-if="webGLError"
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-full h-full"
      :style="{ opacity: webGLErrorOpacity }"
    >
      <div
        class="bg-black p-[24px]! border-[7px] border-white text-center max-w-[500px]! min-w-[300px]!"
      >
        <p><b style="color: red">CRITICAL ERROR:</b> No WebGL Detected</p>
        <p>WebGL is required to run this site.</p>
        <p>Please enable it or switch to a browser which supports WebGL</p>
      </div>
    </div>

    <div
      v-if="doneLoading"
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-full h-full"
      :style="{ opacity: startPopupOpacity }"
    >
      <div
        class="bg-black p-[24px]! border-[7px] border-white text-center max-w-[500px]! min-w-[300px]!"
      >
        <p>Christian Carrasco Portfolio 2025</p>

        <template v-if="mobileWarning">
          <br />
          <b>
            <p>WARNING: This experience is best viewed on</p>
            <p>a desktop or laptop computer.</p>
          </b>
          <br />
        </template>

        <div class="flex items-end">
          <p>Haz click en start&nbsp;</p>
          <span class="blinking-cursor"></span>
        </div>

        <div
          class="bios-start-button flex justify-center items-center mt-4!"
          @click="start"
        >
          <div
            class="group bg-black p-2! border-white border-t-4 border-b-4 border-l-[3px] border-r-[3px] hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer"
          >
            <p class="text-white group-hover:text-black!">START</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
