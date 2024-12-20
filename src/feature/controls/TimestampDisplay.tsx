import {Typography} from "@mui/material";

export default function TimestampDisplay({timestamp}: { timestamp: number }) {
    const date = new Date(timestamp - 60 * 60 * 1000)
    const formattedTimestamp = date.toLocaleTimeString("en-US", {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    })
    return (
        <Typography variant="h3">
            {`${formattedTimestamp}:${date.getMilliseconds().toString().padStart(3, '0')}`}
        </Typography>
    )
}
