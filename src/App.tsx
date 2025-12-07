import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom"
import Home from "./Home.tsx"


/**
 * Routes to each page in website
 * 
 * @returns app router to be used in index.tsx
 */
function App() {
    const router = createBrowserRouter([{
        path: '/',
        children: [
            {index: true, element: <Navigate to={"home"} />},
            {path: "home", element: <Home />}

        ]
        
    }])
    return (
        <RouterProvider router={router} />
    )
}

export default App