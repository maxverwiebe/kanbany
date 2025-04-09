import Card from "./Card";
import { useState } from "react";

export default function Column({ column, cards, handlers }) {
  const [newText, setNewText] = useState("");

  const addCard = () => {
    if (!newText.trim()) return;
    handlers.addCard(column.id, newText);
    setNewText("");
  };

  return (
    <div
      className="bg-gray-100 p-4 rounded w-64 flex flex-col"
      onDrop={(e) => handlers.onDrop(e, column.id)}
      onDragOver={handlers.onDragOver}
    >
      <h2 className="font-semibold mb-4">{column.title}</h2>
      <div className="flex-1">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onClick={handlers.onCardClick}
            onDragStart={handlers.onDragStart}
            onDragEnd={handlers.onDragEnd}
          />
        ))}
      </div>
      <div className="mt-4">
        <input
          className="w-full p-2 mb-2 rounded border"
          placeholder="Neue Karte"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white py-2 rounded"
          onClick={addCard}
        >
          Karte hinzufügen
        </button>
      </div>
    </div>
  );
}
