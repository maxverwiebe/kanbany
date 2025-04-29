import { useState, useEffect, useRef } from "react";
import { MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";

const PasswordModal = ({ isOpen, onConfirm, onCancel }) => {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full mx-auto p-6 flex flex-col space-y-6">
        <div className="flex items-center space-x-2 text-violet-600 dark:text-violet-400">
          <MdLock size={24} />
          <h2 className="text-xl font-semibold">Board Locked</h2>
        </div>
        <p className="text-neutral-600 dark:text-neutral-300">
          This Kanban board is password-protected. Please enter your password to
          continue.
        </p>
        <div className="relative">
          <input
            ref={inputRef}
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="peer w-full bg-transparent border-b-2 border-neutral-300 dark:border-neutral-600 placeholder-transparent py-2 focus:outline-none focus:border-violet-500 transition"
            placeholder="Password"
          />
          <label
            className="absolute left-0 -top-2.5 text-sm text-neutral-500 dark:text-neutral-400 
                      peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 
                      peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-violet-500 
                      transition-all pointer-events-none"
          >
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-neutral-500 dark:text-neutral-400 hover:text-violet-500 transition"
          >
            {showPw ? (
              <MdVisibilityOff size={20} />
            ) : (
              <MdVisibility size={20} />
            )}
          </button>
        </div>
        <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded overflow-hidden">
          <div
            className={`h-full ${
              password.length > 8
                ? "bg-green-400"
                : password.length > 4
                ? "bg-yellow-400"
                : "bg-red-400"
            } transition-all duration-300`}
            style={{ width: `${Math.min(password.length * 10, 100)}%` }}
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-neutral-200 dark:bg-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-500 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(password)}
            disabled={!password}
            className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Unlock
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
