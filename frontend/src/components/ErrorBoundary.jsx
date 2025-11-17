import React from "react";
import { useRouteError, useNavigate } from "react-router-dom";

const ErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error("Route error:", error);

  return (
    <div className="min-h-screen flex items-center justify-center sm:bg-light sm:p-4">
      <div className="bg-white rounded-lg sm:shadow-lg p-8 max-w-lg w-full sm:border sm:border-borderColor">
        <div className="w-full flex items-center justify-center  ">
          <span className="text-4xl">🥺</span>
        </div>

        <h2 className="text-2xl font-bold text-center text-dark mb-2">
          {error.status === 404 ? "Page Not Found" : "Something went wrong"}
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          {error.status === 404
            ? "The page you're looking for doesn't exist."
            : error.statusText ||
              error.message ||
              "An unexpected error occurred."}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-primary hover:bg-primary-dull text-white py-2.5 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            Refresh Page
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full bg-gray-200 hover:bg-gray-300 text-dark py-2.5 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            Go back
          </button>
        </div>

        {/* Error Details (Dev Mode) */}
        {error.stack && (
          <details className="mt-6 text-sm">
            <summary className="cursor-pointer text-gray-600 hover:text-dark select-none font-medium">
              Error Details (Dev Mode)
            </summary>
            <pre className="mt-3 p-3 bg-light rounded border border-borderColor text-xs overflow-auto text-red-600 whitespace-pre-wrap break-words max-h-60">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default ErrorBoundary;
