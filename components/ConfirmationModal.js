import { useEffect, useRef } from "react";
import { MdWarning } from "react-icons/md";

const ConfirmationModal = ({
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Yes",
  cancelText = "No",
  onConfirm,
  onCancel,
}) => {
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (cancelButtonRef.current) {
      cancelButtonRef.current.focus();
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm flex flex-col overflow-hidden dark:bg-neutral-800">
        <h2 className="text-xl font-semibold mb-4 dark:text-neutral-200">
          {title}
        </h2>
        <p className="text-neutral-700 mb-6 dark:text-neutral-200">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            ref={cancelButtonRef}
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-neutral-800 rounded-md text-sm hover:bg-gray-400 transition dark:bg-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-500"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-violet-500 text-white rounded-md text-sm hover:bg-violet-600 transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
