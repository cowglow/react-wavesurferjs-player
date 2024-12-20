import {Typography} from "@mui/material";

const formatOptions: Intl.DateTimeFormatOptions = {
    hour12: false,
    minute: '2-digit',
    second: '2-digit',
}

export default function TimestampDisplay({timestamp}: { timestamp: number }) {
    const date = new Date(timestamp * 1000)
    const hours = (date.getHours() - 1).toString().padStart(2, '0')
    const formattedTimestamp = date.toLocaleTimeString("en-US", formatOptions)
    const milliseconds = new Date(timestamp * 1000).getMilliseconds().toString().padStart(3, '0')
    return (
        <Typography variant="h3">
            {`${hours}:${formattedTimestamp}:${milliseconds}`}
        </Typography>
    )
}
