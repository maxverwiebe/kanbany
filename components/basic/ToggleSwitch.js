import { useState } from "react";

export default function ToggleSwitch({ label, initial = false, onToggle }) {
  const [checked, setChecked] = useState(initial);

  const toggle = () => {
    setChecked((prev) => {
      const newValue = !prev;
      if (onToggle) onToggle(newValue);
      return newValue;
    });
  };

  return (
    <label className="flex items-center cursor-pointer select-none">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={toggle}
          className="sr-only"
        />
        <div className="w-10 h-4 bg-gray-300 rounded-full shadow-inner" />
        <div
          className={`dot absolute w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 transform -left-1 -top-1 ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </div>
      {label && <span className="ml-3 text-gray-700">{label}</span>}
    </label>
  );
}
