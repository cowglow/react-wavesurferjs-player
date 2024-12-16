import TimelinePlugin from "wavesurfer.js/plugins/timeline";
import {WavesurferCustomPlugin} from "./plugin.types.ts";

export default function createTimelinePluginInstance({ws, onReady}: WavesurferCustomPlugin) {
    console.log("Create Timeline!")
    const timelinePlugin = TimelinePlugin.create({
        container: ws.getWrapper(),
        style: {
            border: "thin solid black",
            background: "white",
            zIndex: "5"
        }
    })
    timelinePlugin.on("ready", () => onReady(true))
    return timelinePlugin
}
