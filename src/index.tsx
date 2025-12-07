import React from 'react'
import App from './App.tsx'
import {createRoot} from "react-dom/client"

/**
 * Grabs root from index html file to insert in the rest of the code
 */
const root = createRoot(
    document.getElementById("root") as HTMLElement
)
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)