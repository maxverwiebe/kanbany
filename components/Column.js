import { useState } from "react";
import Card from "./Card";
import { useBoard } from "@/lib/BoardContext";
import { FaRegStickyNote } from "react-icons/fa";

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

  const cardCount = cards.filter((card) => card.columnId === column.id).length;

  const addCardInColumn = () => {
    const id = addCard(column.id, newText);
    openModal(id);
  };

  return (
    <div
      className="bg-gray-100 p-4 rounded-md flex flex-col min-w-64 max-w-160 shadow-md overflow-visible dark:bg-neutral-800"
      onDrop={(e) => onDrop(e, column.id)}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 group">
          <h2 className="font-semibold dark:text-neutral-200">
            {column.title}
          </h2>
          <div className="hidden group-hover:flex items-center bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full transition-all duration-200 dark:text-neutral-200 dark:bg-neutral-700">
            <FaRegStickyNote className="mr-1" />
            <span>{cardCount}</span>
          </div>
        </div>
        <button
          className="text-2xl px-2 text-violet-500 hover:bg-violet-100 rounded-full dark:hover:bg-violet-900 dark:text-violet-300"
          onClick={addCardInColumn}
        >
          +
        </button>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[70vh] overflow-show">
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
