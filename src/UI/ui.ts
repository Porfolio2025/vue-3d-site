import { createApp } from "vue";
import InterfaceUI from "./components/InterfaceUI.vue";
import App from "./App.vue";

let uiApp: any = null;
let uiInteractiveApp: any = null;

export function createUI() {
  if (!uiApp) {
    console.log("🚀 Montando UI principal...");
    uiApp = createApp(App);
    uiApp.mount("#ui");
    console.log("✅ UI principal montada.");
  } else {
    console.warn("⚠️ UI principal ya está montada. No se volverá a montar.");
  }
}

export function createVolumeUI() {
  if (!uiInteractiveApp) {
    console.log("🚀 Montando UI interactiva...");
    uiInteractiveApp = createApp(InterfaceUI);
    uiInteractiveApp.mount("#ui-interactive");
    console.log("✅ UI interactiva montada.");
  } else {
    console.warn("⚠️ UI interactiva ya está montada. No se volverá a montar.");
  }
}
