import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { MdViewKanban, MdLock, MdClose } from "react-icons/md";

export function addVisitedSharedBoard(id, name) {
  const key = "kanbanyVisitedBoards";
  const now = Date.now();
  const stored = JSON.parse(localStorage.getItem(key) || "[]");
  const idx = stored.findIndex((b) => b.id === id);
  if (idx !== -1) {
    stored[idx] = { id, name, lastVisited: now };
  } else {
    stored.push({ id, name, lastVisited: now });
  }
  stored.sort((a, b) => b.lastVisited - a.lastVisited);
  localStorage.setItem(key, JSON.stringify(stored));
  return stored;
}

function formatRelativeTime(ts) {
  const d = Date.now() - ts;
  const s = Math.floor(d / 1e3);
  if (s < 60) return "Just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

export default function BoardListMenu({ isOpen, onClose }) {
  const [localBoard, setLocalBoard] = useState(null);
  const [visitedBoards, setVisitedBoards] = useState([]);
  const menuRef = useRef(null);
  const LS_KEY = "kanbanyVisitedBoards";
  const router = useRouter();

  /* ---------- Laden, wenn Menü aufgeht ---------- */
  useEffect(() => {
    if (!isOpen) return;
    setLocalBoard(
      JSON.parse(localStorage.getItem("kanbanyLocalBoard") || "null") ?? {
        id: "local",
        name: "Local Board",
      }
    );
    const visited = JSON.parse(localStorage.getItem(LS_KEY) || "[]").sort(
      (a, b) => b.lastVisited - a.lastVisited
    );
    setVisitedBoards(visited);
  }, [isOpen]);

  /* ---------- Click‑Outside schließt ---------- */
  useEffect(() => {
    if (!isOpen) return;
    const click = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose?.();
    };
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, [isOpen, onClose]);

  /* ---------- Eintrag aus History löschen ---------- */
  function handleDelete(id) {
    const filtered = visitedBoards.filter((b) => b.id !== id);
    setVisitedBoards(filtered);
    localStorage.setItem(LS_KEY, JSON.stringify(filtered));
  }

  function onSelectBoard(boardID) {
    if (boardID === "local") {
      router.push("/");
    } else {
      router.push(`/shared/${boardID}`);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute top-full left-0 mt-2 w-full sm:w-80 md:w-96 bg-white dark:bg-neutral-800 shadow-md rounded-lg p-4 space-y-6 z-50 border border-neutral-200 dark:border-neutral-900"
    >
      {/* ---------- Local Board ---------- */}
      <div>
        <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase mb-2">
          Local Board
        </h3>
        <button
          onClick={() => onSelectBoard?.("local")}
          className="flex items-center w-full px-3 py-2 rounded-md hover:bg-violet-100 dark:hover:bg-neutral-700 transition"
        >
          <MdLock className="mr-2 text-violet-600 dark:text-violet-400" />
          <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
            {localBoard?.name}
          </span>
        </button>
      </div>

      {/* ---------- Shared Boards ---------- */}
      <div>
        <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase mb-2">
          Shared Boards
        </h3>

        {visitedBoards.length === 0 && (
          <p className="text-xs italic text-neutral-400">
            No shared boards yet
          </p>
        )}

        <ul className="space-y-1 max-h-60 overflow-y-auto pr-1">
          {visitedBoards.map((b) => (
            <li key={b.id} className="group flex items-center">
              {/* Auswahl‑Button */}
              <button
                onClick={() => onSelectBoard?.(b.id)}
                className="flex flex-1 items-center px-3 py-2 rounded-md hover:bg-violet-100 dark:hover:bg-neutral-700 transition"
              >
                <MdViewKanban className="mr-2 text-violet-600 dark:text-violet-400" />
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
                    {b.name}
                  </span>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                    Last visited {formatRelativeTime(b.lastVisited)}
                  </span>
                </div>
              </button>

              {/* Delete‑Icon */}
              <button
                onClick={() => handleDelete(b.id)}
                title="Remove from history"
                className="ml-2 p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-400 hover:text-rose-600 transition opacity-0 group-hover:opacity-100"
              >
                <MdClose size={14} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
