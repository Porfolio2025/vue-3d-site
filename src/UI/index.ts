import { createUI, createVolumeUI } from "./UI";

export default class UI {
    constructor() {
        console.log("📌 UI inicializando...");
        createUI();
        createVolumeUI();
        console.log("✅ UI cargada correctamente.");
    }
}