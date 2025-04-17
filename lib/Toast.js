const toastEmitter = new EventTarget();

export function addToast(message, type = "info", duration = 5000) {
  const toast = {
    id: Date.now() + Math.random(),
    message,
    type,
    duration,
  };
  toastEmitter.dispatchEvent(new CustomEvent("addToast", { detail: toast }));
}

export { toastEmitter };
