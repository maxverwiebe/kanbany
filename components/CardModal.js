import { useState } from "react";
import getLabels from "@/utils/LabelUtil";

export default function CardModal({ card, onSave, onClose }) {
  const [title, setTitle] = useState(card.text);
  const [description, setDescription] = useState(card.description || "");
  const [selectedLabels, setSelectedLabels] = useState(card.labels || []);

  const availableLabels = getLabels();

  const toggleLabel = (label) => {
    const exists = selectedLabels.find((l) => l.id === label.id);
    if (exists) {
      setSelectedLabels(selectedLabels.filter((l) => l.id !== label.id));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  const save = () => {
    onSave(card.id, { text: title, description, labels: selectedLabels });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Karte bearbeiten</h2>
        <input
          className="w-full p-2 mb-4 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full p-2 mb-4 border rounded h-32"
          placeholder="Beschreibung"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {/* Label Selector */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Labels auswählen</h3>
          <div className="flex flex-wrap gap-2">
            {availableLabels.map((label) => {
              const isSelected = selectedLabels.some((l) => l.id === label.id);
              return (
                <button
                  key={label.id}
                  type="button"
                  onClick={() => toggleLabel(label)}
                  className={`px-2 py-1 rounded text-sm ${
                    isSelected
                      ? `${label.color} text-white`
                      : `border ${label.color} text-gray-700 line-through`
                  }`}
                >
                  {label.text}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Abbrechen
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={save}
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}
