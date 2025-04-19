import { useState, useEffect } from "react";
import { useBoard } from "@/lib/BoardContext";
import i18n from "@/lib/i18n";
import { addToast } from "@/lib/Toast";
import { MdFullscreen, MdFullscreenExit, MdAdd } from "react-icons/md";

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editColor, setEditColor] = useState(COLORS[0]);

  useEffect(() => {
    if (selectedId) {
      const label = labels.find((l) => l.id === selectedId);
      setEditTitle(label?.text || "");
      setEditColor(label?.color || COLORS[0]);
    } else {
      setEditTitle("");
      setEditColor(COLORS[0]);
    }
  }, [selectedId, labels]);

  const handleSave = () => {
    if (!editTitle.trim()) return;
    if (selectedId) {
      setLabels((prev) =>
        prev.map((l) =>
          l.id === selectedId ? { ...l, text: editTitle, color: editColor } : l
        )
      );
      addToast(
        i18n.t("label.toastSuccessfullyUpdated", { name: editTitle }),
        "success"
      );
      setSelectedId(null);
    } else {
      addLabel(editTitle, editColor);
      addToast(
        i18n.t("label.toastSuccessfullyCreated", { name: editTitle }),
        "success"
      );
      setEditTitle("");
      setEditColor(COLORS[0]);
    }
  };

  const handleDelete = () => {
    if (!selectedId) return;
    const label = labels.find((l) => l.id === selectedId);
    setLabels((prev) => prev.filter((l) => l.id !== selectedId));
    addToast(
      i18n.t("label.toastSuccessfullyDeleted", { name: label?.text }),
      "success"
    );
    setSelectedId(null);
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
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

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          <div className="hidden md:block md:w-1/3 border-r border-neutral-200 dark:border-neutral-700 pr-2">
            <div className="overflow-y-auto max-h-full">
              <button
                onClick={() => setSelectedId(null)}
                className={`flex items-center w-full p-2 mb-2 rounded cursor-pointer transition text-violet-600 dark:text-violet-300 font-medium ${
                  selectedId === null
                    ? "bg-violet-100 dark:bg-violet-900"
                    : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
                }`}
              >
                <MdAdd className="mr-2" /> {i18n.t("label.add")}
              </button>

              {labels.length > 0 ? (
                labels.map((label) => (
                  <div
                    key={label.id}
                    onClick={() => setSelectedId(label.id)}
                    className={`flex items-center p-2 mb-2 rounded cursor-pointer transition ${
                      selectedId === label.id
                        ? "bg-violet-100 dark:bg-violet-900"
                        : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full ${label.color}`} />
                    <span className="ml-2 truncate text-sm text-neutral-800 dark:text-neutral-200">
                      {label.text}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-neutral-500 dark:text-neutral-600 text-sm mt-4">
                  {i18n.t("label.empty")}
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-2/3 pl-0 md:pl-4 overflow-y-auto">
            <div className="md:hidden mb-4">
              <select
                value={selectedId || ""}
                onChange={(e) => setSelectedId(e.target.value || null)}
                className="w-full bg-transparent border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 text-neutral-800 dark:text-neutral-200 text-sm focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 transition"
              >
                <option value="">{i18n.t("label.add")}</option>
                {labels.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.text}
                  </option>
                ))}
              </select>
            </div>

            <h3 className="font-medium text-neutral-700 dark:text-neutral-200 mb-4 text-lg">
              {selectedId ? i18n.t("label.edit") : i18n.t("label.add")}
            </h3>

            <div className="mb-4">
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                {i18n.t("label.title")}
              </label>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-transparent placeholder:text-neutral-400 dark:placeholder:text-neutral-600 text-neutral-800 dark:text-neutral-200 text-sm border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 transition"
                placeholder={i18n.t("label.titlePlaceholder")}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                {i18n.t("label.color")}
              </label>
              <div className="grid grid-cols-9 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setEditColor(color)}
                    className={`ml-1 w-8 h-8 rounded-full transition ${color} ${
                      editColor === color
                        ? "ring-2 ring-offset-1 ring-violet-500 dark:ring-violet-400"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
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
