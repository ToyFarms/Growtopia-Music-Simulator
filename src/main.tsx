import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";

import "./index.css";
import { HomePage } from "./pages/Home";
import { MusicSimulatorPage } from "./pages/MusicSimulator";
import { ImageConverterPage } from "./pages/ImageConverter";
import { NotFoundPage } from "./pages/not-found.tsx";

const router = createBrowserRouter(
  [
    { path: "*", element: <NotFoundPage title="Error" /> },
    { path: "/", element: <HomePage title="Home" /> },
    { path: "/music", element: <MusicSimulatorPage title="Music Simulator" /> },
    {
      path: "/image-converter",
      element: <ImageConverterPage title="Image Converter" />,
    },
  ],
  { basename: "/Growtopia-Tools" },
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
