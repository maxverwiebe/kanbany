import React, { useState, useEffect, useRef } from "react";
import {
  MdClose,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { useBoard } from "@/lib/BoardContext";

export default function CalendarModal({ isOpen, onClose }) {
  const { cards, openModal } = useBoard();

  const [month, setMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [expandedDay, setExpandedDay] = useState(null);
  const modalRef = useRef(null);

  const year = month.getFullYear();
  const mon = month.getMonth();
  const firstDay = new Date(year, mon, 1).getDay();
  const daysInMonth = new Date(year, mon + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  const days = Array.from({ length: totalCells }, (_, i) => i - firstDay + 1);
  const grouped = cards.reduce((a, c) => {
    if (!c.dueDate) return a;
    const k = new Date(c.dueDate).toDateString();
    (a[k] = a[k] || []).push(c);
    return a;
  }, {});

  const changeMonth = (d) => {
    setMonth(new Date(year, mon + d, 1));
    setExpandedDay(null);
  };

  useEffect(() => {
    const key = (e) => e.key === "Escape" && onClose();
    if (isOpen) document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [isOpen, onClose]);

  useEffect(() => {
    const click = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    };
    if (isOpen) document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const DayCell = ({ day, idx }) => {
    const inMonth = day >= 1 && day <= daysInMonth;
    const date = inMonth ? new Date(year, mon, day) : null;
    const key = date?.toDateString();
    const dayEvents = key && grouped[key] ? grouped[key] : [];
    const isToday = date?.getTime() === today.getTime();
    const isOpenDay = expandedDay === key;
    const shown = isOpenDay ? dayEvents : dayEvents.slice(0, 2);
    const extra = dayEvents.length - shown.length;

    return (
      <div
        key={idx}
        className={`relative flex flex-col h-24 p-1 sm:p-2 overflow-hidden mb-0.5 ${
          inMonth ? "" : "bg-neutral-100 dark:bg-neutral-900 text-neutral-400"
        } ${
          isToday
            ? "dark:bg-violet-900/50 bg-violet-100"
            : "bg-white dark:bg-neutral-800"
        }`}
      >
        {inMonth && (
          <div className="flex items-center justify-between text-xs font-medium mb-1">
            <span
              className={
                isToday
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-neutral-600 dark:text-neutral-400"
              }
            >
              {day}
            </span>
            {extra > 0 && (
              <button
                onClick={() => setExpandedDay(isOpenDay ? null : key)}
                className="text-[10px] leading-none text-violet-500 hover:underline"
              >
                {isOpenDay ? "Collapse" : `+${extra}`}
              </button>
            )}
          </div>
        )}
        <div className="flex-1 space-y-1 overflow-y-auto pr-0.5">
          {shown.map((c) => (
            <div
              key={c.id}
              onClick={() => {
                onClose();
                openModal(c.id);
              }}
              className="truncate px-1 py-[2px] bg-violet-100 dark:bg-violet-400 text-[10px] rounded hover:bg-violet-200 dark:hover:bg-violet-500 cursor-pointer"
            >
              {c.text.length > 14 ? `${c.text.slice(0, 14)}…` : c.text}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const MobileDay = ({ dayNum }) => {
    const date = new Date(year, mon, dayNum);
    const key = date.toDateString();
    const events = grouped[key] || [];
    const isToday = date.getTime() === today.getTime();
    const isOpenDay = expandedDay === key;
    const shown = isOpenDay ? events : events.slice(0, 4);
    const extra = events.length - shown.length;

    return (
      <div
        key={dayNum}
        className={`px-4 py-3 flex flex-col gap-1 ${
          isToday
            ? "dark:bg-violet-900/50 bg-violet-100"
            : "text-neutral-800 dark:text-neutral-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div
            className={`text-sm font-semibold ${
              isToday
                ? "dark:text-violet-300 text-violet-600"
                : "text-neutral-800 dark:text-neutral-200"
            }`}
          >
            {dayNum}
          </div>
          {extra > 0 && (
            <button
              onClick={() => setExpandedDay(isOpenDay ? null : key)}
              className="text-xs text-violet-500 hover:underline"
            >
              {isOpenDay ? "Collapse" : `+${extra}`}
            </button>
          )}
        </div>
        <div className="space-y-1">
          {shown.map((c) => (
            <div
              key={c.id}
              onClick={() => {
                onClose();
                openModal(c.id);
              }}
              className="truncate px-2 py-[3px] bg-violet-100 dark:bg-violet-400 dark:text-neutral-900 text-xs rounded hover:bg-violet-200 dark:hover:bg-violet-500 cursor-pointer"
            >
              {c.text.length > 24 ? `${c.text.slice(0, 24)}…` : c.text}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        ref={modalRef}
        className="relative bg-white dark:bg-neutral-800 shadow-2xl rounded-md w-full max-w-md md:max-w-3xl lg:max-w-5xl h-full sm:h-[90vh] flex flex-col overflow-hidden"
      >
        <header className="flex items-center gap-1 p-4">
          <button
            aria-label="Previous month"
            onClick={() => changeMonth(-1)}
            className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 text-violet-600 dark:text-violet-400"
          >
            <MdKeyboardArrowLeft size={22} />
          </button>
          <h2 className="flex-1 text-center text-lg sm:text-xl font-semibold select-none text-violet-600 dark:text-violet-400">
            {month.toLocaleString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button
            aria-label="Next month"
            onClick={() => changeMonth(1)}
            className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 text-violet-600 dark:text-violet-400"
          >
            <MdKeyboardArrowRight size={22} />
          </button>
          <button
            aria-label="Close calendar"
            onClick={onClose}
            className="ml-2 p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-300"
          >
            <MdClose size={22} />
          </button>
        </header>

        <div className="hidden sm:block">
          <div className="grid grid-cols-7 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-2 select-none">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 auto-rows-fr gap-px bg-neutral-200 dark:bg-neutral-700 h-[calc(100%-2.5rem)] overflow-y-auto">
            {days.map((day, idx) => (
              <DayCell key={idx} day={day} idx={idx} />
            ))}
          </div>
        </div>

        <div className="sm:hidden flex-1 overflow-y-auto divide-y divide-neutral-200 dark:divide-neutral-700">
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
            <MobileDay key={d} dayNum={d} />
          ))}
        </div>
      </div>
    </div>
  );
}
