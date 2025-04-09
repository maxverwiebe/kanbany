import Labels from "./Labels";
import getLabels from "@/utils/LabelUtil";

export default function Card({ card, onClick, onDragStart, onDragEnd }) {
  return (
    <div
      className="bg-white p-2 mb-2 rounded shadow cursor-pointer"
      draggable
      onClick={() => onClick(card.id)}
      onDragStart={(e) => onDragStart(e, card.id)}
      onDragEnd={onDragEnd}
    >
      <h3 className="font-medium">{card.text}</h3>
      <Labels labels={card.labels} />
      {card.description && (
        <p className="text-sm text-gray-500 truncate">{card.description}</p>
      )}
    </div>
  );
}
