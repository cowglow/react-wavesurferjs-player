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
    defaultValue: number
    isReady: boolean
    max: number
    min: number
    onChange: (value: number) => void
    value: number
}

export function ZoomControl({
                                defaultValue,
                                isReady,
                                max = 100,
                                min = 1,
                                onChange,
                                value
                            }: ZoomControlProps) {
    const [zoomMenuEl, setZoomMenuEl] = useState<HTMLElement | null>(null)

    if (!isReady) return <CircularProgress/>

    return (
        <Box>
            <ToggleButton
                value="showZoom"
                onClick={(event) => {
                    setZoomMenuEl(event.currentTarget)
                }}
            >
                <ZoomIcon/>
            </ToggleButton>
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
                        defaultValue={defaultValue}
                        shiftStep={50}
                        step={10}
                        value={value}
                        marks
                        min={min}
                        max={max}
                        onChange={(_, value) => onChange(Number(value))}
                    />
                </SliderWrapper>
            </Menu>
        </Box>
    )
}
