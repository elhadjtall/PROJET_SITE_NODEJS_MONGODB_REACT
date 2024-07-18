import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home/Home";
import Instructors from "../pages/Instructors/Instructors";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/instructors",
                element: <Instructors />, // Utilisation du composant Instructors
            },
            {
                path: "/classes",
                element: <div>Classes</div>,
            },
        ],
    },
]);
