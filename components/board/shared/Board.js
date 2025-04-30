import React, { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuid } from "uuid";
import { io } from "socket.io-client";
import { FaUsers, FaHashtag, FaHourglassHalf, FaSignal } from "react-icons/fa";

import i18n from "@/lib/i18n";
import { useBoard } from "@/lib/BoardContext";
import { addToast } from "@/lib/Toast";

import BoardHeader from "../BoardHeader";
import BoardMenu from "../BoardMenu";
import BoardContent from "../BoardContent";
import BoardModals from "../BoardModals";
import PasswordModal from "./PasswordPrompt";
import BoardExpiredModal from "./BoardExpiredModal";
import BoardSkeleton from "@/components/BoardSkeleton";
import CardSearchModal from "../../CardSearchModal";

// Helper to produce a JSON string with sorted keys for deep-equal comparisons
function canonicalize(obj) {
  if (Array.isArray(obj)) {
    return obj.map(canonicalize);
  } else if (obj && typeof obj === "object") {
    return Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key] = canonicalize(obj[key]);
        return acc;
      }, {});
  }
  return obj;
}

export default function Board({ id }) {
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
  } = useBoard();

  const hasFetchedRef = useRef(false);
  const suppressSaveRef = useRef(false);
  const lastUpdateIdRef = useRef(null);
  const socketRef = useRef(null);
  const lastSavedStateRef = useRef("");

  const [showDropdown, setShowDropdown] = useState(false);
  const [showColManager, setShowColManager] = useState(false);
  const [showLabelManager, setShowLabelManager] = useState(false);
  const [showCardSearchModal, setShowCardSearchModal] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(false);

  const [boardError, setBoardError] = useState([true, "n/A"]);
  const [userCount, setUserCount] = useState(1);
  const [boardMetadata, setBoardMetadata] = useState({
    name: "n/a",
    expiresAt: null,
    expireDays: null,
  });

  const [socketStatus, setSocketStatus] = useState("CONNECTING"); // "connected", "disconnected", "connecting"

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const fetchBoardData = useCallback(async () => {
    try {
      const pw = localStorage.getItem("kanbanyShared+" + id) || "";
      const res = await fetch(`/api/shared/${id}`, {
        headers: { "Content-Type": "application/json", xboard_password: pw },
      });
      const data = await res.json();

      if (res.status !== 200) {
        setBoardError([true, data.error]);
        if (data.error === "Invalid password") {
          setShowPasswordModal(true);
          addToast(i18n.t("board.passwordWrong"), "error");
        }
        return;
      }

      //console.log("Board data fetched:", data);

      importBoard(data.data);
      setBoardMetadata({
        name: data.name,
        expiresAt: data.expires_at,
        expireDays: Math.floor(
          (new Date(data.expires_at) - new Date()) / (1000 * 60 * 60 * 24)
        ),
      });

      const initialObj = canonicalize(data.data);
      lastSavedStateRef.current = JSON.stringify(initialObj);

      setBoardError([false, "n/A"]);
      setShowPasswordModal(false);
      addToast(i18n.t("board.loaded"), "success");

      // Socket verbinden
      socketRef.current = io(window.location.origin, {
        path: "/api/shared/socket",
        //transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        randomizationFactor: 0.5,
        timeout: 10000,
      });

      socketRef.current.on("connect", () => {
        socketRef.current.emit("joinBoard", {
          boardId: id,
          password: localStorage.getItem("kanbanyShared+" + id) || "",
        });
        addToast(i18n.t("socket.connected"), "success");
        setSocketStatus("CONNECTED");
      });

      socketRef.current.on("userCount", setUserCount);

      socketRef.current.on("boardUpdated", ({ boardData, updateId }) => {
        if (updateId === lastUpdateIdRef.current) return;
        suppressSaveRef.current = true;
        importBoard(boardData);
        //addToast("UPDATED", "info");
        setTimeout(() => (suppressSaveRef.current = false), 500);
      });

      socketRef.current.on("connect_error", () => {
        addToast(i18n.t("socket.error"), "error");
        setSocketStatus("DISCONNECTED");
      });
    } catch (err) {
      addToast("Error: " + err.message, "error");
    }
  }, [id, importBoard]);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchBoardData();
    return () => {
      socketRef.current?.disconnect();
    };
  }, [fetchBoardData]);

  useEffect(() => {
    if (suppressSaveRef.current) return;
    if (boardError[0]) return;

    const timer = setTimeout(async () => {
      if (suppressSaveRef.current) return;

      const raw = JSON.parse(exportBoard());
      const canon = canonicalize(raw);
      const currentString = JSON.stringify(canon);

      console.log("Autosaving board...");
      //console.log("Current JSON:", currentString);
      //console.log("Last saved JSON:", lastSavedStateRef.current);

      if (currentString === lastSavedStateRef.current) {
        console.log("No changes detected, skipping save");
        return;
      }

      const updateId = uuid();
      lastUpdateIdRef.current = updateId;

      lastSavedStateRef.current = currentString;

      const body = JSON.stringify({
        data: JSON.parse(currentString),
        password: localStorage.getItem("kanbanyShared+" + id) || "",
        updateId,
      });

      try {
        const res = await fetch(`/api/shared/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });
        const result = await res.json();
        addToast(
          res.status === 201
            ? i18n.t("board.saved")
            : i18nt.t("general.error") + " " + result.error,
          res.status === 201 ? "success" : "error"
        );
      } catch (err) {
        addToast(i18n.t("serverSavingError", { error: err.message }), "error");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [columns, cards, labels, id]);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    const enabled = stored === "true";
    setIsDarkMode(enabled);
    document.documentElement.classList.toggle("dark", enabled);
  }, []);

  const handlers = {
    toggleDropdown: () => setShowDropdown((v) => !v),
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
      const blob = new Blob([exportBoard()], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "board_export.json";
      a.click();
      URL.revokeObjectURL(url);
      addToast(i18n.t("data.toastExportSuccess"), "success");
    },
    importFile: (file) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          importBoard(JSON.parse(reader.result));
          addToast(i18n.t("data.toastImportSuccess"), "success");
        } catch (e) {
          addToast(
            i18n.t("data.toastImportError", { error: e.message }),
            "error"
          );
        }
      };
      reader.readAsText(file);
    },
    onCardClick: (cardId) => openModal(cardId),
    hideShowDropdown: () => setShowDropdown(false),
    copyBoardURL: () => {
      navigator.clipboard.writeText(window.location.href);
      addToast(i18n.t("board.copyLinkSuccess"), "success");
    },
    showCardSearchModal: () => {
      setShowCardSearchModal(true);
    },
  };

  const handlePasswordConfirm = (pw) => {
    localStorage.setItem("kanbanyShared+" + id, pw);
    setShowPasswordModal(false);
    fetchBoardData();
  };

  const handlePasswordCancel = () => {
    //setShowPasswordModal(false);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen">
      <BoardHeader showDropdown={showDropdown} handlers={handlers} />
      {showDropdown && (
        <BoardMenu handlers={handlers} isDarkMode={isDarkMode} />
      )}
      <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 px-6 py-3 space-x-6 shadow-md mb-4 rounded-md">
        <div className="flex items-center space-x-2">
          <FaHashtag className="w-5 h-5 text-neutral-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {boardMetadata.name}
          </span>
        </div>

        <div className="h-6 border-l border-neutral-300 dark:border-neutral-600" />

        <div className="flex items-center space-x-2">
          <FaUsers className="w-5 h-5 text-neutral-500" />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {userCount}{" "}
            {userCount === 1 ? "Online Participant" : "Online Participants"}
          </span>
        </div>

        <div className="h-6 border-l border-neutral-300 dark:border-neutral-600" />

        <div className="flex items-center space-x-2">
          <FaHourglassHalf className="w-5 h-5 text-neutral-500" />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {boardMetadata.expireDays} Days
          </span>
        </div>

        <div className="h-6 border-l border-neutral-300 dark:border-neutral-600" />

        <div className="flex items-center space-x-2">
          <FaSignal className="w-5 h-5 text-neutral-500" />
          {socketStatus === "CONNECTED" ? (
            <span className="text-xs font-medium text-green-700 dark:text-green-200 font-mono">
              {i18n.t("socket.statusConnected")}
            </span>
          ) : socketStatus === "CONNECTING" ? (
            <span className="text-xs font-medium text-yellow-700 dark:text-yellow-200 font-mono">
              {i18n.t("socket.statusConnecting")}
            </span>
          ) : (
            <span className="text-xs font-medium text-red-700 dark:text-red-200 font-mono">
              {i18n.t("socket.statusDisconnected")}
            </span>
          )}
        </div>
      </div>

      {boardError[0] ? (
        <>
          <div className="text-red-500 dark:text-red-400 px-4">
            Error: {boardError[1]}
          </div>

          <BoardSkeleton></BoardSkeleton>
        </>
      ) : (
        <>
          <BoardContent columns={columns} cards={cards} handlers={handlers} />
          <BoardModals
            board={{
              columns,
              cards,
              labels,
              updateCard,
              closeModal,
              modalCardId,
              setColumns,
              setCards,
              setLabels,
            }}
            showColManager={showColManager}
            setShowColManager={setShowColManager}
            showLabelManager={showLabelManager}
            setShowLabelManager={setShowLabelManager}
          />
        </>
      )}

      <CardSearchModal
        isOpen={showCardSearchModal}
        onClose={(cardID) => {
          if (cardID) {
            const card = cards.find((c) => c.id === cardID);
            if (card) {
              openModal(cardID);
            }
          }

          setShowCardSearchModal(false);
        }}
      ></CardSearchModal>

      <PasswordModal
        isOpen={showPasswordModal}
        onConfirm={handlePasswordConfirm}
        onCancel={handlePasswordCancel}
      />

      <BoardExpiredModal
        isOpen={
          boardMetadata.expiresAt &&
          new Date() > new Date(boardMetadata.expiresAt)
        }
        onClose={() => setBoardError([true, "Board expired"])}
      />
    </div>
  );
}
