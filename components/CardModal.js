import { useState, useEffect, useRef, memo } from "react";
import { useBoard } from "@/lib/BoardContext";
import i18n from "@/lib/i18n";
import { addToast } from "@/lib/Toast";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { GrNewWindow } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";
import CardChecklist from "./CardChecklist";
import ConfirmationModal from "./ConfirmationModal";

export default function CardModal() {
  const {
    cards,
    columns,
    modalCardId,
    updateCard,
    closeModal,
    labels,
    setCards,
  } = useBoard();
  const card = cards.find((c) => c.id === modalCardId);

  const [title, setTitle] = useState(card?.text || "");
  const [description, setDescription] = useState(card?.description || "");
  const [selectedLabels, setSelectedLabels] = useState(card?.labels || []);
  const [columnID, setColumnID] = useState(card?.columnId || "");

  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDescFullscreen, setIsDescFullscreen] = useState(false);
  const [fullscreenDesc, setFullscreenDesc] = useState(description);
  const [isDescPreview, setIsDescPreview] = useState(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);

  const [originalData, setOriginalData] = useState(null);

  const [checklist, setChecklist] = useState(card?.checklist || []);

  const addChecklist = () => {
    const newItem = {
      id: checklist.length + 1,
      text: `${i18n.t("card.checklist")} ${checklist.length + 1}`,
      tasks: [{ id: 1, text: "New Task", completed: false }],
    };
    setChecklist((prev) => [...prev, newItem]);
  };

  const toggleChecklistTask = (itemId, taskId) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              tasks: item.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task
              ),
            }
          : item
      )
    );
  };

  const addChecklistTask = (itemId) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              tasks: [
                ...item.tasks,
                {
                  id: item.tasks.length + 1,
                  text: "New Task",
                  completed: false,
                },
              ],
            }
          : item
      )
    );
  };

  const renameChecklistTask = (itemId, taskId, newText) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              tasks: item.tasks.map((task) =>
                task.id === taskId ? { ...task, text: newText } : task
              ),
            }
          : item
      )
    );
  };

  const renameChecklist = (itemId, newText) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, text: newText } : item
      )
    );
  };

  const deleteChecklist = (itemId) => {
    setChecklist((prev) => prev.filter((item) => item.id !== itemId));
  };
  const deleteChecklistTask = (itemId, taskId) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              tasks: item.tasks.filter((task) => task.id !== taskId),
            }
          : item
      )
    );
  };

  useEffect(() => {
    if (card) {
      setTitle(card.text);
      setDescription(card.description || "");
      setSelectedLabels(card.labels || []);
      setColumnID(card.columnId);
      setFullscreenDesc(card.description || "");

      setOriginalData(
        JSON.parse(
          JSON.stringify({
            title: card.text,
            description: card.description || "",
            selectedLabels: card.labels || [],
            columnID: card.columnId,
            checklist: card.checklist || [],
          })
        )
      );
    }
  }, [card]);

  const toggleLabel = (labelId) => {
    if (selectedLabels.includes(labelId)) {
      setSelectedLabels(selectedLabels.filter((id) => id !== labelId));
    } else {
      setSelectedLabels([...selectedLabels, labelId]);
    }
  };

  const hasUnsavedChanges = () => {
    if (!originalData) return false;
    const currentData = {
      title,
      description,
      selectedLabels,
      columnID,
      checklist,
    };
    return JSON.stringify(currentData) !== JSON.stringify(originalData);
  };

  const save = () => {
    updateCard(card.id, {
      text: title,
      description,
      labels: selectedLabels,
      columnId: columnID,
      checklist: checklist,
    });
    addToast("Updated card!", "success");
    closeModal();
  };

  const handleCloseModal = () => {
    if (hasUnsavedChanges()) {
      setIsConfirmModalOpen(true);
    } else {
      closeModal();
    }
  };

  const handleConfirmClose = () => {
    setIsConfirmModalOpen(false);
    closeModal();
  };
  const handleCancelClose = () => {
    setIsConfirmModalOpen(false);
  };

  const handleDelete = () => {
    setCards((prev) => prev.filter((c) => c.id !== card.id));
    addToast("Deleted card!", "success");
    closeModal();
  };

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
    setIsDescFullscreen(false);
  };

  const cardDescClasses = isFullscreen
    ? "h-[45vh] overflow-y-auto"
    : "h-[25vh] overflow-y-auto";

  if (!card) return null;

  const modalContainerClasses = isFullscreen
    ? "bg-white p-6 rounded shadow-lg w-full h-full max-w-none max-h-none flex flex-col overflow-hidden"
    : "bg-white p-6 rounded shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden";

  const leftContainerRef = useRef(null);
  const leftContainerScrollRef = useRef(0);

  useEffect(() => {
    if (leftContainerRef.current) {
      console.log("Restoring scroll position:", leftContainerScrollRef.current);
      leftContainerRef.current.scrollTop = leftContainerScrollRef.current;
    }
  }, [checklist]);

  function DesktopContent() {
    return (
      <div className="hidden md:flex flex-grow gap-4">
        <div
          className="flex-1 overflow-y-auto pr-2"
          ref={leftContainerRef}
          onScroll={() => {
            leftContainerScrollRef.current = leftContainerRef.current.scrollTop;
          }}
        >
          <div className="mb-4">
            <input
              className="w-full bg-transparent placeholder:text-neutral-400 text-neutral-800 text-sm border border-neutral-300 rounded-md px-3 py-2 transition duration-300 ease-in-out focus:outline-none focus:border-neutral-400 hover:border-neutral-400"
              placeholder={i18n.t("card.title")}
              defaultValue={title}
              onBlur={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-md font-semibold text-neutral-700">
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
                className={
                  "w-full bg-transparent placeholder:text-neutral-400 text-neutral-800 text-sm border border-neutral-300 rounded-md px-3 py-2 transition duration-300 ease-in-out focus:outline-none focus:border-neutral-400 hover:border-neutral-400 resize-y " +
                  cardDescClasses
                }
                defaultValue={description}
                onBlur={(e) => {
                  setDescription(e.target.value);
                  setIsEditingDescription(false);
                }}
                autoFocus
              />
            )}
          </div>
          <CardChecklist
            checklist={checklist}
            renameChecklistTask={renameChecklistTask}
            toggleChecklistTask={toggleChecklistTask}
            addChecklistTask={addChecklistTask}
            addChecklist={addChecklist}
            renameChecklist={renameChecklist}
            deleteChecklist={deleteChecklist}
            deleteChecklistTask={deleteChecklistTask}
          />
        </div>
        <div className="w-full md:w-1/3 flex flex-col gap-4 overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-md font-semibold text-neutral-700 mb-2">
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
            <h3 className="text-md font-semibold text-neutral-700 mb-2">
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
        </div>
      </div>
    );
  }

  function MobileContent() {
    return (
      <div className="md:hidden flex flex-col flex-grow overflow-y-auto gap-4">
        <div>
          <input
            className="w-full bg-transparent placeholder:text-neutral-400 text-neutral-800 text-sm border border-neutral-300 rounded-md px-3 py-2 transition duration-300 ease-in-out focus:outline-none focus:border-neutral-400 hover:border-neutral-400"
            placeholder={i18n.t("card.title")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-md font-semibold text-neutral-700">
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
              className={
                "w-full bg-transparent placeholder:text-neutral-400 text-neutral-800 text-sm border border-neutral-300 rounded-md px-3 py-2 transition duration-300 ease-in-out focus:outline-none focus:border-neutral-400 hover:border-neutral-400 " +
                cardDescClasses
              }
              defaultValue={description}
              onBlur={(e) => {
                setDescription(e.target.value);
                setIsEditingDescription(false);
              }}
              autoFocus
            />
          )}
          <div className="mt-4">
            <CardChecklist
              checklist={checklist}
              renameChecklistTask={renameChecklistTask}
              toggleChecklistTask={toggleChecklistTask}
              addChecklistTask={addChecklistTask}
              addChecklist={addChecklist}
              renameChecklist={renameChecklist}
              deleteChecklist={deleteChecklist}
              deleteChecklistTask={deleteChecklistTask}
            />
          </div>
        </div>

        <div>
          <div className="mb-4">
            <h3 className="text-md font-semibold text-neutral-700 mb-2">
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
            <h3 className="text-md font-semibold text-neutral-700 mb-2">
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
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 px-4">
        <div className={modalContainerClasses}>
          <div className="flex items-center justify-between mb-4">
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
          <div className="flex flex-grow overflow-hidden">
            <DesktopContent />
            <MobileContent />
          </div>
          <div className="mt-4 border-t border-neutral-300 pt-4 flex items-center justify-between">
            <button
              onClick={() => setIsConfirmDeleteModalOpen(true)}
              className="px-4 py-2 text-sm rounded-md hover:text-red-500 hover:bg-red-200 bg-gray-300 transition"
              title="Delete card"
            >
              Delete
            </button>
            <div className="flex space-x-2">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 text-neutral-800 rounded-md text-sm hover:bg-gray-400 transition"
              >
                {i18n.t("general.close")}
              </button>
              <button
                onClick={save}
                className="px-4 py-2 bg-violet-500 text-white rounded-md text-sm hover:bg-violet-600 transition"
              >
                {i18n.t("general.save")}
              </button>
            </div>
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
      {isConfirmModalOpen && (
        <ConfirmationModal
          title={i18n.t("card.modalConfirmUnsavedChanges")}
          message={i18n.t("card.modalConfirmUnsavedChangesDetails")}
          confirmText={i18n.t("card.modalConfirmUnsavedChangesYes")}
          cancelText={i18n.t("card.modalConfirmUnsavedChangesNo")}
          onConfirm={handleConfirmClose}
          onCancel={handleCancelClose}
        />
      )}
      {isConfirmDeleteModalOpen && (
        <ConfirmationModal
          title={i18n.t("card.modalConfirmDelete")}
          message={i18n.t("card.modalConfirmDeleteDetails")}
          confirmText={i18n.t("card.modalConfirmDeleteYes")}
          cancelText={i18n.t("card.modalConfirmDeleteNo")}
          onConfirm={handleDelete}
          onCancel={() => setIsConfirmDeleteModalOpen(false)}
        />
      )}
    </>
  );
}
