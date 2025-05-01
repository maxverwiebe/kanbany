import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
  const [columns, setColumns] = useState([
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "done", title: "Done" },
  ]);
  const [cards, setCards] = useState([
    { id: "1", text: "Task 1", columnId: "todo", labels: ["1"] },
    {
      id: "2",
      text: "Task 2",
      columnId: "in-progress",
      labels: ["2"],
      description: "This is a description!",
    },
    {
      id: "3",
      text: "Task 3",
      columnId: "done",
      labels: [],
      description: "# MARKDOWN SUPPORT!",
    },
  ]);
  const [modalCardId, setModalCardId] = useState(null);
  const [draggedId, setDraggedId] = useState(null);

  const [labels, setLabels] = useState([
    { id: "1", text: "Urgent", color: "bg-red-500" },
    { id: "2", text: "Important", color: "bg-yellow-500" },
    { id: "3", text: "Optional", color: "bg-green-500" },
  ]);

  const addColumn = (title) => {
    const id = generateId(columns.map((col) => col.id));
    setColumns((prev) => [...prev, { id, title }]);
  };

  const addCard = (columnId, text) => {
    const id = generateId(cards.map((card) => card.id));
    setCards((prev) => [...prev, { id, text, columnId, labels: [] }]);
    return id;
  };

  const addLabel = (text, color) => {
    const id = generateId(labels.map((label) => label.id));
    setLabels((prev) => [...prev, { id, text, color }]);
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

    setCards((prev) => {
      const draggedCard = prev.find((card) => card.id === draggedId);
      if (!draggedCard) return prev;

      const cardsWithoutDragged = prev.filter((card) => card.id !== draggedId);

      return [
        ...cardsWithoutDragged,
        { ...draggedCard, columnId: newColumnId },
      ];
    });

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
    return JSON.stringify(boardState);
  };

  const importBoard = async (jsonData) => {
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

  const generateId = (existingIds = []) => {
    let id;
    do {
      // time + randon → Base36 (only letters & numbers)
      id = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    } while (existingIds.includes(id));
    return id;
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
        setCards,
        setLabels,
        exportBoard,
        addLabel,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => useContext(BoardContext);
