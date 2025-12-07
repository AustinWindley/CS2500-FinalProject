import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom"
import Home from "./Home.tsx"
import BookSearch from "./BookSearch.tsx"
import BookPage from "./BookPage.tsx"
import Signup from "./Signup.tsx"
import Profile from "./Profile.tsx"
import Login from "./Login.tsx"


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
            {path: "home", element: <Home />},
            {path: "books", element: <BookSearch />},
            {path: "books/:ISBN", element: <BookPage />},
            {path: "signup", element: <Signup />},
            {path: "login", element: <Login />},
            {path: "profile", element: <Profile />}

        ]
        
    }])
    return (
        <RouterProvider router={router} />
    )
}

export default App