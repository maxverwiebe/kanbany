import Labels from "./Labels";
import { useBoard } from "@/lib/BoardContext";

export default function Card({ card }) {
  const { openModal, onDragStart, onDragEnd } = useBoard();

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div
      className="bg-white p-2 mb-2 rounded shadow cursor-pointer max-w-55"
      draggable
      onClick={() => openModal(card.id)}
      onDragStart={(e) => onDragStart(e, card.id)}
      onDragEnd={onDragEnd}
      data-card-id={card.id}
    >
      <h3 className="font-medium">{truncateText(card.text, 25)}</h3>
      <Labels labelIds={card.labels} />

      {card.description && (
        <p className="text-xs text-gray-500">
          {truncateText(card.description, 50)}
        </p>
      )}
    </div>
  );
}
