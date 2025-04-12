import { useState, useEffect, useRef } from "react";
import { useBoard } from "@/lib/BoardContext";
import i18n from "@/lib/i18n";
import { useToast } from "@/lib/ToastContext";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { GrNewWindow } from "react-icons/gr";

export default function CardModal() {
  const { cards, columns, modalCardId, updateCard, closeModal, labels } =
    useBoard();
  const card = cards.find((c) => c.id === modalCardId);

  const [title, setTitle] = useState(card?.text || "");
  const [description, setDescription] = useState(card?.description || "");
  const [selectedLabels, setSelectedLabels] = useState(card?.labels || []);
  const [columnID, setColumnID] = useState(card?.columnId || "");
  const { addToast } = useToast();

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [savedDescription, setSavedDescription] = useState(
    card?.description || ""
  );
  const descriptionRef = useRef(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDescFullscreen, setIsDescFullscreen] = useState(false);
  const [fullscreenDesc, setFullscreenDesc] = useState(description);
  const [isDescPreview, setIsDescPreview] = useState(false);

  useEffect(() => {
    if (card) {
      setTitle(card.text);
      setDescription(card.description || "");
      setSavedDescription(card.description || "");
      setSelectedLabels(card.labels || []);
      setColumnID(card.columnId);
      setFullscreenDesc(card.description || "");
    }
  }, [card]);

  const toggleLabel = (labelId) => {
    if (selectedLabels.includes(labelId)) {
      setSelectedLabels(selectedLabels.filter((id) => id !== labelId));
    } else {
      setSelectedLabels([...selectedLabels, labelId]);
    }
  };

  const save = () => {
    updateCard(card.id, {
      text: title,
      description,
      labels: selectedLabels,
      columnId: columnID,
    });
    addToast("Updated card!", "success");
    closeModal();
  };

  const saveDescription = () => {
    setSavedDescription(description);
    setIsEditingDescription(false);
  };

  const handleDescriptionKeyDown = (e) => {
    if (e.key === "Escape") {
      setDescription(savedDescription);
      setIsEditingDescription(false);
    } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      saveDescription();
    }
  };

  useEffect(() => {
    if (isEditingDescription && descriptionRef.current) {
      descriptionRef.current.focus();
    }
  }, [isEditingDescription]);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const openDescFullscreen = () => {
    setFullscreenDesc(description);
    setIsDescFullscreen(true);
    setIsDescPreview(false);
  };

  const closeDescFullscreen = () => {
    setIsDescFullscreen(false);
  };

  const saveDescFullscreen = () => {
    setDescription(fullscreenDesc);
    setSavedDescription(fullscreenDesc);
    setIsDescFullscreen(false);
  };

  const cardDescClasses = isFullscreen
    ? "h-[45vh] overflow-y-auto"
    : "h-[30vh] overflow-y-auto";

  if (!card) return null;

  const modalContainerClasses = isFullscreen
    ? "bg-white p-6 rounded shadow-lg w-full h-full max-w-none max-h-none overflow-y-auto"
    : "bg-white p-6 rounded shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto";

  return (
    <>
      <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 px-4">
        <div className={modalContainerClasses}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-center">
              {i18n.t("card.editor")}
            </h2>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded hover:bg-violet-100 text-neutral-400 font-thin text-2xl transition"
              title={isFullscreen ? "Shrink modal" : "Fullscreen modal"}
            >
              {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
            </button>
          </div>

          <div className="mb-4">
            <input
              className="w-full bg-transparent placeholder:text-neutral-400 text-neutral-800 text-sm border border-neutral-300 rounded-md px-3 py-2 transition duration-300 ease-in-out focus:outline-none focus:border-neutral-400 hover:border-neutral-400"
              placeholder={i18n.t("card.title")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-neutral-700 mb-2">
                {i18n.t("card.desc")}
              </h3>
              <button
                onClick={() => setIsEditingDescription((prev) => !prev)}
                className="px-3 py-1 text-xs border border-neutral-300 rounded hover:bg-violet-100 transition"
                title="Toggle preview"
              >
                {isEditingDescription ? "Edit" : "Preview"}
              </button>
            </div>
            {!isEditingDescription ? (
              <div
                className={
                  "relative p-2 border border-neutral-300 rounded-md cursor-text transition duration-200 hover:bg-neutral-50 " +
                  cardDescClasses
                }
                onClick={() => setIsEditingDescription(true)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDescFullscreen();
                  }}
                  className="absolute top-2 right-2 p-1 text-xl text-neutral-300 hover:text-violet-500 transition"
                  title="Fullscreen editor"
                >
                  <GrNewWindow />
                </button>
                <MarkdownRenderer text={description} />
              </div>
            ) : (
              <textarea
                ref={descriptionRef}
                className={
                  "w-full bg-transparent placeholder:text-neutral-400 text-neutral-800 text-sm border border-neutral-300 rounded-md px-3 py-2 transition duration-300 ease-in-out focus:outline-none focus:border-neutral-400 hover:border-neutral-400 " +
                  cardDescClasses
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={handleDescriptionKeyDown}
                onBlur={saveDescription}
                autoFocus
              />
            )}
          </div>

          <div className="mb-4">
            <h3 className="font-medium text-neutral-700 mb-2">
              {i18n.t("card.column")}
            </h3>
            <select
              className="w-full p-2 border border-neutral-300 rounded-md transition duration-300 ease-in-out focus:outline-none focus:border-neutral-400 hover:border-neutral-400"
              value={columnID}
              onChange={(e) => setColumnID(e.target.value)}
            >
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <h3 className="font-medium text-neutral-700 mb-2">
              {i18n.t("card.labels")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {labels.map((label) => {
                const isSelected = selectedLabels.includes(label.id);
                return (
                  <button
                    key={label.id}
                    type="button"
                    onClick={() => toggleLabel(label.id)}
                    className={`px-2 py-1 rounded text-sm transition duration-300 ${
                      isSelected
                        ? `${label.color} text-white`
                        : `${label.color} opacity-30 text-white`
                    }`}
                  >
                    {label.text}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-300 text-neutral-800 rounded-md text-sm hover:bg-gray-400 transition"
              onClick={closeModal}
            >
              {i18n.t("general.close")}
            </button>
            <button
              className="px-4 py-2 bg-violet-500 text-white rounded-md text-sm hover:bg-violet-600 transition"
              onClick={save}
            >
              {i18n.t("general.save")}
            </button>
          </div>
        </div>
      </div>

      {isDescFullscreen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-60 px-4">
          <div className="bg-white p-6 rounded shadow-lg w-full h-full max-w-3xl overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Description</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsDescPreview((prev) => !prev)}
                  className="px-3 py-1 text-xs border border-neutral-300 rounded hover:bg-violet-100 transition"
                  title="Toggle preview"
                >
                  {isDescPreview ? "Edit" : "Preview"}
                </button>
                <button
                  onClick={closeDescFullscreen}
                  className="p-2 rounded hover:bg-violet-100 text-neutral-400 transition"
                  title="Close fullscreen editor"
                >
                  X
                </button>
              </div>
            </div>
            {isDescPreview ? (
              <div className="flex-grow p-3 border border-neutral-300 rounded overflow-y-auto">
                <MarkdownRenderer text={fullscreenDesc} />
              </div>
            ) : (
              <textarea
                className="w-full flex-grow bg-transparent placeholder:text-neutral-400 text-neutral-800 text-sm border border-neutral-300 rounded-md px-3 py-2 transition duration-300 ease-in-out focus:outline-none focus:border-neutral-400 hover:border-neutral-400"
                value={fullscreenDesc}
                onChange={(e) => setFullscreenDesc(e.target.value)}
                autoFocus
              />
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={closeDescFullscreen}
                className="px-4 py-2 bg-gray-300 text-neutral-800 rounded-md text-sm hover:bg-gray-400 transition mr-2"
              >
                Cancel
              </button>
              <button
                onClick={saveDescFullscreen}
                className="px-4 py-2 bg-violet-500 text-white rounded-md text-sm hover:bg-violet-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
