import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

const BoardContext = createContext();

export const getMaxOrder = (cards) => {
  if (!cards || cards.length === 0) return 0;
  const orders = cards.map((card) => card.order ?? 0);
  return Math.max(...orders);
};

const migrateCardsOrder = (cards) => {
  const cardsByColumn = {};
  for (const card of cards) {
    if (!cardsByColumn[card.columnId]) {
      cardsByColumn[card.columnId] = [];
    }
    cardsByColumn[card.columnId].push(card);
  }

  return cards.map((card) => {
    if (card.order !== undefined && card.order !== null) {
      return card;
    }
    const columnCards = cardsByColumn[card.columnId];
    const indexInColumn = columnCards.findIndex((c) => c.id === card.id);
    return { ...card, order: indexInColumn + 1 };
  });
};

export const BoardProvider = ({ children }) => {
  const [columns, setColumns] = useState([
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "done", title: "Done" },
  ]);
  const [cards, setCards] = useState([
    { id: "1", text: "Task 1", columnId: "todo", labels: ["1"], order: 1 },
    {
      id: "2",
      text: "Task 2",
      columnId: "in-progress",
      labels: ["2"],
      description: "This is a description!",
      order: 1,
    },
    {
      id: "3",
      text: "Task 3",
      columnId: "done",
      labels: [],
      description: "# MARKDOWN SUPPORT!",
      order: 1,
    },
  ]);
  const [modalCardId, setModalCardId] = useState(null);
  const [draggedId, setDraggedId] = useState(null);

  const [labels, setLabels] = useState([
    { id: "1", text: "Urgent", color: "bg-red-500" },
    { id: "2", text: "Important", color: "bg-yellow-500" },
    { id: "3", text: "Optional", color: "bg-green-500" },
  ]);

  useEffect(() => {
    setCards((prev) => {
      const needsMigration = prev.some(
        (card) => card.order === undefined || card.order === null
      );
      if (needsMigration) {
        return migrateCardsOrder(prev);
      }
      return prev;
    });
  }, []);

  const addColumn = (title) => {
    const id = generateId(columns.map((col) => col.id));
    setColumns((prev) => [...prev, { id, title }]);
  };

  const addCard = (columnId, text) => {
    const id = generateId(cards.map((card) => card.id));
    const columnCards = cards.filter((card) => card.columnId === columnId);
    const maxOrder = getMaxOrder(columnCards);
    setCards((prev) => [...prev, { id, text, columnId, labels: [], order: maxOrder + 1 }]);
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

  const onDrop = (e, newColumnId, targetCardId = null) => {
    e.preventDefault();
    if (!draggedId) return;
    
    setCards((prev) => {
      const draggedCard = prev.find(card => card.id === draggedId);
      if (!draggedCard) return prev;
      
      // 如果是跨列移动
      if (draggedCard.columnId !== newColumnId) {
        const columnCards = prev.filter(card => card.columnId === newColumnId);
        const maxOrder = getMaxOrder(columnCards);
        
        return prev.map(card => {
          if (card.id === draggedId) {
            return { ...card, columnId: newColumnId, order: maxOrder + 1 };
          }
          return card;
        });
      }
      
      // 如果是同一列内排序
      if (targetCardId) {
        const targetCard = prev.find(card => card.id === targetCardId);
        if (!targetCard) return prev;
        
        const columnCards = prev.filter(card => card.columnId === newColumnId);
        const sortedCards = [...columnCards].sort((a, b) => a.order - b.order);
        
        const draggedIndex = sortedCards.findIndex(card => card.id === draggedId);
        const targetIndex = sortedCards.findIndex(card => card.id === targetCardId);
        
        if (draggedIndex === -1 || targetIndex === -1) return prev;
        
        // 重新计算order
        return prev.map(card => {
          if (card.columnId !== newColumnId) return card;
          
          const currentIndex = sortedCards.findIndex(c => c.id === card.id);
          if (currentIndex === draggedIndex) {
            return { ...card, order: targetIndex + 1 };
          } else if (draggedIndex < targetIndex && currentIndex > draggedIndex && currentIndex <= targetIndex) {
            return { ...card, order: card.order - 1 };
          } else if (draggedIndex > targetIndex && currentIndex >= targetIndex && currentIndex < draggedIndex) {
            return { ...card, order: card.order + 1 };
          }
          return card;
        });
      }
      
      return prev;
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
        const migratedCards = migrateCardsOrder(data.cards);
        setCards(migratedCards);
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
