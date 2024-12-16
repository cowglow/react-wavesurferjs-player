import SpectrogramPlugin from "wavesurfer.js/plugins/spectrogram";
import {WavesurferCustomPlugin} from "./plugin.types.ts";
import {COLOR_MAP} from "./constants.ts";

export default function createSpectrogramPluginInstance({ws, onReady}: WavesurferCustomPlugin) {
    console.log("Create Spectrogram!")
    const spectrogramPlugin = SpectrogramPlugin.create({
        container: ws.getWrapper(),
        fftSamples: 512,
        height: 90,
        labels: true,
        labelsBackground: "white",
        labelsColor: "black",
        labelsHzColor: "black",
        scale: "linear",
        colorMap: COLOR_MAP,
    })
    spectrogramPlugin.on("ready", () => onReady(true))
    return spectrogramPlugin
}