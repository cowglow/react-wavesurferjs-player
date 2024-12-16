import {Box, CircularProgress, Menu, Slider, styled, ToggleButton} from "@mui/material";
import ZoomIcon from "@mui/icons-material/ZoomInRounded";
import {useState} from "react";

const SliderWrapper = styled(Box)`
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    width: 102px;
    height: 345px;
    padding-top: ${({theme}) => theme.spacing(4)};
    padding-bottom: ${({theme}) => theme.spacing(3)};
    padding-right: ${({theme}) => theme.spacing(2)};
    padding-left: ${({theme}) => theme.spacing(1)};
`;

interface ZoomControlProps {
    isReady: boolean
    max: number
    min: number
    onChange: (value: number) => void
    value: number
}

export function ZoomControl({
                                isReady,
                                max = 100,
                                min = 1,
                                onChange,
                                value
                            }: ZoomControlProps) {
    const [zoomValue, setZoomValue] = useState(value)
    const [zoomMenuEl, setZoomMenuEl] = useState<HTMLElement | null>(null)

    return (
        <Box sx={{maxWidth: 48, maxHeight: 48}}>
            {!isReady
                ? <CircularProgress/>
                : <ToggleButton
                    value="showZoom"
                    onClick={(event) => {
                        isReady && setZoomMenuEl(event.currentTarget)
                    }}
                >
                    <ZoomIcon/>
                </ToggleButton>
            }
            <Menu
                anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                transformOrigin={{vertical: "top", horizontal: "right"}}
                anchorEl={zoomMenuEl}
                open={Boolean(zoomMenuEl)}
                onClose={() => setZoomMenuEl(null)}
            >
                <SliderWrapper>
                    <Slider
                        valueLabelDisplay="auto"
                        orientation="vertical"
                        shiftStep={50}
                        step={10}
                        value={zoomValue}
                        marks
                        min={min}
                        max={max}
                        onChange={(_, value) => setZoomValue(Number(value))}
                        onChangeCommitted={(_, value) => onChange(Number(value))}
                    />
                </SliderWrapper>
            </Menu>
        </Box>
    )
}
