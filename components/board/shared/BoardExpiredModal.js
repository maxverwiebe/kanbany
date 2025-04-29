import React from "react";
import { MdHourglassEmpty } from "react-icons/md";

export default function BoardExpiredModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="relative bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <MdHourglassEmpty size={28} />
            <h2 className="text-2xl font-semibold">Board Expired</h2>
          </div>

          <p className="text-neutral-700 dark:text-neutral-300">
            This shared board has expired and is no longer available. Please
            contact the board owner to create a new one or try again later.
          </p>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
