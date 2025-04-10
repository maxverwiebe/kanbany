import { useBoard } from "@/lib/BoardContext";

function Label({ uuid }) {
  const { labels } = useBoard();
  const label = labels.find((l) => l.id === uuid);

  if (!label) return null;

  return (
    <div
      className={`px-3 py-1 rounded-md text-xs font-medium text-white ${label.color} transition-all hover:opacity-90`}
    >
      {label.text}
    </div>
  );
}

function Labels({ labelIds }) {
  return (
    <div className="flex flex-wrap gap-2 mb-1 mt-1">
      {labelIds.map((id) => (
        <Label key={id} uuid={id} />
      ))}
    </div>
  );
}

export default Labels;
