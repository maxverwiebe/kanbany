import { useState } from "react";
import { useBoard } from "@/lib/BoardContext";
import i18n from "@/lib/i18n";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";

export default function ColumnManagerModal({ onClose }) {
  const { columns, setColumns, addColumn } = useBoard();
  const [newTitle, setNewTitle] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleAddColumn = () => {
    if (!newTitle.trim()) return;
    addColumn(newTitle);
    setNewTitle("");
  };

  const handleRemoveColumn = (id) => {
    setColumns((prev) => prev.filter((col) => col.id !== id));
  };

  const moveColumn = (index, direction) => {
    const newColumns = [...columns];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= columns.length) return;
    [newColumns[index], newColumns[targetIndex]] = [
      newColumns[targetIndex],
      newColumns[index],
    ];
    setColumns(newColumns);
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const modalContainerClasses = isFullscreen
    ? "bg-white dark:bg-neutral-800 p-6 rounded shadow-lg w-full h-full max-w-none max-h-none overflow-y-auto"
    : "bg-white dark:bg-neutral-800 p-6 rounded shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto";

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
      <div className={modalContainerClasses}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-center dark:text-neutral-200">
            {i18n.t("column.manager")}
          </h2>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded hover:bg-violet-100 dark:hover:bg-violet-900 text-neutral-400 dark:text-neutral-500 font-thin text-2xl transition"
            title={isFullscreen ? "Shrink modal" : "Fullscreen modal"}
          >
            {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
          </button>
        </div>

        <div className="space-y-3 mb-8">
          {columns.map((col, index) => (
            <div
              key={col.id}
              className="flex items-center justify-between bg-neutral-100 dark:bg-neutral-700 p-3 rounded-md"
            >
              <span className="text-sm text-neutral-800 dark:text-neutral-200 truncate">
                {col.title}
              </span>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 text-sm text-neutral-500 dark:text-neutral-400 rounded hover:bg-violet-100 dark:hover:bg-violet-900 transition"
                  onClick={() => moveColumn(index, -1)}
                >
                  ↑
                </button>
                <button
                  className="px-3 py-1 text-sm text-neutral-500 dark:text-neutral-400 rounded hover:bg-violet-100 dark:hover:bg-violet-900 transition"
                  onClick={() => moveColumn(index, 1)}
                >
                  ↓
                </button>
                <button
                  className="px-3 py-1 text-sm text-red-500 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900 transition"
                  onClick={() => handleRemoveColumn(col.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-8 bg-neutral-100 dark:bg-neutral-700 p-4 rounded-lg">
          <div className="mb-4">
            <h3 className="font-medium text-neutral-700 dark:text-neutral-200 mb-3">
              {i18n.t("column.add")}
            </h3>
            <input
              className="w-full bg-transparent placeholder:text-neutral-400 dark:placeholder:text-neutral-600 text-neutral-800 dark:text-neutral-200 text-sm border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 transition duration-300 ease-in-out focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 hover:border-neutral-400 dark:hover:border-neutral-500"
              placeholder={i18n.t("column.new")}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <button
            className="w-full px-4 py-2 bg-violet-500 text-white rounded-md text-sm hover:bg-violet-600 transition"
            onClick={handleAddColumn}
          >
            {i18n.t("general.add")}
          </button>
        </div>

        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-gray-300 dark:bg-neutral-600 text-neutral-800 dark:text-neutral-200 rounded-md text-sm hover:bg-gray-400 dark:hover:bg-neutral-500 transition"
            onClick={onClose}
          >
            {i18n.t("general.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
