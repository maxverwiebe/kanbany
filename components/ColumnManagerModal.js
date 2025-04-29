import { useState, useEffect, useRef, useCallback } from "react";
import { useBoard } from "@/lib/BoardContext";
import i18n from "@/lib/i18n";
import { addToast } from "@/lib/Toast";
import {
  MdFullscreen,
  MdFullscreenExit,
  MdAdd,
  MdDelete,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdDragHandle,
} from "react-icons/md";

import { BiColumns } from "react-icons/bi";

export default function ColumnManagerModal({ onClose }) {
  const { columns, setColumns, addColumn } = useBoard();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const draggedIndexRef = useRef(null);

  useEffect(() => {
    if (selectedId) {
      const col = columns.find((c) => c.id === selectedId);
      setEditTitle(col?.title || "");
    } else {
      setEditTitle("");
    }
  }, [selectedId, columns]);

  const handleSave = () => {
    if (!editTitle.trim()) return;
    if (selectedId) {
      setColumns((prev) =>
        prev.map((c) =>
          c.id === selectedId ? { ...c, title: editTitle.trim() } : c
        )
      );
      addToast(i18n.t("column.toastUpdated", { name: editTitle }), "success");
      setSelectedId(null);
    } else {
      addColumn(editTitle.trim());
      addToast(i18n.t("column.toastCreated", { name: editTitle }), "success");
      setEditTitle("");
    }
  };

  const handleDelete = () => {
    if (!selectedId) return;
    const col = columns.find((c) => c.id === selectedId);
    setColumns((prev) => prev.filter((c) => c.id !== selectedId));
    addToast(i18n.t("column.toastDeleted", { name: col.title }), "success");
    setSelectedId(null);
  };

  const toggleFullscreen = () => setIsFullscreen((f) => !f);

  const move = useCallback(
    (idx, dir) => {
      const next = idx + dir;
      if (next < 0 || next >= columns.length) return;
      const newCols = Array.from(columns);
      [newCols[idx], newCols[next]] = [newCols[next], newCols[idx]];
      setColumns(newCols);
    },
    [columns, setColumns]
  );

  const onDragStart = (idx) => {
    draggedIndexRef.current = idx;
  };
  const onDragOver = (e) => {
    e.preventDefault();
  };
  const onDrop = (dropIdx) => {
    const srcIdx = draggedIndexRef.current;
    if (srcIdx == null || srcIdx === dropIdx) return;
    const newCols = Array.from(columns);
    const [moved] = newCols.splice(srcIdx, 1);
    newCols.splice(dropIdx, 0, moved);
    setColumns(newCols);
    draggedIndexRef.current = null;
  };

  const modalWrapperClasses = isFullscreen
    ? "w-full h-full max-w-none max-h-none"
    : "w-full max-w-4xl h-[80vh]";

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
      <div
        className={`${modalWrapperClasses} bg-white dark:bg-neutral-800 rounded shadow-lg p-6 flex flex-col`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-violet-600 dark:text-violet-400">
            <BiColumns size={24} />
            <h2 className="text-xl font-semibold">Column Manager</h2>
          </div>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded hover:bg-violet-100 dark:hover:bg-violet-900 text-neutral-400 dark:text-neutral-500 font-thin text-2xl transition"
            title={isFullscreen ? "Shrink modal" : "Fullscreen modal"}
          >
            {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          <div className="md:w-1/3 border-r border-neutral-200 dark:border-neutral-700 pr-2 flex flex-col">
            <div className="overflow-y-auto max-h-40 md:max-h-full flex-1">
              <button
                onClick={() => setSelectedId(null)}
                className={`flex items-center w-full p-2 mb-2 rounded cursor-pointer transition text-violet-600 dark:text-violet-300 font-medium ${
                  selectedId === null
                    ? "bg-violet-100 dark:bg-violet-900"
                    : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
                }`}
              >
                <MdAdd className="mr-2" />
                {i18n.t("column.add")}
              </button>

              {columns.length > 0 ? (
                columns.map((col, idx) => (
                  <div
                    key={col.id}
                    draggable
                    onDragStart={() => onDragStart(idx)}
                    onDragOver={onDragOver}
                    onDrop={() => onDrop(idx)}
                    onClick={() => setSelectedId(col.id)}
                    className={`flex items-center justify-between p-2 mb-2 rounded cursor-pointer transition ${
                      selectedId === col.id
                        ? "bg-violet-100 dark:bg-violet-900"
                        : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    }`}
                  >
                    <div className="hidden md:flex items-center space-x-2">
                      <MdDragHandle className="text-neutral-400" />
                      <span className="text-sm text-neutral-800 dark:text-neutral-200 truncate">
                        {col.title}
                      </span>
                    </div>

                    <div className="flex md:hidden items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          move(idx, -1);
                        }}
                        className="p-1 hover:bg-violet-100 dark:hover:bg-violet-900 dark:text-neutral-200 rounded"
                      >
                        <MdKeyboardArrowUp />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          move(idx, 1);
                        }}
                        className="p-1 hover:bg-violet-100 dark:hover:bg-violet-900 dark:text-neutral-200 rounded"
                      >
                        <MdKeyboardArrowDown />
                      </button>
                      <span className="ml-2 text-sm text-neutral-800 dark:text-neutral-200 truncate">
                        {col.title}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-neutral-500 dark:text-neutral-600 text-sm mt-4">
                  {i18n.t("column.empty")}
                </div>
              )}
            </div>
          </div>

          <div className="md:w-2/3 pl-4 overflow-y-auto">
            <h3 className="font-medium text-neutral-700 dark:text-neutral-200 mb-4 text-lg">
              {selectedId ? i18n.t("column.edit") : i18n.t("column.add")}
            </h3>

            <div className="mb-6">
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                {i18n.t("column.title")}
              </label>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder={i18n.t("column.newPlaceholder")}
                className="w-full bg-transparent placeholder:text-neutral-400 dark:placeholder:text-neutral-600 text-neutral-800 dark:text-neutral-200 text-sm border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 transition"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-md text-sm transition"
              >
                {selectedId ? i18n.t("general.save") : i18n.t("general.add")}
              </button>
              {selectedId && (
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition"
                >
                  {i18n.t("general.delete")}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-neutral-600 text-neutral-800 dark:text-neutral-200 rounded-md text-sm hover:bg-gray-400 dark:hover:bg-neutral-500 transition"
          >
            {i18n.t("general.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
