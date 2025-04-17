import { useEffect, useState } from "react";
import Column from "./Column";
import { v4 as uuid } from "uuid";
import CardModal from "./CardModal";
import i18n from "@/lib/i18n";
import { useBoard } from "@/lib/BoardContext";

import { addToast } from "@/lib/Toast";

import ColumnManagerModal from "./ColumnManagerModal";
import LabelManagerModal from "./LabelManagerModal";
import ToggleSwitch from "./basic/ToggleSwitch";
import LocalStorageSaver from "@/lib/LocalStorageSaver";

export default function Board() {
  const {
    columns,
    cards,
    addColumn,
    addCard,
    modalCardId,
    updateCard,
    openModal,
    closeModal,
    importBoard,
    exportBoard,
    setColumns,
    setCards,
    setLabels,
    labels,
  } = useBoard();

  const [showColManager, setShowColManager] = useState(false);
  const [showLabelManager, setShowLabelManager] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(false);

  const [importChecked, setImportChecked] = useState(false);

  const onCardClick = (id) => setModalCardId(id);

  const handlers = {
    onCardClick,
  };

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const handleOpenColManager = () => {
    setShowColManager(true);
    setShowDropdown(false);
  };

  const handleOpenLabelManager = () => {
    setShowLabelManager(true);
    setShowDropdown(false);
  };

  const handleDarkModeToggle = () => {
    const value = !isDarkMode;
    setIsDarkMode(value);
    localStorage.setItem("darkMode", value.toString());
    document.documentElement.classList.toggle("dark", value);
  };

  const handleFileExport = () => {
    const jsonString = exportBoard();
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "board_export.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast(i18n.t("data.toastExportSuccess"), "success");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        importBoard(jsonData);
        addToast(i18n.t("data.toastImportSuccess"), "success");
      } catch (err) {
        console.error("Error while parsing JSON data: ", err);
        addToast(i18n.t("data.toastImportError", { error: err }), "error");
      }
    };
    reader.readAsText(file);
  };

  const { ImportLocalStorage, ExportLocalStorage } = LocalStorageSaver();
  useEffect(() => {
    if (!importChecked) return;
    const jsonString = exportBoard();
    ExportLocalStorage(jsonString);
  }, [columns, cards, labels]);

  useEffect(() => {
    const loadLocalData = async () => {
      const localData = ImportLocalStorage();
      if (localData) {
        await importBoard(localData);
        addToast(i18n.t("data.toastImportSuccessLS"), "success");
      }
      setImportChecked(true);
    };

    loadLocalData();
  }, []);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) {
      const darkEnabled = storedDarkMode === "true";
      setIsDarkMode(darkEnabled);
      document.documentElement.classList.toggle("dark", darkEnabled);
    }
  }, []);

  return (
    <div className="flex flex-col bg-white dark:bg-neutral-900">
      <div>
        <div className="relative inline-block mb-4">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-100 shadow-md rounded-md dark:bg-neutral-800">
            <h1 className="text-xl font-bold text-gray-800 dark:text-neutral-200">
              KANBANY
            </h1>
            <button
              className="flex items-center justify-center w-10 h-10 text-violet-500 dark:text-violet-300 hover:bg-violet-100  dark:hover:bg-violet-900 rounded-full transition ml-4"
              onClick={toggleDropdown}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5"
                />
              </svg>
            </button>
          </div>

          {showDropdown && (
            <div className="absolute mt-2 w-48 rounded drop-shadow-lg bg-neutral-50 text-neutral-700 z-10 dark:bg-neutral-800">
              <button
                className="w-full text-left px-4 py-2 hover:bg-violet-100 rounded dark:text-neutral-200 dark:hover:bg-violet-950"
                onClick={handleOpenColManager}
              >
                {i18n.t("column.manage")}
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-violet-100 rounded dark:text-neutral-200 dark:hover:bg-violet-950"
                onClick={handleOpenLabelManager}
              >
                {i18n.t("label.manage")}
              </button>
              <div className="h-5"></div>
              <div className="w-full text-left px-4 py-2 hover:bg-violet-100 flex justify-between items-center dark:text-neutral-200 dark:hover:bg-violet-950">
                <span>{i18n.t("general.darkMode")}</span>
                <ToggleSwitch
                  initial={isDarkMode}
                  onToggle={handleDarkModeToggle}
                />
              </div>
              <div className="h-5"></div>
              <button
                className="w-full text-left px-4 py-2 hover:bg-violet-100 rounded dark:text-neutral-200 dark:hover:bg-violet-950"
                onClick={handleFileExport}
              >
                {i18n.t("data.export")}
              </button>
              <input
                id="jsonFileInput"
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                className="w-full text-left px-4 py-2 hover:bg-violet-100 rounded dark:text-neutral-200 dark:hover:bg-violet-950"
                onClick={() => document.getElementById("jsonFileInput").click()}
              >
                {i18n.t("data.import")}
              </button>
            </div>
          )}
        </div>

        <main className="flex-grow">
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 overflow-x-auto">
            {columns.map((col) => (
              <Column
                key={col.id}
                column={col}
                cards={cards.filter((c) => c.columnId === col.id)}
                handlers={handlers}
              />
            ))}

            <div className="group">
              <div className="flex-shrink-0 w-64 h-full bg-gray-100/0 p-4 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <button
                  className="flex items-center justify-center w-full h-full text-violet-500 hover:bg-violet-100 rounded transition dark:hover:bg-violet-950"
                  onClick={() => {
                    setShowColManager(true);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  <span className="ml-2">{i18n.t("column.add")}</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {modalCardId && (
        <CardModal
          card={cards.find((c) => c.id === modalCardId)}
          onSave={updateCard}
          onClose={closeModal}
        />
      )}

      {showColManager && (
        <ColumnManagerModal onClose={() => setShowColManager(false)} />
      )}
      {showLabelManager && (
        <LabelManagerModal onClose={() => setShowLabelManager(false)} />
      )}
    </div>
  );
}
