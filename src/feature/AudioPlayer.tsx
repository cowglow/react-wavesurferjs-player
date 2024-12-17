import {Box, Paper, styled, Typography} from "@mui/material";
import WaveSurfer from "wavesurfer.js";
import WavesurferPlayer from "@wavesurfer/react";
import {useEffect, useState} from "react";
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
    const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null)
    const [wavesurferPlugins, setWavesurferPlugins] = useState<Record<string, GenericPlugin | null>>({
        timeline: null,
        spectrogram: null
    })

    // State reflects current state of the player
    const [isPlaying, setIsPlaying] = useState(false) // onPlay & onPause
    const [showSpectrogram, setShowSpectrogram] = useState(false) // Has Spectrogram Plugin
    const [timestamp, setTimestamp] = useState(0) // onTimeupdate
    const [zoom, setZoom] = useState(DEFAULT_ZOOM_MAX); // onZoom

    // Ready States
    const [readySpectrogram, setReadySpectrogram] = useState(false)
    const [readyTimeline, setReadyTimeline] = useState(false)
    // Show States


    const createInstance = (ws: WaveSurfer) => {
        console.log("Create Instance!")
        if (!wavesurfer) setWavesurfer(ws)
        setWavesurferPlugins({
            timeline: createTimelinePluginInstance({ws, onReady: setReadyTimeline}),
            spectrogram: null
        })
    }

    useEffect(() => {
        if (!wavesurfer) return
        setWavesurferPlugins(prevState => ({
            ...prevState,
            spectrogram: showSpectrogram
                ? createSpectrogramPluginInstance({
                    ws: wavesurfer,
                    onReady: (ready) => {
                        console.log('foo')
                        console.log({
                            ready,
                            wavesurferPlugins,
                            showSpectrogram
                        })
                        setReadySpectrogram(ready)
                    }
                }) : null
        }))
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
            wavesurferPlugins["timeline"] && wavesurfer.registerPlugin(wavesurferPlugins["timeline"])
            showSpectrogram && wavesurferPlugins["spectrogram"] && wavesurfer.registerPlugin(wavesurferPlugins["spectrogram"])
        }
    }, [wavesurferPlugins]);

    return (
        <WavesurferWrapper variant="elevation">
            <WavesurferPlayer
                {...audioPlayerOptions}
                onReady={createInstance}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onZoom={(_, zoom) => setZoom(zoom)}
                onTimeupdate={(_, currentTime) => setTimestamp(currentTime)}
            />
            <WavesurferFooter>
                <Box display="flex" gap={1}>
                    <PlaybackControls
                        onSkip={(step) => wavesurfer?.skip(step)}
                        onPlayPause={() => wavesurfer?.playPause()}
                    />
                    <Typography
                        variant="h3">{wavesurfer ? new Date(timestamp * 1000).toLocaleTimeString() : "..."}</Typography>
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
                            timestamp,
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
