import SpectrogramPlugin from "wavesurfer.js/plugins/spectrogram";
import {WavesurferCustomPlugin} from "./plugin.types.ts";

export default function createSpectrogramPluginInstance({ws, onReady}: WavesurferCustomPlugin) {
    const activePlugins = ws.getActivePlugins()
    // @ts-ignore
    if (!activePlugins.includes("Spectrogram")) {
        console.log("Create Spectrogram!")
        const spectrogramPlugin = SpectrogramPlugin.create({
            labels: true,
            height: 128,
            fftSamples: 140,
        })
        spectrogramPlugin.on("ready", () => onReady(true))
        ws.registerPlugin(spectrogramPlugin)
    }
}