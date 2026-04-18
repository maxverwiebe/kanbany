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

  const columnCards = cards.filter((card) => card.columnId === column.id);
  const cardCount = columnCards.length;

  const STACK_OFFSET = 10;
  const MAX_STACKED_VISIBLE = 3;

  const addCardInColumn = () => {
    const id = addCard(column.id, newText);
    openModal(id);
  };

  const getStackStyle = (index, total) => {
    const stackIndex = total - 1 - index;
    return {
      transform: `translateY(${stackIndex * STACK_OFFSET}px)`,
      zIndex: total - index,
      opacity: index === total - 1 ? 1 : 0.9,
    };
  };

  const getVisibleCards = () => {
    if (isExpanded) return columnCards;
    if (cardCount <= MAX_STACKED_VISIBLE) return columnCards;
    return columnCards.slice(cardCount - MAX_STACKED_VISIBLE);
  };

  const visibleCards = getVisibleCards();
  const hiddenCount = !isExpanded ? Math.max(0, cardCount - MAX_STACKED_VISIBLE) : 0;
  const shouldShowStackButton = cardCount > MAX_STACKED_VISIBLE;

  const getStackContainerHeight = () => {
    if (isExpanded) return "auto";
    if (cardCount === 0) return "0";
    if (cardCount === 1) return "auto";

    const baseHeight = 80;
    const extraOffset = Math.min(cardCount - 1, MAX_STACKED_VISIBLE - 1) * STACK_OFFSET;
    return `${baseHeight + extraOffset}px`;
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

      <div
        className={`relative ${isExpanded ? "overflow-y-auto max-h-[60vh] pr-1" : "overflow-visible"}`}
        style={{ minHeight: cardCount > 0 ? "80px" : "0" }}
      >
        {!isExpanded && cardCount > 0 && (
          <div
            className="relative"
            style={{
              height: getStackContainerHeight(),
              marginBottom: shouldShowStackButton ? "8px" : "0",
            }}
          >
            {visibleCards.map((card, index) => {
              const isTopCard = index === visibleCards.length - 1;

              return (
                <div
                  key={card.id}
                  style={{
                    ...getStackStyle(index, visibleCards.length),
                    position: "absolute",
                    width: "100%",
                    left: 0,
                    top: 0,
                  }}
                  className="transition-all duration-200"
                >
                  <Card
                    card={card}
                    onClick={onCardClick}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    isStacked={cardCount > MAX_STACKED_VISIBLE}
                    isTopCard={isTopCard}
                  />
                </div>
              );
            })}

            {hiddenCount > 0 && (
              <div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                style={{ zIndex: visibleCards.length + 1 }}
              >
                <span className="text-xs text-gray-500 dark:text-neutral-400 bg-gray-200 dark:bg-neutral-700 px-2 py-0.5 rounded-full">
                  +{hiddenCount}
                </span>
              </div>
            )}
          </div>
        )}

        {isExpanded && (
          <div className="space-y-2">
            {columnCards.map((card) => (
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

        {shouldShowStackButton && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-1.5 px-3 text-xs text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-md flex items-center justify-center gap-1 transition-colors mt-1"
          >
            {isExpanded ? (
              <>
                <FaChevronUp className="text-xs" />
                <span>收起</span>
              </>
            ) : (
              <>
                <FaChevronDown className="text-xs" />
                <span>展开全部</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
