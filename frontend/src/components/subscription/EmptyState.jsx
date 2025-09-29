import { Bell } from "lucide-react";
import React from "react";

const EmptyState = ({ message, actionText, onAction }) => {
  return (
    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md mx-auto">
      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Bell className="w-8 h-8 text-purple-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        No videos found
      </h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-300"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
