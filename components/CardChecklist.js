import { useState } from "react";
import { MdChecklist } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import ConfirmationModal from "./ConfirmationModal";
import i18n from "@/lib/i18n";

const ProgressBar = ({ progress }) => (
  <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2.5 overflow-hidden transition-all duration-300">
    <div
      className="bg-violet-500 h-full rounded-full transition-all duration-300"
      style={{ width: `${progress}%` }}
    ></div>
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

  function calculateProgress(checklistId) {
    const checklistItem = checklist.find((item) => item.id === checklistId);
    if (!checklistItem) return 0;
    const totalTasks = checklistItem.tasks.length;
    const completedTasks = checklistItem.tasks.filter(
      (task) => task.completed
    ).length;
    return totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  }

  const handleDeleteChecklistRequest = (itemId) => {
    setChecklistToDelete(itemId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteChecklist && checklistToDelete != null) {
      deleteChecklist(checklistToDelete);
    }
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
          <div key={item.id} className="space-y-4 pb-4">
            <div className="flex items-center gap-2 justify-between group">
              <div className="flex items-center gap-2 w-full">
                <MdChecklist className="text-2xl text-neutral-700 dark:text-neutral-200" />
                <input
                  className="text-md font-semibold bg-transparent border-b border-transparent focus:border-violet-500 outline-none transition-colors duration-300 w-full 
                             text-neutral-800 dark:text-neutral-200 dark:focus:border-violet-400 dark:border-transparent"
                  defaultValue={item.text}
                  onBlur={(e) => renameChecklist(item.id, e.target.value)}
                />
              </div>
              <button
                onClick={() => handleDeleteChecklistRequest(item.id)}
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
                  className="flex items-center gap-3 justify-between group"
                >
                  <div className="flex items-center gap-3 w-full">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded accent-violet-500 transition"
                      checked={task.completed}
                      onChange={() => toggleChecklistTask(item.id, task.id)}
                    />
                    <input
                      type="text"
                      className="text-sm bg-transparent border-b border-transparent focus:border-violet-500 outline-none transition-colors duration-300 w-full 
                                 text-neutral-800 dark:text-neutral-200 dark:focus:border-violet-400 dark:border-transparent"
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
          title="Delete Checklist"
          message="Are you sure you want to delete this checklist? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default CardChecklist;
