import React from "react";
import { MdShare, MdContentCopy, MdLock } from "react-icons/md";
import { addToast } from "@/lib/Toast";

export default function BoardShareModal({ isOpen, onClose, url, password }) {
  if (!isOpen) return null;

  const copyUrl = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
    } else {
      const temp = document.createElement("textarea");
      temp.value = url;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
    }
    addToast("URL copied to clipboard", "success");
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="relative bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
          <div className="flex items-center space-x-2 text-violet-600 dark:text-violet-400">
            <MdShare size={24} />
            <h2 className="text-xl font-semibold">Share Board</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                URL
              </label>
              <div className="flex">
                <input
                  value={url}
                  readOnly
                  className="flex-1 rounded-l-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 focus:outline-none"
                />
                <button
                  onClick={copyUrl}
                  className="rounded-r-md px-3 py-2 bg-violet-600 hover:bg-violet-700 transition text-white"
                >
                  <MdContentCopy size={20} />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Password
              </label>
              <div className="flex items-center space-x-2 bg-neutral-100 dark:bg-neutral-700 px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700">
                <MdLock
                  size={18}
                  className="text-neutral-500 dark:text-neutral-400"
                />
                <span className="text-neutral-800 dark:text-neutral-100 truncate">
                  {password}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-neutral-600 text-neutral-800 dark:text-neutral-200 rounded-md text-sm hover:bg-gray-400 dark:hover:bg-neutral-500 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
