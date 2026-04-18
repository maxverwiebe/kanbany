import Labels from "./Labels";
import { useBoard } from "@/lib/BoardContext";
import { MdOutlineCheckBox, MdFormatAlignLeft } from "react-icons/md";

export default function Card({ card, isStacked = false, isTopCard = true }) {
  const { openModal, onDragStart, onDragEnd } = useBoard();

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const calculateChecklistProgress = () => {
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

  const checklistProgress = calculateChecklistProgress();

  return (
    <div
      className={`rounded shadow cursor-pointer w-full ${
        isStacked && !isTopCard
          ? 'bg-gray-50 border border-gray-200 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200'
          : 'bg-white dark:bg-neutral-700 dark:text-neutral-200'
      } ${isStacked && !isTopCard ? 'overflow-hidden' : ''} p-2`}
      style={{
        maxHeight: isStacked && !isTopCard ? "32px" : "none",
      }}
      draggable
      onClick={() => openModal(card.id)}
      onDragStart={(e) => onDragStart(e, card.id)}
      onDragEnd={onDragEnd}
      data-card-id={card.id}
    >
      <h3 className={`font-medium ${isStacked && !isTopCard ? 'text-sm truncate' : ''}`}>
        {truncateText(card.text, isStacked && !isTopCard ? 18 : 25)}
      </h3>

      {(!isStacked || isTopCard) && (
        <>
          <Labels labelIds={card.labels} />

          {card.description && (
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 line-clamp-2">
              {truncateText(card.description, 60)}
            </p>
          )}

          <div className="flex mt-1">
            {checklistProgress && (
              <div className="flex items-center text-xs text-gray-500 dark:text-neutral-400">
                <MdOutlineCheckBox className="mr-1 text-gray-400 dark:text-neutral-400" />
                <span>{checklistProgress}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
