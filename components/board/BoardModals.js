import React from "react";
import CardModal from "../CardModal";
import ColumnManagerModal from "../ColumnManagerModal";
import LabelManagerModal from "../LabelManagerModal";

export default function BoardModals({
  board,
  showColManager,
  setShowColManager,
  showLabelManager,
  setShowLabelManager,
}) {
  const { cards, modalCardId, updateCard, closeModal } = board;

  return (
    <>
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
    </>
  );
}
