import React from "react";
import Labels from "./Labels";
import { useBoard } from "@/lib/BoardContext";
import {
  MdOutlineCheckBox,
  MdFormatAlignLeft,
  MdEvent,
  MdOutlineEditCalendar,
} from "react-icons/md";

export default function Card({ card }) {
  const { openModal, onDragStart, onDragEnd } = useBoard();

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const calculateChecklistProgress = () => {
    const lists = Array.isArray(card?.checklist) ? card.checklist : [];
    let total = 0;
    let completed = 0;

    lists.forEach(({ tasks = [] }) => {
      total += tasks.length;
      completed += tasks.filter((t) => t.completed).length;
    });

    return total > 0 ? `${completed}/${total}` : null;
  };
  const checklistProgress = calculateChecklistProgress();

  const formatDueDate = (ts) => {
    const date = new Date(ts);
    const day = date.getDate();
    const monthName = date.toLocaleString(undefined, { month: "short" });
    const ordinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    return `${ordinal(day)} ${monthName}`;
  };

  const getDueState = (ts) => {
    const date = new Date(ts);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return "overdue";
    if (date.toDateString() === today.toDateString()) return "today";
    return "normal";
  };

  const state = card.dueDate ? getDueState(card.dueDate) : null;
  const colorMap = {
    overdue: "bg-red-500 text-white",
    today: "bg-yellow-400 text-gray-800",
    normal:
      "bg-neutral-200 text-gray-800 dark:bg-neutral-600 dark:text-neutral-200",
  };

  return (
    <div
      className="bg-white p-2 mb-2 rounded shadow cursor-pointer w-full dark:bg-neutral-700 dark:text-neutral-200"
      draggable
      onClick={() => openModal(card.id)}
      onDragStart={(e) => onDragStart(e, card.id)}
      onDragEnd={onDragEnd}
      data-card-id={card.id}
    >
      <h3 className="font-medium mb-1">{truncateText(card.text, 25)}</h3>

      <Labels labelIds={card.labels} />

      <div className="flex items-center space-x-2 text-sm mt-1">
        {card.description && (
          <MdFormatAlignLeft className="text-gray-400 dark:text-neutral-400" />
        )}
        {checklistProgress && (
          <div className="flex items-center text-gray-500 dark:text-neutral-400">
            <span>{checklistProgress}</span>
            <MdOutlineCheckBox className="ml-1 text-lg text-gray-400 dark:text-neutral-400" />
          </div>
        )}
        {card.dueDate && (
          <div
            className={`flex items-center px-3 py-1 rounded-md ${colorMap[state]}`}
          >
            <MdOutlineEditCalendar className="mr-1" size={14} />
            <span className="leading-none">{formatDueDate(card.dueDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
