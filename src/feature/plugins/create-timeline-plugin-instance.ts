import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/plugins/timeline";

export default function createTimelinePluginInstance(ws: WaveSurfer) {
    const activePlugins = ws.getActivePlugins()
    // @ts-ignore
    if (!activePlugins.includes("Timeline")) {
        console.log("Create Timeline!")
        const timelinePlugin =TimelinePlugin.create({
            style: {
                border:"thin solid black",
                background: "white",
                zIndex: "5"
            }
        })
        ws.registerPlugin(timelinePlugin)
    }
}
