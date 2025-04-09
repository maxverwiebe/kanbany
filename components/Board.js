import { useState } from "react";
import Column from "./Column";
import { v4 as uuid } from "uuid";
import CardModal from "./CardModal";

export default function Board() {
  const [columns, setColumns] = useState([
    { id: uuid(), title: "To Do" },
    { id: uuid(), title: "In Progress" },
    { id: uuid(), title: "Done" },
  ]);
  const [cards, setCards] = useState([]);
  const [draggedId, setDraggedId] = useState(null);
  const [newColTitle, setNewColTitle] = useState("");
  const [modalCardId, setModalCardId] = useState(null);

  const addColumn = () => {
    if (!newColTitle.trim()) return;
    setColumns((prev) => [...prev, { id: uuid(), title: newColTitle }]);
    setNewColTitle("");
  };

  const addCard = (columnId, text) => {
    setCards((prev) => [...prev, { id: uuid(), text, columnId, labels: [] }]);
  };

  const onDragStart = (e, id) => {
    setDraggedId(id);
    e.currentTarget.classList.add("opacity-50");
  };
  const onDragEnd = (e) => {
    e.currentTarget.classList.remove("opacity-50");
    setDraggedId(null);
  };
  const onDragOver = (e) => e.preventDefault();
  const onDrop = (e, newColumnId) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === draggedId ? { ...card, columnId: newColumnId } : card
      )
    );
  };

  const onCardClick = (id) => setModalCardId(id);
  const closeModal = () => setModalCardId(null);
  const updateCard = (id, fields) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...fields } : c))
    );
  };

  const handlers = {
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
    addCard,
    onCardClick,
  };

  return (
    <div>
      <div className="flex mb-4">
        <input
          className="flex-1 p-2 border rounded mr-2"
          placeholder="Neue Spalte"
          value={newColTitle}
          onChange={(e) => setNewColTitle(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={addColumn}
        >
          Spalte hinzufügen
        </button>
      </div>
      <div className="flex space-x-4 overflow-x-auto">
        {columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            cards={cards.filter((c) => c.columnId === col.id)}
            handlers={handlers}
          />
        ))}
      </div>
      {modalCardId && (
        <CardModal
          card={cards.find((c) => c.id === modalCardId)}
          onSave={updateCard}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
