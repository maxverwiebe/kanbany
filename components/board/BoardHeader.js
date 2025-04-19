import React from "react";

export default function BoardHeader({ showDropdown, handlers }) {
  return (
    <div className="relative inline-block mb-4 md:max-w-50 w-full">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 shadow-md rounded-md dark:bg-neutral-800">
        <h1 className="text-xl font-bold text-gray-800 dark:text-neutral-200">
          KANBANY
        </h1>
        <button
          className="flex items-center justify-center w-10 h-10 text-violet-500 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900 rounded-full transition ml-4"
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
  );
}
