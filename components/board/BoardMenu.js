import React, { useRef, useEffect } from "react";
import i18n from "@/lib/i18n";
import ToggleSwitch from "../basic/ToggleSwitch";

export default function BoardMenu({ handlers, isDarkMode }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handlers.hideShowDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handlers]);

  return (
    <div className="relative w-full" ref={menuRef}>
      <div className="absolute top-full right-1 w-full md:w-48 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 rounded-lg shadow-2xl z-10 dark:border-neutral-900 dark:border">
        <div className="py-1 flex flex-col">
          <button
            className="w-full text-left px-4 py-2 hover:bg-violet-100 dark:hover:bg-violet-950 rounded"
            onClick={handlers.openColManager}
          >
            {i18n.t("column.manage")}
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-violet-100 dark:hover:bg-violet-950 rounded"
            onClick={handlers.openLabelManager}
          >
            {i18n.t("label.manage")}
          </button>
          <div className="border-t border-neutral-200 dark:border-neutral-700 my-1" />
          <div className="w-full flex items-center justify-between px-4 py-2 hover:bg-violet-100 dark:hover:bg-violet-950 rounded">
            <span>{i18n.t("general.darkMode")}</span>
            <ToggleSwitch
              initial={isDarkMode}
              onToggle={handlers.toggleDarkMode}
            />
          </div>
          <div className="border-t border-neutral-200 dark:border-neutral-700 my-1" />
          <button
            className="w-full text-left px-4 py-2 hover:bg-violet-100 dark:hover:bg-violet-950 rounded"
            onClick={handlers.exportData}
          >
            {i18n.t("data.export")}
          </button>
          <input
            id="jsonFileInput"
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => handlers.importFile(e.target.files[0])}
          />
          <button
            className="w-full text-left px-4 py-2 hover:bg-violet-100 dark:hover:bg-violet-950 rounded"
            onClick={() => document.getElementById("jsonFileInput").click()}
          >
            {i18n.t("data.import")}
          </button>
        </div>
      </div>
    </div>
  );
}
