import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes.jsx";
import "./App.css";
import Loader from "./components/Loader.jsx";
import ContextProvider from "./context/context.jsx";
import { Toaster } from "react-hot-toast";

// Create router from routes
const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ContextProvider>
      {/* Suspense is required for lazy-loaded components */}
      <Suspense fallback={<Loader />}>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster position="top-right" reverseOrder={false} />
    </ContextProvider>
  </StrictMode>
);
