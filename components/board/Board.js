import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import i18n from "@/lib/i18n";
import { useBoard } from "@/lib/BoardContext";
import LocalStorageSaver from "@/lib/LocalStorageSaver";
import { addToast } from "@/lib/Toast";

import BoardHeader from "./BoardHeader";
import BoardMenu from "./BoardMenu";
import BoardContent from "./BoardContent";
import BoardModals from "./BoardModals";

export default function Board() {
  const board = useBoard();
  const {
    columns,
    cards,
    labels,
    exportBoard,
    importBoard,
    updateCard,
    openModal,
    closeModal,
    modalCardId,
    setColumns,
    setCards,
    setLabels,
  } = board;

  const [showColManager, setShowColManager] = useState(false);
  const [showLabelManager, setShowLabelManager] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [importChecked, setImportChecked] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { ImportLocalStorage, ExportLocalStorage } = LocalStorageSaver();
  useEffect(() => {
    if (!importChecked) return;
    ExportLocalStorage(exportBoard());
  }, [columns, cards, labels]);

  useEffect(() => {
    const loadLocal = async () => {
      const data = ImportLocalStorage();
      if (data) {
        await importBoard(data);
        addToast(i18n.t("data.toastImportSuccessLS"), "success");
      }
      setImportChecked(true);
    };
    loadLocal();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) {
      const enabled = stored === "true";
      setIsDarkMode(enabled);
      document.documentElement.classList.toggle("dark", enabled);
    }
  }, []);

  const handlers = {
    toggleDropdown: () => setShowDropdown((prev) => !prev),
    openColManager: () => {
      setShowColManager(true);
      setShowDropdown(false);
    },
    openLabelManager: () => {
      setShowLabelManager(true);
      setShowDropdown(false);
    },
    toggleDarkMode: () => {
      const val = !isDarkMode;
      setIsDarkMode(val);
      localStorage.setItem("darkMode", val.toString());
      document.documentElement.classList.toggle("dark", val);
    },
    exportFile: () => {
      const json = exportBoard();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "board_export.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      addToast(i18n.t("data.toastExportSuccess"), "success");
    },
    importFile: (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          importBoard(json);
          addToast(i18n.t("data.toastImportSuccess"), "success");
        } catch (err) {
          console.error(err);
          addToast(i18n.t("data.toastImportError", { error: err }), "error");
        }
      };
      reader.readAsText(file);
    },
    onCardClick: (id) => board.setModalCardId(id),
    hideShowDropdown: () => setShowDropdown(false),
  };

  return (
    <div className=" bg-white dark:bg-neutral-900">
      <BoardHeader showDropdown={showDropdown} handlers={handlers} />

      {showDropdown && (
        <BoardMenu handlers={handlers} isDarkMode={isDarkMode} />
      )}

      <BoardContent
        columns={columns}
        cards={cards}
        handlers={handlers}
        openColManager={() => setShowColManager(true)}
      />

      <BoardModals
        board={board}
        showColManager={showColManager}
        setShowColManager={setShowColManager}
        showLabelManager={showLabelManager}
        setShowLabelManager={setShowLabelManager}
      />
    </div>
  );
}
