import React, { useRef, useEffect } from "react";
import i18n from "@/lib/i18n";
import ToggleSwitch from "../basic/ToggleSwitch";
import {
  MdViewColumn,
  MdLabel,
  MdCalendarMonth,
  MdDownload,
  MdUpload,
  MdDarkMode,
} from "react-icons/md";

export default function BoardMenu({ isOpen, handlers, isDarkMode }) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const fn = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        handlers.hideShowDropdown();
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [isOpen, handlers]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute top-full right-0 mt-2 w-full sm:w-80 md:w-96
                 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-900
                 shadow-md p-4 space-y-6 z-50"
    >
      <div>
        <h3
          className="text-xs font-semibold uppercase mb-2
                       text-neutral-500 dark:text-neutral-400"
        >
          {i18n.t("general.boardTools")}
        </h3>

        <button
          onClick={handlers.openColManager}
          className="flex items-center w-full px-3 py-2 rounded-md
                     hover:bg-violet-100 dark:hover:bg-neutral-700 transition"
        >
          <MdViewColumn className="mr-2 text-violet-600 dark:text-violet-400" />
          <span
            className="text-sm font-medium truncate
                           text-neutral-800 dark:text-neutral-200"
          >
            {i18n.t("column.manage")}
          </span>
        </button>

        <button
          onClick={handlers.openLabelManager}
          className="flex items-center w-full px-3 py-2 rounded-md
                     hover:bg-violet-100 dark:hover:bg-neutral-700 transition"
        >
          <MdLabel className="mr-2 text-violet-600 dark:text-violet-400" />
          <span
            className="text-sm font-medium truncate
                           text-neutral-800 dark:text-neutral-200"
          >
            {i18n.t("label.manage")}
          </span>
        </button>

        <button
          onClick={handlers.openCalendar}
          className="flex items-center w-full px-3 py-2 rounded-md
                     hover:bg-violet-100 dark:hover:bg-neutral-700 transition"
        >
          <MdCalendarMonth className="mr-2 text-violet-600 dark:text-violet-400" />
          <span
            className="text-sm font-medium truncate
                           text-neutral-800 dark:text-neutral-200"
          >
            {i18n.t("calendar.open")}
          </span>
        </button>
      </div>

      <div>
        <h3
          className="text-xs font-semibold uppercase mb-2
                       text-neutral-500 dark:text-neutral-400"
        >
          {i18n.t("general.appearance")}
        </h3>

        <div
          className="flex items-center justify-between px-3 py-2 rounded-md
                     hover:bg-violet-100 dark:hover:bg-neutral-700 transition"
        >
          <div className="flex items-center">
            <MdDarkMode className="mr-2 text-violet-600 dark:text-violet-400" />
            <span
              className="text-sm font-medium
                             text-neutral-800 dark:text-neutral-200"
            >
              {i18n.t("general.darkMode")}
            </span>
          </div>
          <ToggleSwitch
            initial={isDarkMode}
            onToggle={handlers.toggleDarkMode}
          />
        </div>
      </div>

      <div>
        <h3
          className="text-xs font-semibold uppercase mb-2
                       text-neutral-500 dark:text-neutral-400"
        >
          {i18n.t("general.data")}
        </h3>

        <button
          onClick={handlers.exportData}
          className="flex items-center w-full px-3 py-2 rounded-md
                     hover:bg-violet-100 dark:hover:bg-neutral-700 transition"
        >
          <MdDownload className="mr-2 text-violet-600 dark:text-violet-400" />
          <span
            className="text-sm font-medium truncate
                           text-neutral-800 dark:text-neutral-200"
          >
            {i18n.t("data.export")}
          </span>
        </button>

        <input
          id="jsonFileInput"
          type="file"
          accept=".json"
          className="hidden"
          onChange={(e) => handlers.importFile(e.target.files?.[0])}
        />

        <button
          onClick={() => document.getElementById("jsonFileInput")?.click()}
          className="flex items-center w-full px-3 py-2 rounded-md
                     hover:bg-violet-100 dark:hover:bg-neutral-700 transition"
        >
          <MdUpload className="mr-2 text-violet-600 dark:text-violet-400" />
          <span
            className="text-sm font-medium truncate
                           text-neutral-800 dark:text-neutral-200"
          >
            {i18n.t("data.import")}
          </span>
        </button>
      </div>
    </div>
  );
}
