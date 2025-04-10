import { useState } from "react";
import Column from "./Column";
import { v4 as uuid } from "uuid";
import CardModal from "./CardModal";
import i18n from "@/lib/i18n";
import { useBoard } from "@/lib/BoardContext";

import { useToast } from "@/lib/ToastContext";

import ColumnManagerModal from "./ColumnManagerModal";
import LabelManagerModal from "./LabelManagerModal";

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
  } = useBoard();

  const [showColManager, setShowColManager] = useState(false);
  const [showLabelManager, setShowLabelManager] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [draggedId, setDraggedId] = useState(null);

  const { addToast } = useToast();

  const onDragStart = (e, id) => {
    setDraggedId(id);
    e.currentTarget.classList.add("opacity-50");
  };
  const onDragEnd = (e) => {
    e.currentTarget.classList.remove("opacity-50");
    setDraggedId(null);
  };
  const onDragOver = (e) => e.preventDefault();
  const onDrop = (e, newColumnId) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === draggedId ? { ...card, columnId: newColumnId } : card
      )
    );
  };

  const onCardClick = (id) => setModalCardId(id);

  const handlers = {
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
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

  return (
    <div>
      <div className="relative inline-block mb-4">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 shadow-md">
          <h1 className="text-xl font-bold text-gray-800">KANBANY</h1>

          <button
            className="flex items-center justify-center w-10 h-10 text-violet-500 hover:bg-violet-100 rounded-full transition ml-4"
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
          <div className="absolute mt-2 w-48 rounded drop-shadow-lg bg-white text-neutral-700 z-10">
            <button
              className="w-full text-left px-4 py-2 hover:bg-violet-100"
              onClick={handleOpenColManager}
            >
              {i18n.t("column.manage")}
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-violet-100"
              onClick={handleOpenLabelManager}
            >
              {i18n.t("label.manage")}
            </button>
            <div className="h-5"></div>
            <button
              className="w-full text-left px-4 py-2 hover:bg-violet-100"
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
              className="w-full text-left px-4 py-2 hover:bg-violet-100"
              onClick={() => document.getElementById("jsonFileInput").click()}
            >
              {i18n.t("data.import")}
            </button>
          </div>
        )}
      </div>

      <div className="flex space-x-4 overflow-x-auto">
        {columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            cards={cards.filter((c) => c.columnId === col.id)}
            handlers={handlers}
          />
        ))}
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
