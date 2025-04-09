function Label({ text, color }) {
  return (
    <div
      className={`px-3 py-1 rounded-md text-xs font-medium text-white shadow-sm ${color} transition-all hover:opacity-90`}
    >
      {text}
    </div>
  );
}
function Labels({ labels }) {
  return (
    <div className="flex space-x-2">
      {labels.map((label) => (
        <Label key={label.text} text={label.text} color={label.color} />
      ))}
    </div>
  );
}
export default Labels;
