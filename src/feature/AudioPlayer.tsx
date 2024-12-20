import {Box} from "@mui/material";
import {useWavesurfer} from "@wavesurfer/react";
import {MutableRefObject, useEffect, useRef, useState} from "react";
import {DEFAULT_ZOOM_MAX, DEFAULT_ZOOM_MIN} from "./plugins/constants.ts";
import createSpectrogramPluginInstance from "./plugins/create-spectrogram-plugin-instance.ts";
import createTimelinePluginInstance from "./plugins/create-timeline-plugin-instance.ts";
import {audioPlayerOptions} from "./plugins/audio-player-options.ts";
import {AddMarkerControl, PlaybackControls, SpectrogramControl, TimestampDisplay, ZoomControl} from "./controls";
import createMarkersRegionPluginInstance from "./plugins/create-markers-region-plugin-instance.ts";

import {WavesurferPlugins} from "./plugins/plugin.types.ts";
import {WaveSurferOptions} from "wavesurfer.js";
import {WavesurferFooter, WavesurferFooterContent, WavesurferPlayer, WavesurferWrapper} from "./AudioPlayer.Styled.ts";

import RegionsPlugin from "wavesurfer.js/plugins/regions";

enum ACTIONS_ENUM {
    ADD_MARKER = "ADD_MARKER",
    // ADD_REGION = "ADD_REGION"
}

export default function AudioPlayer() {
    const containerRef = useRef(null)
    const {wavesurfer, isReady, isPlaying, currentTime} = useWavesurfer({
        // @ts-ignore
        container: containerRef,
        ...audioPlayerOptions,
    } as Omit<WaveSurferOptions, "container"> & { container: MutableRefObject<null> })
    const [action, setAction] = useState<ACTIONS_ENUM | null>(null)
    const [wavesurferPlugins, setWavesurferPlugins] = useState<WavesurferPlugins | null>(null)

    // Ready States
    const [readySpectrogram, setReadySpectrogram] = useState(false)
    const [readyTimeline, setReadyTimeline] = useState(false)

    // Component State
    const [showSpectrogram, setShowSpectrogram] = useState(false) // Has Spectrogram Plugin
    const [zoom, setZoom] = useState(DEFAULT_ZOOM_MAX); // onZoom

    useEffect(() => {
        // Initial setup
        if (!wavesurfer) return
        if (isReady) {
            setWavesurferPlugins({
                timeline: createTimelinePluginInstance({
                    ws: wavesurfer,
                    onReady: setReadyTimeline
                }),
                markers: createMarkersRegionPluginInstance(),
                spectrogram: null
            })
        }
    }, [isReady]);

    // Mount and unmount the Spectrogram Plugin
    useEffect(() => {
        if (!wavesurfer) return
        setWavesurferPlugins(prevState => ({
            ...prevState,
            spectrogram: showSpectrogram
                ? createSpectrogramPluginInstance({
                    ws: wavesurfer,
                    onReady: value => setTimeout(() => setReadySpectrogram(value), 1000)
                }) : null
        }))
        if (!showSpectrogram) {
            setReadySpectrogram(false);
        }
    }, [showSpectrogram]);

    // Register plugin by effect
    useEffect(() => {
        if (wavesurfer && wavesurferPlugins) {
            // Remove the Active Plugins
            // @ts-ignore
            [...wavesurfer.getActivePlugins()].forEach(plugin => plugin?.options && plugin.destroy())

            // Register the Active Plugins
            wavesurferPlugins["markers"] && wavesurfer.registerPlugin(wavesurferPlugins["markers"])
            showSpectrogram && wavesurferPlugins["spectrogram"] && wavesurfer.registerPlugin(wavesurferPlugins["spectrogram"])
            wavesurferPlugins["timeline"] && wavesurfer.registerPlugin(wavesurferPlugins["timeline"])
            // Zoom action activity has an effect on the rendering of the spectrogram. Using this effect to update (re-render) the spectrogram
            wavesurfer.zoom(Number(zoom))
        }

    }, [wavesurferPlugins]);

    useEffect(() => {
        if (!wavesurfer) return
        const handleClick = (timestamp: number, foo: number) => {
            const markerPosition = timestamp * 10 + foo * 10

            if (!action || !wavesurferPlugins) return
            if (action === ACTIONS_ENUM.ADD_MARKER && wavesurferPlugins["markers"]) {
                const regions = wavesurferPlugins["markers"] as RegionsPlugin
                regions.addRegion({
                    start: markerPosition,
                    content: 'Marker',
                    drag: false,
                    resize: false,
                    color: 'rgba(0, 0, 0, 0.1)'
                })
            }
        }

        wavesurfer.on('click', handleClick)

        return () => {
            wavesurfer.un('click', handleClick)
        }
    }, [action])

    const playerCursor = Boolean(action) ? "crosshair" : "pointer"

    return (
        <WavesurferWrapper variant="elevation">
            <WavesurferPlayer cursor={playerCursor} ref={containerRef}/>
            <WavesurferFooter>
                <WavesurferFooterContent>
                    <PlaybackControls
                        onSkip={(step) => wavesurfer?.skip(step)}
                        onPlayPause={() => wavesurfer?.playPause()}
                    />
                    <TimestampDisplay timestamp={currentTime}/>
                </WavesurferFooterContent>
                <WavesurferFooterContent>
                    <AddMarkerControl
                        isReady={isReady}
                        isDisabled={false}
                        value={Boolean(action)}
                        onChange={() => {
                            setAction(prevState => !prevState
                                ? ACTIONS_ENUM.ADD_MARKER
                                : null
                            )
                        }}
                    />
                    <SpectrogramControl
                        isReady={true}
                        isDisabled={false}
                        value={showSpectrogram}
                        onChange={() => setShowSpectrogram(prevState => !prevState)}
                    />
                    <ZoomControl
                        isReady={readyTimeline}
                        isDisabled={false}
                        value={zoom}
                        onChange={(value: number) => {
                            wavesurfer?.zoom(Number(value))
                            setZoom(Number(value))
                        }}
                        max={DEFAULT_ZOOM_MAX}
                        min={DEFAULT_ZOOM_MIN}
                    />
                </WavesurferFooterContent>
            </WavesurferFooter>
            <Box display="flex" padding={5} alignItems="center" overflow="auto">
                <pre>{
                    JSON.stringify({
                        action,
                        state: {
                            isPlaying,
                            showSpectrogram,
                            currentTime,
                            zoom
                        },
                        pluginsReadiness: {
                            readySpectrogram,
                            readyTimeline
                        },
                        wavesurferPlugins: wavesurferPlugins && Object
                            .keys(wavesurferPlugins)
                            .filter(plugin => wavesurferPlugins[plugin] !== null)
                    }, null, 2)
                }</pre>
            </Box>
        </WavesurferWrapper>
    );
}
