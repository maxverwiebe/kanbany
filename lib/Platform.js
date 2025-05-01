export function isMac() {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform);
}

export function isWindows() {
  if (typeof navigator === "undefined") return false;
  return /Win/.test(navigator.platform);
}
