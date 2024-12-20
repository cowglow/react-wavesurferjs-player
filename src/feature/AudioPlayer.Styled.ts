import {Box, Paper, styled} from "@mui/material";
import {Property} from "csstype";

export const WavesurferWrapper = styled(Paper)`
    max-width: 800px;
    margin: ${({theme}) => theme.spacing(1)} auto;
    border: thin solid ${({theme}) => theme.palette.common.black};
    display: flex;
    flex-direction: column;
    gap: ${({theme}) => theme.spacing(1)};
`
export const WavesurferPlayer = styled(Box)<{ cursor: Property.Cursor }>`
    border: thin solid black;
    cursor: ${({cursor}) => cursor};
`
export const WavesurferFooter = styled(Box)`
    display: flex;
    justify-content: space-between;
    gap: ${({theme}) => theme.spacing(1)};
    padding: ${({theme}) => theme.spacing(1)};
`
export const WavesurferFooterContent = styled(Box)`
    display: flex;
    gap: ${({theme}) => theme.spacing(1)};
`