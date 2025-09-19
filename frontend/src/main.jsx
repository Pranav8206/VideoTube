import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes.jsx";
import "./App.css";
import Loader from "./components/Loader.jsx";

// Create router from routes
const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Suspense is required for lazy-loaded components */}
    <Suspense fallback={<Loader/>}>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>
);
