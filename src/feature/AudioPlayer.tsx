import {Box, Paper, styled, Typography} from "@mui/material";
import {useWavesurfer} from "@wavesurfer/react";
import {useEffect, useRef, useState} from "react";
import {DEFAULT_ZOOM_MAX, DEFAULT_ZOOM_MIN} from "./plugins/constants.ts";
import createSpectrogramPluginInstance from "./plugins/create-spectrogram-plugin-instance.ts";
import createTimelinePluginInstance from "./plugins/create-timeline-plugin-instance.ts";
import {GenericPlugin} from "wavesurfer.js/dist/base-plugin";
import {audioPlayerOptions} from "./plugins/audio-player-options.ts";
import {PlaybackControls, ZoomControl} from "./controls";
import SpectrogramControl from "./controls/SpectrogramControl.tsx";

const WavesurferWrapper = styled(Paper)`
    max-width: 800px;
    margin: ${({theme}) => theme.spacing(1)} auto;
    border: thin solid ${({theme}) => theme.palette.common.black};
    display: flex;
    flex-direction: column;
    gap: ${({theme}) => theme.spacing(1)};
`
const WavesurferFooter = styled(Box)`
    display: flex;
    justify-content: space-between;
    gap: ${({theme}) => theme.spacing(1)};
    padding: ${({theme}) => theme.spacing(1)};
`

export default function AudioPlayer() {
    const containerRef = useRef(null)
    const {wavesurfer, currentTime, isPlaying, isReady} = useWavesurfer({
        // @ts-ignore
        container: containerRef,
        ...audioPlayerOptions
    })
    const [wavesurferPlugins, setWavesurferPlugins] = useState<Record<string, GenericPlugin | null>>({
        timeline: null,
        spectrogram: null
    })

    // State reflects current state of the player
    // const [isPlaying, setIsPlaying] = useState(false) // onPlay & onPause
    const [showSpectrogram, setShowSpectrogram] = useState(false) // Has Spectrogram Plugin
    // const [timestamp, setTimestamp] = useState(0) // onTimeupdate
    const [zoom, setZoom] = useState(DEFAULT_ZOOM_MAX); // onZoom

    // Ready States
    const [readySpectrogram, setReadySpectrogram] = useState(false)
    const [readyTimeline, setReadyTimeline] = useState(false)


    // const createInstance = (ws: WaveSurfer) => {
    //     console.log("Create Instance!")
    //     if (!wavesurfer) setWavesurfer(ws)
    //     setWavesurferPlugins({
    //         timeline: createTimelinePluginInstance({ws, onReady: setReadyTimeline}),
    //         spectrogram: null
    //     })
    // }

    useEffect(() => {
        // Initial setup
        if (!wavesurfer) return
        if (isReady) {
            setWavesurferPlugins({
                timeline: createTimelinePluginInstance({ws: wavesurfer, onReady: setReadyTimeline}),
                spectrogram: null
            })
        }
    }, [isReady]);

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
        if (wavesurfer) {
            // Remove the Active Plugins
            const currentPlugins = wavesurfer.getActivePlugins()
            currentPlugins.forEach(plugin =>
                // @ts-ignore
                plugin?.options && plugin.destroy()
            )
            // Register the Active Plugins
            showSpectrogram && wavesurferPlugins["spectrogram"] && wavesurfer.registerPlugin(wavesurferPlugins["spectrogram"])
            wavesurferPlugins["timeline"] && wavesurfer.registerPlugin(wavesurferPlugins["timeline"])
            // Zoom action activity has an effect on the rendering of the spectrogram
            // Using this effect to update (re-render) the spectrogram
            wavesurfer.zoom(Number(zoom))
        }
    }, [wavesurferPlugins]);

    return (
        <WavesurferWrapper variant="elevation">
            {/*<WavesurferPlayer*/}
            {/*    {...audioPlayerOptions}*/}
            {/*    onReady={createInstance}*/}
            {/*    onPlay={() => setIsPlaying(true)}*/}
            {/*    onPause={() => setIsPlaying(false)}*/}
            {/*    onZoom={(_, zoom) => setZoom(zoom)}*/}
            {/*    onTimeupdate={(_, currentTime) => setTimestamp(currentTime)}*/}
            {/*/>*/}
            <Box ref={containerRef}/>
            <WavesurferFooter>
                <Box display="flex" gap={1}>
                    <PlaybackControls
                        onSkip={(step) => wavesurfer?.skip(step)}
                        onPlayPause={() => wavesurfer?.playPause()}
                    />
                    <Typography
                        variant="h3">{wavesurfer ? new Date(currentTime * 1000).toLocaleTimeString() : "..."}</Typography>
                </Box>
                <Box display="flex" gap={1}>
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
                </Box>
            </WavesurferFooter>
            <Box display="flex" padding={5} alignItems="center" overflow="auto">
                <pre>{
                    JSON.stringify({
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
                        wavesurferPlugins: Object
                            .keys(wavesurferPlugins)
                            .filter(plugin => wavesurferPlugins[plugin] !== null)
                    }, null, 2)
                }</pre>
            </Box>
        </WavesurferWrapper>
    );
}
