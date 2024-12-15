import {Box, Paper, styled} from "@mui/material";
import AudioPlayer from "./feature/AudioPlayer.tsx";

const Root = styled(Paper)`
  display: flex;
  flex-direction: column;
  height: 100svh;
`

export default function App() {

    return (
        <Root>
            <Box component="header">
                <h1>Header</h1>
            </Box>
            <Box component="main" flex={1}>
                <AudioPlayer/>
            </Box>
            <Box component="footer">
                <h1>Footer</h1>
            </Box>
        </Root>
    );
}
