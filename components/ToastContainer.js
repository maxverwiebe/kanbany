import React, { useState, useEffect } from "react";
import { toastEmitter } from "@/lib/Toast";
import { IoMdNotifications } from "react-icons/io";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function ToastIcon({ toastType }) {
  if (toastType === "info") {
    return <IoMdNotifications className="text-violet-500 mr-2 text-md" />;
  }

  if (toastType === "success") {
    return <FaCheckCircle className="text-green-600 mr-2 text-md" />;
  }

  if (toastType === "error") {
    return <FaTimesCircle className="text-red-700 mr-2 text-md" />;
  }

  return <IoMdNotifications className="text-violet-500 mr-2 text-md" />;
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleAddToast = (event) => {
      const newToast = event.detail;
      setToasts((prevToasts) => [...prevToasts, newToast]);

      setTimeout(() => {
        setToasts((prevToasts) =>
          prevToasts.filter((toast) => toast.id !== newToast.id)
        );
      }, newToast.duration);
    };

    toastEmitter.addEventListener("addToast", handleAddToast);
    return () => {
      toastEmitter.removeEventListener("addToast", handleAddToast);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center px-4 py-2 rounded shadow-md text-neutral-700 bg-gray-100 dark:bg-neutral-700 dark:text-neutral-200 transition duration-700"
        >
          <ToastIcon toastType={toast.type} />
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
