import React from "react";
import { MdShare } from "react-icons/md";

export default function BoardHeader({ showDropdown, handlers }) {
  return (
    <div className="mb-4 w-full">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 shadow-md rounded-md dark:bg-neutral-800">
        <h1 className="text-xl font-bold text-gray-800 dark:text-neutral-200">
          KANBANY
        </h1>

        <div className="flex items-center space-x-2">
          {handlers.showCreateSharedModal && (
            <button
              onClick={handlers.showCreateSharedModal}
              className="flex items-center px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-md shadow-sm transition duration-200"
            >
              <MdShare className="h-4 w-4 mr-1.5" />
              Share
            </button>
          )}

          {handlers.copyBoardURL && (
            <button
              onClick={handlers.copyBoardURL}
              className="flex items-center px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-md shadow-sm transition duration-200"
            >
              <MdShare className="h-4 w-4 mr-1.5" />
              Copy Link
            </button>
          )}

          <button
            className="flex items-center justify-center w-10 h-10 text-violet-500 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900 rounded-full transition"
            onClick={handlers.toggleDropdown}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
