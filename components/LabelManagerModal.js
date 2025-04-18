import { useState } from "react";
import { useBoard } from "@/lib/BoardContext";
import i18n from "@/lib/i18n";
import { addToast } from "@/lib/Toast";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";

const COLORS = [
  "bg-red-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-cyan-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-slate-500",
];

export default function LabelManagerModal({ onClose }) {
  const { labels, setLabels, addLabel } = useBoard();
  const [newTitle, setNewTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleAddLabel = () => {
    if (!newTitle.trim()) return;
    addLabel(newTitle, selectedColor);
    setSelectedColor(COLORS[0]);
    addToast(
      i18n.t("label.toastSuccessfullyCreated", { name: newTitle }),
      "success"
    );
    setNewTitle("");
  };

  const handleRemoveLabel = (id) => {
    const name = labels.find((l) => l.id === id)?.text;
    setLabels((prev) => prev.filter((l) => l.id !== id));
    addToast(
      i18n.t("label.toastSuccessfullyDeleted", { name: name }),
      "success"
    );
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const modalClasses = isFullscreen
    ? "bg-white dark:bg-neutral-800 p-6 rounded shadow-lg w-full h-full max-w-none max-h-none overflow-y-auto flex flex-col"
    : "bg-white dark:bg-neutral-800 p-6 rounded shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col";

  const listClasses = isFullscreen
    ? "space-y-3 mb-8 max-h-[100vh] overflow-y-auto"
    : "space-y-3 mb-8 max-h-[30vh] overflow-y-auto";

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className={modalClasses}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-200">
            {i18n.t("label.manager")}
          </h2>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded hover:bg-violet-100 dark:hover:bg-violet-900 text-neutral-400 dark:text-neutral-500 font-thin text-2xl transition"
            title={isFullscreen ? "Shrink modal" : "Fullscreen modal"}
          >
            {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
          </button>
        </div>

        <div className={listClasses}>
          {labels.map((label) => (
            <div
              key={label.id}
              className="flex items-center justify-between bg-neutral-100 dark:bg-neutral-700 p-3 rounded-md"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-4 h-4 rounded ${label.color} inline-block`}
                />
                <span className="text-sm text-neutral-800 dark:text-neutral-200 truncate">
                  {label.text}
                </span>
              </div>
              <button
                className="px-3 py-1 text-sm text-red-500 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900 transition"
                onClick={() => handleRemoveLabel(label.id)}
              >
                ✕
              </button>
            </div>
          ))}
          {labels.length === 0 && (
            <div className="text-center text-neutral-500 dark:text-neutral-600 text-sm">
              {i18n.t("label.empty")}
            </div>
          )}
        </div>

        <div className="mb-8 bg-neutral-100 dark:bg-neutral-700 p-4 rounded-lg">
          <h3 className="font-medium text-neutral-700 dark:text-neutral-200 mb-3">
            {i18n.t("label.add")}
          </h3>
          <div className="mb-4">
            <input
              placeholder={i18n.t("label.title")}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-transparent placeholder:text-neutral-400 dark:placeholder:text-neutral-600 text-neutral-800 dark:text-neutral-200 text-sm border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 transition duration-300 ease-in-out focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 hover:border-neutral-400 dark:hover:border-neutral-500"
            />
          </div>

          <div className="grid grid-cols-9 gap-2 mb-4">
            {COLORS.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-full transition ${color} ${
                  selectedColor === color
                    ? "opacity-100 border-2 border-black dark:border-white"
                    : "opacity-75"
                }`}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>

          <button
            className="w-full px-4 py-2 bg-violet-500 text-white rounded-md text-sm hover:bg-violet-600 dark:hover:bg-violet-700 transition"
            onClick={handleAddLabel}
          >
            {i18n.t("general.add")}
          </button>
        </div>

        <div className="mt-auto flex justify-end">
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
