import {Box, Button, Paper, styled} from "@mui/material";
import AudioPlayer from "./feature/AudioPlayer.tsx";

const Root = styled(Paper)`
    display: flex;
    flex-direction: column;
    height: 100svh;
`

export default function App() {

    return (
        <Root>
            {/*
            <Box component="header">
                <h1>Header</h1>
            </Box>
            */}
            <Box component="main" flex={1}>
                <AudioPlayer/>
            </Box>
            <Box component="footer" p={2} alignSelf="flex-end">
                <Button
                    href="https://github.com/cowglow/react-wavesurferjs-player"
                    variant="contained"
                    target="_blank"
                    color="secondary"
                >
                    <img src={`${import.meta.env.BASE_URL}/github-mark.svg`} alt="GitHub Logo" width={18}/>
                    &nbsp;
                    GitHub Repo
                </Button>
            </Box>
        </Root>
    );
}
