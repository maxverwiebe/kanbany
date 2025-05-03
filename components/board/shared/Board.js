"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { FaUsers, FaHashtag, FaHourglassHalf, FaSignal } from "react-icons/fa";

import { socket } from "@/lib/Socket";

import i18n from "@/lib/i18n";
import { useBoard } from "@/lib/BoardContext";
import { addToast } from "@/lib/Toast";
import { isMac } from "@/lib/Platform";

import BoardHeader from "../BoardHeader";
import BoardMenu from "../BoardMenu";
import BoardContent from "../BoardContent";
import BoardModals from "../BoardModals";
import PasswordModal from "./PasswordPrompt";
import BoardExpiredModal from "./BoardExpiredModal";
import BoardSkeleton from "@/components/BoardSkeleton";
import CardSearchModal from "../../CardSearchModal";

////////////////////////////////////////////////////////////////////////////////
// Helpers
////////////////////////////////////////////////////////////////////////////////

/**
 * Return a new object/array with deterministic key ordering – useful to
 * guarantee stable JSON.stringify results for deep‑equals or caching.
 */
function canonicalize(obj) {
  if (Array.isArray(obj)) return obj.map(canonicalize);
  if (obj && typeof obj === "object") {
    return Object.keys(obj)
      .sort()
      .reduce((acc, k) => {
        acc[k] = canonicalize(obj[k]);
        return acc;
      }, {});
  }
  return obj;
}

function useBoardSocket({
  boardId,
  password,
  importBoard,
  onUserCount,
  onStatus,
}) {
  const lastUpdateId = useRef(null);
  const suppressSave = useRef(false);

  useEffect(() => {
    if (!boardId) return;

    if (!socket.connected) socket.connect("socket.kanbany.app");

    const handleConnect = () => {
      socket.emit("joinBoard", { boardId, password });
      addToast(i18n.t("socket.connected"), "success");
      onStatus("CONNECTED");
    };

    const handleDisconnect = () => onStatus("DISCONNECTED");
    const handleConnectError = () => {
      addToast(i18n.t("socket.error"), "error");
      onStatus("DISCONNECTED");
    };

    const handleBoardUpdated = ({ boardData, updateId }) => {
      if (updateId === lastUpdateId.current) return; // already applied
      suppressSave.current = true;
      importBoard(boardData);
      setTimeout(() => (suppressSave.current = false), 500); // small grace period
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("userCount", onUserCount);
    socket.on("boardUpdated", handleBoardUpdated);

    return () => {
      socket.emit("leaveBoard", { boardId });
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("userCount", onUserCount);
      socket.off("boardUpdated", handleBoardUpdated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, password]);

  return { lastUpdateId, suppressSave };
}

function useDebouncedEffect(cb, deps, delay) {
  const cbRef = useRef(cb);
  useEffect(() => {
    cbRef.current = cb;
  });

  useEffect(() => {
    if (delay === null) return;
    const handle = setTimeout(() => cbRef.current(), delay);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
}

export default function Board({ id: boardId }) {
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

  const [boardError, setBoardError] = useState([true, "n/A"]);
  const [socketStatus, setSocketStatus] = useState("CONNECTING");
  const [userCount, setUserCount] = useState(1);
  const [boardMetadata, setBoardMetadata] = useState({
    name: "n/a",
    expiresAt: null,
    expireDays: null,
  });
  const [ui, setUI] = useState({
    showDropdown: false,
    showColManager: false,
    showLabelManager: false,
    showCardSearchModal: false,
    isDarkMode: false,
    showPasswordModal: false,
  });

  const hasFetched = useRef(false);
  const lastSavedJSON = useRef("");
  const passwordRef = useRef("");

  const { lastUpdateId, suppressSave } = useBoardSocket({
    boardId,
    password: passwordRef.current,
    importBoard,
    onUserCount: setUserCount,
    onStatus: setSocketStatus,
  });

  const fetchBoard = useCallback(async () => {
    try {
      const pw = localStorage.getItem(`kanbanyShared+${boardId}`) || "";
      passwordRef.current = pw;

      const res = await fetch(`/api/shared/${boardId}`, {
        headers: {
          "Content-Type": "application/json",
          "X-Board-Password": pw,
        },
      });
      const data = await res.json();

      if (res.status !== 200) {
        setBoardError([true, data.error]);
        if (
          data.error?.includes("password") ||
          data.error?.includes("Password")
        ) {
          setUI((u) => ({ ...u, showPasswordModal: true }));
          addToast(i18n.t("board.passwordWrong"), "error");
        }
        return;
      }

      importBoard(data.data);
      setBoardMetadata({
        name: data.name,
        expiresAt: data.expires_at,
        expireDays: Math.floor(
          (new Date(data.expires_at) - new Date()) / 86400000
        ),
      });

      lastSavedJSON.current = JSON.stringify(canonicalize(data.data));
      setBoardError([false, "n/A"]);
      setUI((u) => ({ ...u, showPasswordModal: false }));
      addToast(i18n.t("board.loaded"), "success");
    } catch (err) {
      addToast(`Error: ${err.message}`, "error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useDebouncedEffect(
    () => {
      if (suppressSave.current || boardError[0]) return;

      const raw = JSON.parse(exportBoard());
      const canon = canonicalize(raw);
      const current = JSON.stringify(canon);
      if (current === lastSavedJSON.current) return; // nothing changed

      const updateId = uuid();
      lastUpdateId.current = updateId;
      lastSavedJSON.current = current;

      const body = JSON.stringify({
        data: JSON.parse(current),
        password: passwordRef.current,
        updateId,
      });

      (async () => {
        try {
          const res = await fetch(`/api/shared/${boardId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
          });
          const result = await res.json();
          addToast(
            res.status === 201
              ? i18n.t("board.saved")
              : i18n.t("general.error") + " " + result.error,
            res.status === 201 ? "success" : "error"
          );
        } catch (err) {
          addToast(
            i18n.t("serverSavingError", { error: err.message }),
            "error"
          );
        }
      })();
    },
    // Dependencies
    [columns, cards, labels],
    2000
  );

  useEffect(() => {
    const stored = localStorage.getItem("darkMode") === "true";
    setUI((u) => ({ ...u, isDarkMode: stored }));
    document.documentElement.classList.toggle("dark", stored);
  }, []);

  useEffect(() => {
    const listener = (e) => {
      if ((isMac() ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setUI((u) => ({ ...u, showCardSearchModal: true }));
      }
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, []);

  const handlers = {
    // dropdown
    toggleDropdown: () =>
      setUI((u) => ({ ...u, showDropdown: !u.showDropdown })),
    hideDropdown: () => setUI((u) => ({ ...u, showDropdown: false })),

    // managers
    openColManager: () =>
      setUI((u) => ({ ...u, showColManager: true, showDropdown: false })),
    openLabelManager: () =>
      setUI((u) => ({ ...u, showLabelManager: true, showDropdown: false })),

    // theme
    toggleDarkMode: () => {
      setUI((u) => {
        const val = !u.isDarkMode;
        localStorage.setItem("darkMode", val.toString());
        document.documentElement.classList.toggle("dark", val);
        return { ...u, isDarkMode: val };
      });
    },

    // data import / export
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

    // cards
    onCardClick: openModal,
    showCardSearchModal: () =>
      setUI((u) => ({ ...u, showCardSearchModal: true })),

    // board url
    copyBoardURL: () => {
      navigator.clipboard.writeText(window.location.href);
      addToast(i18n.t("board.copyLinkSuccess"), "success");
    },
  };

  const handlePasswordConfirm = (pw) => {
    localStorage.setItem(`kanbanyShared+${boardId}`, pw);
    passwordRef.current = pw;
    setUI((u) => ({ ...u, showPasswordModal: false }));
    fetchBoard();
  };

  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen">
      <BoardHeader showDropdown={ui.showDropdown} handlers={handlers} />
      {ui.showDropdown && (
        <BoardMenu handlers={handlers} isDarkMode={ui.isDarkMode} />
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
          <BoardSkeleton />
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
            showColManager={ui.showColManager}
            setShowColManager={(v) =>
              setUI((u) => ({ ...u, showColManager: v }))
            }
            showLabelManager={ui.showLabelManager}
            setShowLabelManager={(v) =>
              setUI((u) => ({ ...u, showLabelManager: v }))
            }
          />
        </>
      )}

      <CardSearchModal
        isOpen={ui.showCardSearchModal}
        onClose={(cardID) => {
          if (cardID) {
            const card = cards.find((c) => c.id === cardID);
            if (card) openModal(cardID);
          }
          setUI((u) => ({ ...u, showCardSearchModal: false }));
        }}
      />

      <PasswordModal
        isOpen={ui.showPasswordModal}
        onConfirm={handlePasswordConfirm}
        onCancel={() => {}}
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
