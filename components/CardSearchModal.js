import React, { useState, useEffect, useRef } from "react";
import {
  MdSearch,
  MdClose,
  MdOutlineCheckBox,
  MdFormatAlignLeft,
} from "react-icons/md";
import Labels from "./Labels";
import { useBoard } from "@/lib/BoardContext";

export default function CardSearchModal({ isOpen, onClose }) {
  const { cards } = useBoard();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
    } else {
      const lower = query.toLowerCase();
      setResults(
        cards
          .filter((card) => card.text.toLowerCase().includes(lower))
          .map((card) => ({
            ...card,
            highlighted: card.text.replace(
              new RegExp(`(${lower})`, "gi"),
              "<mark class='bg-yellow-200 dark:bg-yellow-600 rounded'>$1</mark>"
            ),
          }))
      );
    }
  }, [query, cards]);

  const calculateChecklistProgress = (card) => {
    const { checklist } = card;
    if (!checklist || !Array.isArray(checklist)) return null;
    let total = 0;
    let done = 0;
    checklist.forEach((list) => {
      if (list.tasks) {
        total += list.tasks.length;
        done += list.tasks.filter((t) => t.completed).length;
      }
    });
    return total ? `${done}/${total}` : null;
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="relative bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-lg w-full p-6 space-y-6">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
            <MdSearch size={24} />
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cards..."
                className="peer w-full bg-transparent border-b-2 border-neutral-300 dark:border-neutral-600 placeholder-transparent py-2 focus:outline-none focus:border-indigo-500 transition"
              />
              <label
                className="absolute left-0 -top-2.5 text-sm text-neutral-500 dark:text-neutral-400
                  peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400
                  peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-500
                  transition-all pointer-events-none"
              >
                Search cards...
              </label>
            </div>
            <button onClick={onClose}>
              <MdClose
                size={24}
                className="text-neutral-500 dark:text-neutral-400 hover:text-indigo-500 transition"
              />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-4">
            {results.length ? (
              results.map((card) => {
                const progress = calculateChecklistProgress(card);
                return (
                  <div
                    key={card.id}
                    onClick={() => onClose(card.id)}
                    className="cursor-pointer p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg shadow hover:shadow-md transition dark:text-neutral-200"
                  >
                    <div
                      className="prose prose-sm dark:prose-invert mb-2"
                      dangerouslySetInnerHTML={{ __html: card.highlighted }}
                    />
                    {card.labels && card.labels.length > 0 && (
                      <div className="mb-2">
                        <Labels labelIds={card.labels} />
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600 dark:text-neutral-400">
                      {card.description && (
                        <MdFormatAlignLeft className="mr-3 text-lg" />
                      )}
                      {progress && (
                        <div className="flex items-center">
                          <span>{progress}</span>
                          <MdOutlineCheckBox className="ml-1 text-lg" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-neutral-500 dark:text-neutral-400 mt-4">
                {query.trim() ? "No matches found" : "Type to search cards..."}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
