import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Application from '../UI/Application';
import UIEventBus from '../UI/EventBus';
import EventEmitter from './EventEmitter';
import Loading from './Loading';

export default class Resources extends EventEmitter {
    sources: Resource[];
    // Not sure about this one
    items: {
        texture: { [name: string]: LoadedTexture };
        cubeTexture: { [name: string]: LoadedCubeTexture };
        gltfModel: { [name: string]: LoadedModel };
        audio: { [name: string]: LoadedAudio };
    };
    toLoad: number;
    loaded: number;
    loaders: {
        gltfLoader: GLTFLoader;
        textureLoader: THREE.TextureLoader;
        cubeTextureLoader: THREE.CubeTextureLoader;
        audioLoader: THREE.AudioLoader;
    };
    application: Application;
    loading: Loading;

    constructor(sources: Resource[]) {
        super();

        this.sources = sources;

        this.items = { texture: {}, cubeTexture: {}, gltfModel: {}, audio: {} };
        this.toLoad = this.sources.length;
        this.loaded = 0;
        this.application = new Application();
        this.loading = this.application.getLoading();

        

        this.setLoaders();
        this.startLoading();
    }

    setLoaders() {
        this.loaders = {
            gltfLoader: new GLTFLoader(),
            textureLoader: new THREE.TextureLoader(),
            cubeTextureLoader: new THREE.CubeTextureLoader(),
            audioLoader: new THREE.AudioLoader(),
        };
    }

    startLoading() {
        // Load each source
        for (const source of this.sources) {
            console.log(`🔍 Intentando cargar: ${source.type} desde ${source.path}`);

            if (source.type === 'gltfModel') {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) => {
                        console.log(`✅ Cargado correctamente: ${source.path}`);
                        this.sourceLoaded(source, file);
                    },
                    undefined,
                    (error) => {
                        console.error(`❌ Error cargando GLTF: ${source.path}`, error);
                    }
                );
            } else if (source.type === 'texture') {
                this.loaders.textureLoader.load(source.path, (file) => {
                    console.log(`✅ Cargada textura: ${source.path}`);
                    file.colorSpace = THREE.SRGBColorSpace;
                    this.sourceLoaded(source, file);
                }, undefined, (error) => {
                    console.error(`❌ Error cargando textura: ${source.path}`, error);
                });
            } else if (source.type === 'cubeTexture') {
                this.loaders.cubeTextureLoader.load(source.path, (file) => {
                    console.log(`✅ Cargado CubeTexture: ${source.path}`);
                    this.sourceLoaded(source, file);
                }, undefined, (error) => {
                    console.error(`❌ Error cargando CubeTexture: ${source.path}`, error);
                });
            } else if (source.type === 'audio') {
                this.loaders.audioLoader.load(source.path, (buffer) => {
                    console.log(`✅ Cargado audio: ${source.path}`);
                    this.sourceLoaded(source, buffer);
                }, undefined, (error) => {
                    console.error(`❌ Error cargando audio: ${source.path}`, error);
                });
            }
        }
    }


    sourceLoaded(source: Resource, file: LoadedResource) {
        this.items[source.type][source.name] = file;

        this.loaded++;

        this.loading.trigger('loadedSource', [
            source.name,
            this.loaded,
            this.toLoad,
        ]);

        if (this.loaded === this.toLoad) {
            this.trigger('ready');
        }
    }
}
