import Labels from "./Labels";
import { useBoard } from "@/lib/BoardContext";
import { MdOutlineCheckBox, MdFormatAlignLeft } from "react-icons/md";

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

  const checklistProgress = calculateChecklistProgress();

  return (
    <div
      className="bg-white p-2 mb-2 rounded shadow cursor-pointer w-full"
      draggable
      onClick={() => openModal(card.id)}
      onDragStart={(e) => onDragStart(e, card.id)}
      onDragEnd={onDragEnd}
      data-card-id={card.id}
    >
      <h3 className="font-medium">{truncateText(card.text, 25)}</h3>
      <Labels labelIds={card.labels} />

      <div className="flex">
        {card.description && (
          <MdFormatAlignLeft className="text-gray-400 text-lg mt-1 mr-2" />
        )}
        {checklistProgress && (
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <span>{checklistProgress}</span>
            <MdOutlineCheckBox className="ml-1 text-lg text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
}
