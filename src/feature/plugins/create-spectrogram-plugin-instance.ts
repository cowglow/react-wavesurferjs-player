import WaveSurfer from "wavesurfer.js";
import SpectrogramPlugin, {SpectrogramPluginOptions} from "wavesurfer.js/plugins/spectrogram";

export default function createSpectrogramPluginInstance(ws: WaveSurfer) {
    const activePlugins = ws.getActivePlugins()
    // @ts-ignore
    if (!activePlugins.includes("Spectrogram")) {
        console.log("Create Spectrogram!")
        const spectrogramPluginOptions: SpectrogramPluginOptions = {
            labels: true,
            height: 140,
            fftSamples: 140,
            scale: "linear"
        }
        const spectrogramPlugin = SpectrogramPlugin.create(spectrogramPluginOptions)
        ws.registerPlugin(spectrogramPlugin)
    }
}