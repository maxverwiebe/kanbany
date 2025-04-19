import React, { useState } from "react";
import { MdChecklist } from "react-icons/md";
import { FaTrash, FaRegSquare, FaRegCheckSquare } from "react-icons/fa";
import ConfirmationModal from "./ConfirmationModal";
import i18n from "@/lib/i18n";

const CustomCheckbox = ({ checked, onToggle }) => (
  <button
    onClick={onToggle}
    className="focus:outline-none hover:text-violet-600 dark:hover:text-violet-400 transition transform hover:scale-110"
    aria-pressed={checked}
    aria-label={
      checked ? i18n.t("card.taskCompleted") : i18n.t("card.taskIncomplete")
    }
  >
    {checked ? (
      <FaRegCheckSquare className="text-violet-500 w-5 h-5 transition" />
    ) : (
      <FaRegSquare className="text-neutral-400 w-5 h-5 transition" />
    )}
  </button>
);

const ProgressBar = ({ progress }) => (
  <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-1.5 overflow-hidden transition-all duration-300">
    <div
      className="bg-violet-500 h-full rounded-full transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
);

const CardChecklist = ({
  checklist,
  toggleChecklistTask,
  addChecklistTask,
  renameChecklistTask,
  addChecklist,
  renameChecklist,
  deleteChecklist,
  deleteChecklistTask,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [checklistToDelete, setChecklistToDelete] = useState(null);

  const calculateProgress = (checklistId) => {
    const item = checklist.find((c) => c.id === checklistId);
    if (!item) return 0;
    const total = item.tasks.length;
    const done = item.tasks.filter((t) => t.completed).length;
    return total === 0 ? 0 : (done / total) * 100;
  };

  const handleDeleteRequest = (itemId) => {
    setChecklistToDelete(itemId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (checklistToDelete != null) deleteChecklist(checklistToDelete);
    setDeleteModalOpen(false);
    setChecklistToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setChecklistToDelete(null);
  };

  return (
    <div className="mb-4 overflow-auto space-y-6 p-2">
      {checklist?.map((item) => {
        const progress = calculateProgress(item.id);
        return (
          <div key={item.id} className="space-y-2">
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-2 w-full">
                <MdChecklist className="text-2xl text-neutral-700 dark:text-neutral-200" />
                <input
                  className="text-md font-semibold bg-transparent border-b border-transparent focus:border-violet-500 outline-none transition-colors duration-300 w-full text-neutral-800 dark:text-neutral-200 dark:focus:border-violet-400"
                  defaultValue={item.text}
                  onBlur={(e) => renameChecklist(item.id, e.target.value)}
                />
              </div>
              <button
                onClick={() => handleDeleteRequest(item.id)}
                className="hidden group-hover:block text-red-300 hover:text-red-700 dark:hover:text-red-400 transition"
                title={i18n.t("card.checklistDelete")}
              >
                <FaTrash />
              </button>
            </div>

            <div className="flex items-center gap-3 mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                {Math.round(progress)}%
              </p>
              <ProgressBar progress={progress} />
            </div>

            <ul className="space-y-2">
              {item.tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 w-full">
                    <CustomCheckbox
                      checked={task.completed}
                      onToggle={() => toggleChecklistTask(item.id, task.id)}
                    />
                    <input
                      type="text"
                      className={`text-sm bg-transparent border-b border-transparent focus:border-violet-500 outline-none transition-colors duration-300 w-full text-neutral-800 dark:text-neutral-200 dark:focus:border-violet-400 ${
                        task.completed
                          ? "line-through text-neutral-400 dark:text-neutral-500"
                          : ""
                      }`}
                      defaultValue={task.text}
                      onBlur={(e) =>
                        renameChecklistTask(item.id, task.id, e.target.value)
                      }
                    />
                  </div>
                  <button
                    onClick={() => deleteChecklistTask(item.id, task.id)}
                    className="hidden group-hover:block text-red-300 hover:text-red-700 dark:hover:text-red-400 transition"
                    title={i18n.t("card.checklistDeleteTask")}
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>

            <button
              className="text-xs text-violet-500 hover:underline transition dark:text-violet-400"
              onClick={() => addChecklistTask(item.id)}
            >
              + {i18n.t("card.checklistAddTask")}
            </button>
          </div>
        );
      })}

      <button
        className="text-xs text-violet-500 hover:underline transition dark:text-violet-400"
        onClick={addChecklist}
      >
        + {i18n.t("card.checklistAdd")}
      </button>

      {deleteModalOpen && (
        <ConfirmationModal
          title={i18n.t("card.modalDeleteChecklist")}
          message={i18n.t("card.modalDeleteChecklistDetails")}
          confirmText={i18n.t("general.delete")}
          cancelText={i18n.t("general.cancel")}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default CardChecklist;
