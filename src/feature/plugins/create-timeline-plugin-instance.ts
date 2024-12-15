import TimelinePlugin from "wavesurfer.js/plugins/timeline";
import {WavesurferCustomPlugin} from "./plugin.types.ts";

export default function createTimelinePluginInstance({ws, onReady}: WavesurferCustomPlugin) {
    const activePlugins = ws.getActivePlugins()
    // @ts-ignore
    if (!activePlugins.includes("Timeline")) {
        console.log("Create Timeline!")
        const timelinePlugin = TimelinePlugin.create({
            style: {
                border: "thin solid black",
                background: "white",
                zIndex: "5"
            }
        })
        timelinePlugin.on("ready", () => onReady(true))
        ws.registerPlugin(timelinePlugin)
    }
}
