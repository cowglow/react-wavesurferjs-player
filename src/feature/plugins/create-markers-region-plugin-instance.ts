import RegionsPlugin from "wavesurfer.js/plugins/regions";

export default function createMarkersRegionPluginInstance() {
    console.log('Create Marker Region!')
    const markersPlugin = RegionsPlugin.create()
    markersPlugin.on("region-update", console.log)
    return markersPlugin
}
