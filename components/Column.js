import { useState } from "react";
import Card from "./Card";
import { useBoard } from "@/lib/BoardContext";
import { FaRegStickyNote, FaChevronDown, FaChevronUp } from "react-icons/fa";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_VISIBLE_CARDS = 4;

  const columnCards = cards.filter((card) => card.columnId === column.id);
  const cardCount = columnCards.length;
  const shouldStack = cardCount > MAX_VISIBLE_CARDS && !isExpanded;

  const addCardInColumn = () => {
    const id = addCard(column.id, newText);
    openModal(id);
  };

  const getStackedCards = () => {
    if (!shouldStack) return columnCards;
    return columnCards.slice(0, MAX_VISIBLE_CARDS);
  };

  const getStackStyle = (index) => {
    if (!shouldStack) return {};
    const stackIndex = MAX_VISIBLE_CARDS - 1 - index;
    return {
      transform: `translateY(${stackIndex * 8}px) scale(${1 - stackIndex * 0.03})`,
      zIndex: MAX_VISIBLE_CARDS - index,
      opacity: 1 - stackIndex * 0.1,
    };
  };

  const stackedCards = getStackedCards();
  const hiddenCount = shouldStack ? cardCount - MAX_VISIBLE_CARDS : 0;

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

      <div className={`flex-1 ${isExpanded ? "overflow-y-auto max-h-[70vh]" : "overflow-visible"}`}>
        <div className={shouldStack ? "relative" : ""}>
          {stackedCards.map((card, index) => (
            <div
              key={card.id}
              style={getStackStyle(index)}
              className={shouldStack ? "relative transition-all duration-300" : ""}
            >
              <Card
                card={card}
                onClick={onCardClick}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                isStacked={shouldStack}
                stackIndex={index}
              />
            </div>
          ))}
        </div>

        {!isExpanded && shouldStack && (
          <div className="mt-4">
            {columnCards.slice(MAX_VISIBLE_CARDS).slice(0, 2).map((card, index) => (
              <div
                key={card.id}
                className="bg-white/50 dark:bg-neutral-700/50 p-1.5 mb-1 rounded cursor-default overflow-hidden transition-all duration-300 hover:bg-white/70 dark:hover:bg-neutral-700/70"
                style={{
                  transform: `translateX(${(index + 1) * 4}px)`,
                  opacity: 0.6 - index * 0.1,
                }}
              >
                <p className="text-xs text-gray-600 dark:text-neutral-400 truncate">
                  {card.text?.substring(0, 20) || "..."}
                </p>
              </div>
            ))}
            {hiddenCount > 2 && (
              <div className="text-xs text-gray-500 dark:text-neutral-400 text-center mt-1">
                +{hiddenCount - 2} {hiddenCount - 2 === 1 ? "more" : "more"}
              </div>
            )}
          </div>
        )}

        {isExpanded && cardCount > MAX_VISIBLE_CARDS && (
          <div className="mt-2">
            {columnCards.slice(MAX_VISIBLE_CARDS).map((card) => (
              <Card
                key={card.id}
                card={card}
                onClick={onCardClick}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              />
            ))}
          </div>
        )}

        {cardCount > MAX_VISIBLE_CARDS && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 w-full py-2 px-3 text-sm text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-md flex items-center justify-center gap-1.5 transition-colors"
          >
            {isExpanded ? (
              <>
                <FaChevronUp className="text-xs" />
                <span>收起</span>
              </>
            ) : (
              <>
                <FaChevronDown className="text-xs" />
                <span>显示全部 ({cardCount})</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
