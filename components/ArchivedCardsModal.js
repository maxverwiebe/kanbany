import { useState } from "react";
import { useBoard } from "@/lib/BoardContext";
import i18n from "@/lib/i18n";
import { addToast } from "@/lib/Toast";
import Labels from "./Labels";
import { MdOutlineCheckBox, MdFormatAlignLeft } from "react-icons/md";

export default function ArchivedCardsModal({ isOpen, onClose }) {
  const { archivedCards, restoreCard, columns } = useBoard();
  const [selectedCard, setSelectedCard] = useState(null);

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const calculateChecklistProgress = (card) => {
    const checklistArray = card?.checklist;
    if (!checklistArray || !Array.isArray(checklistArray)) return false;

    let total = 0;
    let completed = 0;

    checklistArray.forEach((list) => {
      if (list && Array.isArray(list.tasks)) {
        total += list.tasks.length;
        completed += list.tasks.filter((task) => task.completed).length;
      }
    });

    return total === 0 ? false : `${completed}/${total}`;
  };

  const getColumnTitle = (columnId) => {
    const column = columns.find((col) => col.id === columnId);
    return column ? column.title : columnId;
  };

  const handleRestore = (cardId) => {
    restoreCard(cardId);
    addToast(i18n.t("archive.toastRestored"), "success");
    setSelectedCard(null);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden dark:bg-neutral-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-center dark:text-neutral-200">
            {i18n.t("archive.archivedCards")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-violet-100 text-neutral-400 font-thin text-2xl transition dark:hover:bg-violet-950"
            title="Close"
          >
            X
          </button>
        </div>

        {archivedCards.length === 0 ? (
          <div className="flex-grow flex items-center justify-center text-neutral-500 dark:text-neutral-400">
            <p>{i18n.t("archive.noArchivedCards")}</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto">
            {selectedCard ? (
              <div className="p-4 border border-neutral-200 rounded dark:border-neutral-700">
                <div className="flex justify-between items-start mb-4">
                  <button
                    onClick={() => setSelectedCard(null)}
                    className="text-violet-500 hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-300 transition"
                  >
                    {i18n.t("archive.backToList")}
                  </button>
                  <button
                    onClick={() => handleRestore(selectedCard.id)}
                    className="px-4 py-2 bg-violet-500 text-white rounded-md text-sm hover:bg-violet-600 transition"
                  >
                    {i18n.t("archive.restoreCard")}
                  </button>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold dark:text-neutral-200 mb-2">
                    {selectedCard.text}
                  </h3>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                    <p>{i18n.t("archive.originalColumn")}: {getColumnTitle(selectedCard.columnId)}</p>
                    <p>{i18n.t("archive.archivedAt")}: {formatDate(selectedCard.archivedAt)}</p>
                  </div>
                  <Labels labelIds={selectedCard.labels} />
                </div>

                {selectedCard.description && (
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-neutral-700 mb-2 dark:text-neutral-200">
                      {i18n.t("archive.description")}
                    </h4>
                    <div className="p-3 border border-neutral-200 rounded dark:border-neutral-700 whitespace-pre-wrap dark:text-neutral-200">
                      {selectedCard.description}
                    </div>
                  </div>
                )}

                {selectedCard.checklist && selectedCard.checklist.length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold text-neutral-700 mb-2 dark:text-neutral-200">
                      {i18n.t("archive.checklists")}
                    </h4>
                    {selectedCard.checklist.map((list) => (
                      <div key={list.id} className="mb-3">
                        <h5 className="font-medium dark:text-neutral-200">{list.text}</h5>
                        <ul className="list-disc list-inside pl-2">
                          {list.tasks.map((task) => (
                            <li
                              key={task.id}
                              className={`${
                                task.completed
                                  ? "line-through text-neutral-400 dark:text-neutral-500"
                                  : "dark:text-neutral-200"
                              }`}
                            >
                              {task.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {archivedCards.map((card) => {
                  const checklistProgress = calculateChecklistProgress(card);
                  return (
                    <div
                      key={card.id}
                      className="bg-white p-3 rounded shadow cursor-pointer hover:shadow-md transition dark:bg-neutral-700 dark:text-neutral-200"
                      onClick={() => setSelectedCard(card)}
                    >
                      <h3 className="font-medium mb-2">
                        {truncateText(card.text, 30)}
                      </h3>
                      <Labels labelIds={card.labels} />
                      <div className="flex items-center justify-between mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                        <div className="flex items-center">
                          {card.description && (
                            <MdFormatAlignLeft className="text-gray-400 text-lg mr-1 dark:text-neutral-400" />
                          )}
                          {checklistProgress && (
                            <div className="flex items-center">
                              <span>{checklistProgress}</span>
                              <MdOutlineCheckBox className="ml-1 text-lg text-gray-400 dark:text-neutral-400" />
                            </div>
                          )}
                        </div>
                        <span className="text-xs">
                          {formatDate(card.archivedAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="mt-4 border-t border-neutral-300 pt-4 flex justify-end dark:border-neutral-600">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-neutral-800 rounded-md text-sm hover:bg-gray-400 transition dark:bg-neutral-600 dark:hover:bg-neutral-500 dark:text-neutral-200"
          >
            {i18n.t("general.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
