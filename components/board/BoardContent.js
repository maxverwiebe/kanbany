import React from "react";
import Column from "../Column";
import i18n from "@/lib/i18n";

export default function BoardContent({
  columns,
  cards,
  handlers,
  openColManager,
}) {
  return (
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
          <div className="flex-shrink-0 w-64 h-full p-4 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button onClick={openColManager} className="add-column-button">
              <span className="ml-2">{i18n.t("column.add")}</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
