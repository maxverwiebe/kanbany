import React, { useState, useEffect, useRef } from "react";
import {
  MdViewKanban,
  MdCalendarToday,
  MdRefresh,
  MdFileUpload,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

export default function CreateSharedModal({ isOpen, onCreate, onCancel }) {
  const [name, setName] = useState("");
  const [boardPassword, setBoardPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [expiration, setExpiration] = useState("60"); // default 60 days
  const [importLocal, setImportLocal] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreate = () => {
    onCreate({ name, password: boardPassword, expiration, importLocal });
  };

  const expirationText =
    expiration === "30"
      ? "This board will expire after 30 days."
      : expiration === "60"
      ? "This board will expire after 60 days."
      : "This board will never expire.";

  const sourceText = importLocal
    ? "Your current local board will be imported into the shared space."
    : "A new, empty board will be created for sharing.";

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="relative bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-lg w-full p-6 space-y-6">
          <div className="flex items-center space-x-2 text-violet-600 dark:text-violet-400">
            <MdViewKanban size={24} />
            <h2 className="text-xl font-semibold">Create Shared Board</h2>
          </div>

          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="peer w-full bg-transparent border-b-2 border-neutral-300 dark:text-neutral-300 dark:border-neutral-600 placeholder-transparent py-2 focus:outline-none focus:border-violet-500 transition"
              placeholder="Board Name"
            />
            <label
              className="absolute left-0 -top-2.5 text-sm text-neutral-500 dark:text-neutral-400
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400
                peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-violet-500
                transition-all pointer-events-none"
            >
              Board Name
            </label>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={boardPassword}
              onChange={(e) => setBoardPassword(e.target.value)}
              className="peer w-full bg-transparent border-b-2 border-neutral-300 dark:text-neutral-300 dark:border-neutral-600 placeholder-transparent py-2 focus:outline-none focus:border-violet-500 transition"
              placeholder="Password"
            />
            <label
              className="absolute left-0 -top-2.5 text-sm text-neutral-500 dark:text-neutral-400
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400
                peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-violet-500
                transition-all pointer-events-none"
            >
              Board Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-neutral-500 dark:text-neutral-400 hover:text-violet-500 transition"
            >
              {showPassword ? (
                <MdVisibilityOff size={20} />
              ) : (
                <MdVisibility size={20} />
              )}
            </button>
            <p className="text-xs italic text-neutral-500 dark:text-neutral-400 mt-1">
              Others will need this password to access the board.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Expiration
            </p>
            <div className="flex items-center space-x-3">
              {[
                { label: "30 days", value: "30", enabled: false },
                { label: "60 days", value: "60", enabled: true },
                { label: "Permanent", value: "permanent", enabled: false },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => opt.enabled && setExpiration(opt.value)}
                  disabled={!opt.enabled}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full border
                    ${
                      expiration === opt.value
                        ? "bg-violet-600 text-white border-transparent"
                        : "bg-transparent text-neutral-600 dark:text-neutral-300 border-neutral-300 dark:border-neutral-600"
                    }
                    ${
                      opt.enabled
                        ? "hover:bg-violet-100 dark:hover:bg-neutral-700"
                        : "opacity-50 cursor-not-allowed"
                    }
                    transition`}
                >
                  <MdCalendarToday size={18} />
                  <span className="text-sm">{opt.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs italic text-neutral-500 dark:text-neutral-400 mt-1">
              {expirationText}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Source
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setImportLocal(false)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md border
                  ${
                    !importLocal
                      ? "bg-violet-600 text-white border-transparent"
                      : "bg-transparent text-neutral-600 dark:text-neutral-300 border-neutral-300 dark:border-neutral-600"
                  }
                  hover:bg-violet-100 dark:hover:bg-neutral-700 transition`}
              >
                <MdRefresh size={18} />
                <span className="text-sm">New Board</span>
              </button>
              <button
                onClick={() => setImportLocal(true)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md border
                  ${
                    importLocal
                      ? "bg-violet-600 text-white border-transparent"
                      : "bg-transparent text-neutral-600 dark:text-neutral-300 border-neutral-300 dark:border-neutral-600"
                  }
                  hover:bg-violet-100 dark:hover:bg-neutral-700 transition`}
              >
                <MdFileUpload size={18} />
                <span className="text-sm">Import Local</span>
              </button>
            </div>
            <p className="text-xs italic text-neutral-500 dark:text-neutral-400 mt-1">
              {sourceText}
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-neutral-200 dark:bg-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-500 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!name}
              className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
