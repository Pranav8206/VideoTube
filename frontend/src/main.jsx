import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Playing from "./pages/Playing.jsx";
import Setting from "./pages/Setting.jsx";
import Subscription from "./pages/Subscription.jsx";
import Channel from "./pages/Channel.jsx";
import NotFound from "./components/NotFound.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/play/:video", element: <Playing /> },
      { path: "/settings", element: <Setting /> },
      { path: "/c/:channelId", element: <Channel /> },
      { path: "/subscription", element: <Subscription /> },
      { path: "*", element: <NotFound/>}
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
