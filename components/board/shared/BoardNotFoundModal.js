import React from "react";
import { MdErrorOutline } from "react-icons/md";
import { useRouter } from "next/router";

export default function BoardNotFoundModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const router = useRouter();

  const returnStartPage = () => {
    window.location.href = "/";

    router.push("/");
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-lg"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="relative bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <MdErrorOutline size={28} />
            <h2 className="text-2xl font-semibold">Board Not Found</h2>
          </div>

          <p className="text-neutral-700 dark:text-neutral-300">
            This board does not exist or has been deleted. Please check the URL.
          </p>

          <div className="flex justify-end">
            <button
              onClick={returnStartPage}
              className="px-4 py-2 bg-neutral-600 text-white rounded-md hover:bg-neutral-700 transition mr-2"
            >
              Go to Start Page
            </button>
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
