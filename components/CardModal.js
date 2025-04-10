import { useState, useEffect } from "react";
import { useBoard } from "@/lib/BoardContext";
import i18n from "@/lib/i18n";
import { useToast } from "@/lib/ToastContext";
export default function CardModal() {
  const { cards, columns, modalCardId, updateCard, closeModal, labels } =
    useBoard();

  const card = cards.find((c) => c.id === modalCardId);
  const [title, setTitle] = useState(card?.text || "");
  const [description, setDescription] = useState(card?.description || "");
  const [selectedLabels, setSelectedLabels] = useState(card?.labels || []);
  const [columnID, setColumnID] = useState(card?.columnId || "");
  const { addToast } = useToast();

  useEffect(() => {
    if (card) {
      setTitle(card.text);
      setDescription(card.description || "");
      setSelectedLabels(card.labels || []);
      setColumnID(card.columnId);
    }
  }, [card]);

  const toggleLabel = (labelId) => {
    if (selectedLabels.includes(labelId)) {
      setSelectedLabels(selectedLabels.filter((id) => id !== labelId));
    } else {
      setSelectedLabels([...selectedLabels, labelId]);
    }
  };

  const save = () => {
    updateCard(card.id, {
      text: title,
      description,
      labels: selectedLabels,
      columnId: columnID,
    });

    addToast("Dies ist eine Erfolgsmeldung!", "success");

    closeModal();
  };

  if (!card) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-center mb-6">
          {i18n.t("card.editor")}
        </h2>

        <div className="mb-4">
          <input
            className="w-full bg-transparent placeholder:text-neutral-400 text-neutral-800 text-sm border border-neutral-300 rounded-md px-3 py-2 transition duration-300 ease-in-out focus:outline-none focus:border-neutral-400 hover:border-neutral-400"
            placeholder={i18n.t("card.title")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <textarea
            className="w-full bg-transparent placeholder:text-neutral-400 text-neutral-800 text-sm border border-neutral-300 rounded-md px-3 py-2 transition duration-300 ease-in-out focus:outline-none focus:border-neutral-400 hover:border-neutral-400 h-32"
            placeholder={i18n.t("card.desc")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-4">
          <h3 className="font-medium text-neutral-700 mb-2">
            {i18n.t("card.column")}
          </h3>
          <select
            className="w-full p-2 border border-neutral-300 rounded-md transition duration-300 ease-in-out focus:outline-none focus:border-neutral-400 hover:border-neutral-400"
            value={columnID}
            onChange={(e) => setColumnID(e.target.value)}
          >
            {columns.map((col) => (
              <option key={col.id} value={col.id}>
                {col.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <h3 className="font-medium text-neutral-700 mb-2">
            {i18n.t("card.labels")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {labels.map((label) => {
              const isSelected = selectedLabels.includes(label.id);
              return (
                <button
                  key={label.id}
                  type="button"
                  onClick={() => toggleLabel(label.id)}
                  className={`px-2 py-1 rounded text-sm transition duration-300 ${
                    isSelected
                      ? `${label.color} text-white`
                      : `${label.color} opacity-30 text-white`
                  }`}
                >
                  {label.text}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-300 text-neutral-800 rounded-md text-sm hover:bg-gray-400 transition"
            onClick={closeModal}
          >
            {i18n.t("general.close")}
          </button>
          <button
            className="px-4 py-2 bg-violet-500 text-white rounded-md text-sm hover:bg-violet-600 transition"
            onClick={save}
          >
            {i18n.t("general.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
