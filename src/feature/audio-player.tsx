import {Box, Button, styled} from "@mui/material";
import {WaveSurferOptions} from "wavesurfer.js";
import WavesurferPlayer from "@wavesurfer/react";

const WavesurferWrapper = styled(Box)`
    border: thin solid red;
    display: flex;
    flex-direction: column;
    gap: ${({theme}) => theme.spacing(1)};
`
const AUDIO_FILE_PATH =`${import.meta.env.BASE_URL}/audio.wav`
export default function AudioPlayer() {
    const playerOptions: Partial<WaveSurferOptions> = {
        waveColor: 'rgb(200, 0, 200)',
        progressColor: 'rgb(100, 0, 100)',
        height: 100,
        url: AUDIO_FILE_PATH,
    }

    return (
        <WavesurferWrapper>
            <WavesurferPlayer {...playerOptions} />
            <Box display="flex" gap={1}>
                <Button variant="contained">Player</Button>
                <Button variant="contained">Control</Button>
                <Button variant="contained">Buttons</Button>
            </Box>
        </WavesurferWrapper>
    );
}
