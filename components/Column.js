import { useState } from "react";
import Card from "./Card";
import { useBoard } from "@/lib/BoardContext";

export default function Column({ column }) {
  const {
    cards,
    addCard,
    onCardClick,
    onDragStart,
    onDragEnd,
    onDrop,
    openModal,
  } = useBoard();

  const [newText, setNewText] = useState("test");

  const addCardInColumn = () => {
    const id = addCard(column.id, newText);
    openModal(id);
  };

  return (
    <div
      className="bg-gray-100 p-4 rounded flex flex-col min-w-64 max-w-160 shadow-md overflow-visible"
      onDrop={(e) => onDrop(e, column.id)}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">{column.title}</h2>
        <button
          className="text-2xl px-2 text-violet-500 hover:bg-violet-100 rounded-full"
          onClick={addCardInColumn}
        >
          +
        </button>
      </div>

      <div className="flex-1">
        {cards
          .filter((card) => card.columnId === column.id)
          .map((card) => (
            <Card
              key={card.id}
              card={card}
              onClick={onCardClick}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))}
      </div>
    </div>
  );
}
