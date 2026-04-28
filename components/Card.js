import Labels from "./Labels";
import { useBoard } from "@/lib/BoardContext";
import { MdOutlineCheckBox, MdFormatAlignLeft, MdCalendarToday } from "react-icons/md";

export default function Card({ card }) {
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

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(dateString);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status = "future";
    if (diffDays < 0) {
      status = "overdue";
    } else if (diffDays === 0) {
      status = "today";
    } else if (diffDays <= 2) {
      status = "soon";
    }

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formatted = `${month}/${day}`;

    return {
      formatted,
      status,
      diffDays,
    };
  };

  const checklistProgress = calculateChecklistProgress();
  const dueDateInfo = formatDate(card.dueDate);

  const getCardBorderClass = () => {
    if (!dueDateInfo) return "";
    switch (dueDateInfo.status) {
      case "overdue":
        return "border-l-4 border-l-red-500";
      case "today":
        return "border-l-4 border-l-orange-500";
      case "soon":
        return "border-l-4 border-l-yellow-500";
      default:
        return "";
    }
  };

  const getDueDateColorClass = () => {
    if (!dueDateInfo) return "";
    switch (dueDateInfo.status) {
      case "overdue":
        return "text-red-600 dark:text-red-400";
      case "today":
        return "text-orange-600 dark:text-orange-400";
      case "soon":
        return "text-yellow-600 dark:text-yellow-400";
      default:
        return "text-gray-500 dark:text-neutral-400";
    }
  };

  return (
    <div
      className={`bg-white p-2 mb-2 rounded shadow cursor-pointer w-full dark:bg-neutral-700 dark:text-neutral-200 ${getCardBorderClass()}`}
      draggable
      onClick={() => openModal(card.id)}
      onDragStart={(e) => onDragStart(e, card.id)}
      onDragEnd={onDragEnd}
      data-card-id={card.id}
    >
      <h3 className="font-medium">{truncateText(card.text, 25)}</h3>
      <Labels labelIds={card.labels} />

      <div className="flex flex-wrap items-center gap-2">
        {card.description && (
          <MdFormatAlignLeft className="text-gray-400 text-lg mt-1 dark:text-neutral-400" />
        )}
        {checklistProgress && (
          <div className="flex items-center text-xs text-gray-500 mt-1 dark:text-neutral-400">
            <span>{checklistProgress}</span>
            <MdOutlineCheckBox className="ml-1 text-lg text-gray-400 dark:text-neutral-400" />
          </div>
        )}
        {dueDateInfo && (
          <div className={`flex items-center text-xs mt-1 ${getDueDateColorClass()}`}>
            <MdCalendarToday className="mr-1 text-sm" />
            <span>{dueDateInfo.formatted}</span>
            {dueDateInfo.status === "overdue" && (
              <span className="ml-1 font-medium">({Math.abs(dueDateInfo.diffDays)}d overdue)</span>
            )}
            {dueDateInfo.status === "today" && (
              <span className="ml-1 font-medium">(Today)</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
