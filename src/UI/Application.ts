import * as THREE from "three";
import Debug from "../Utils/Debug";
import Sizes from "../Utils/Sizes";
import Time from "../Utils/Time";
import Camera from "../Camera/Camera";
import Renderer from "./Renderer";
import Mouse from "../Utils/Mouse";
import World from "../World/World";
import Resources from "../Utils/Resources";
import sources from "./sources";
import Stats from "stats.js";
import Loading from "../Utils/Loading";
import UI from "./index";

let instance: Application | null = null;

export default class Application {
    private static instance: Application;
    debug!: Debug;
    sizes!: Sizes;
    time!: Time;
    scene!: THREE.Scene;
    cssScene!: THREE.Scene;
    overlayScene!: THREE.Scene;
    resources!: Resources;
    camera!: Camera;
    renderer!: Renderer;
    world!: World;
    mouse!: Mouse;
    loading!: Loading;
    ui!: UI;
    stats: Stats | undefined;

    constructor() {
        if (Application.instance) {
            return Application.instance;
        }
        Application.instance = this;

        console.log("🚀 `Application` ha sido creada correctamente.");

        // Setup
        this.debug = new Debug();
        this.sizes = new Sizes();
        this.mouse = new Mouse();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.cssScene = new THREE.Scene();
        this.overlayScene = new THREE.Scene();
        this.resources = new Resources(sources);
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.camera.createControls();
        this.world = new World();
        this.ui = new UI();

        // 🔥 Asegurar que `loading` SIEMPRE está definido
        this.loading = new Loading();

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("debug")) {
            this.stats = new Stats();
            this.stats.showPanel(0);
            document.body.appendChild(this.stats.dom);
        }

        // Eventos
        this.sizes.on("resize", () => {
            this.resize();
        });

        this.time.on("tick", () => {
            this.update();
        });
    }

    static getInstance(): Application {
        if (!Application.instance) {
            Application.instance = new Application();
        }
        return Application.instance;
    }

    getLoading(): Loading {
        if (!this.loading) {
            this.loading = new Loading(); // Asegurar que nunca sea undefined
        }
        return this.loading;
    }

    resize() {
        this.camera.resize();
        this.renderer.resize();
    }

    update() {
        if (this.stats) this.stats.begin();
        this.camera.update();
        this.world.update();
        this.renderer.update();
        if (this.stats) this.stats.end();
    }

    destroy() {
        this.sizes.off("resize");
        this.time.off("tick");

        this.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                for (const key in child.material) {
                    const value = child.material[key];
                    if (value && typeof value.dispose === "function") {
                        value.dispose();
                    }
                }
            }
        });

        this.renderer.instance.dispose();

        if (this.debug.active) this.debug.ui.destroy();
    }
}
