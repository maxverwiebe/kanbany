import { createContext, useContext, useState } from "react";
import { v4 as uuid } from "uuid";

const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
  const [columns, setColumns] = useState([
    { id: uuid(), title: "To Do" },
    { id: uuid(), title: "In Progress" },
    { id: uuid(), title: "Done" },
  ]);
  const [cards, setCards] = useState([]);
  const [modalCardId, setModalCardId] = useState(null);
  const [draggedId, setDraggedId] = useState(null);

  const [labels, setLabels] = useState([
    { id: uuid(), text: "Label 1", color: "bg-red-500" },
    { id: uuid(), text: "Label 2", color: "bg-green-500" },
    { id: uuid(), text: "YOddd", color: "bg-blue-500" },
  ]);

  const addColumn = (title) => {
    setColumns((prev) => [...prev, { id: uuid(), title }]);
  };

  const addCard = (columnId, text) => {
    const id = uuid();
    setCards((prev) => [...prev, { id: id, text, columnId, labels: [] }]);

    return id;
  };

  const updateCard = (id, fields) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...fields } : c))
    );
  };

  const openModal = (id) => setModalCardId(id);
  const closeModal = () => setModalCardId(null);

  const onDragStart = (e, id) => {
    setDraggedId(id);
    e.currentTarget.classList.add("opacity-50");
  };

  const onDragEnd = (e) => {
    e.currentTarget.classList.remove("opacity-50");
    setDraggedId(null);
  };

  const onDrop = (e, newColumnId) => {
    e.preventDefault();
    if (!draggedId) return;
    setCards((prev) =>
      prev.map((card) =>
        card.id === draggedId ? { ...card, columnId: newColumnId } : card
      )
    );
    setDraggedId(null);
  };

  const exportBoard = (boardName = "My Board", version = "1.0") => {
    const boardState = {
      boardName,
      version,
      columns,
      cards,
      labels,
    };
    return JSON.stringify(boardState, null, 2);
  };

  const importBoard = (jsonData) => {
    try {
      const data =
        typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;
      if (!data.version) {
        throw new Error("Imported data is missing a version identifier.");
      }
      if (data.version !== "1.0") {
        console.warn(
          `Warning: Imported board version (${data.version}) does not match expected version (1.0).`
        );
      }
      if (data.columns && data.cards && data.labels) {
        setColumns(data.columns);
        setCards(data.cards);
        setLabels(data.labels);
      } else {
        throw new Error("Imported data does not have the required structure.");
      }
    } catch (error) {
      throw new Error(`Failed to import board data: ${error.message}`);
    }
  };

  return (
    <BoardContext.Provider
      value={{
        columns,
        cards,
        modalCardId,
        setModalCardId,
        addColumn,
        setColumns,
        addCard,
        updateCard,
        openModal,
        closeModal,
        onDragStart,
        onDragEnd,
        onDrop,
        labels,
        setLabels,
        importBoard,
        exportBoard,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => useContext(BoardContext);
