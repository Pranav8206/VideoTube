import React from "react";
import { X } from "lucide-react";

const ConfirmModal = ({ message, onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-300/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl max-w-sm w-full shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Confirm Action</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
              aria-label="Close confirmation modal"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
          <p className="text-gray-700 text-center mb-6">{message}</p>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 cursor-pointer"
              aria-label="Cancel action"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/70 cursor-pointer"
              aria-label="Confirm action"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;