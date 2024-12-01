import {createRoot} from 'react-dom/client'
import {StrictMode} from 'react'
import {CssBaseline} from "@mui/material";
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <CssBaseline/>
        <App/>
    </StrictMode>,
)
