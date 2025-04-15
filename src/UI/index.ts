import { createUI, createVolumeUI } from "./ui.ts";

export default class UI {
    constructor() {
        console.log("📌 UI inicializando...");
        createUI();
        createVolumeUI();
        console.log("✅ UI cargada correctamente.");
    }
}