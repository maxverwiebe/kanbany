function LocalStorageSaver() {
  const VERSION = "V1";
  const KEY = "kanbanyData" + VERSION;

  function ImportLocalStorage() {
    try {
      const data = localStorage.getItem(KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Error importing from local storage:", error);
    }
    return null;
  }
  function ExportLocalStorage(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error exporting to local storage:", error);
    }
  }
  function ClearLocalStorage() {
    try {
      localStorage.removeItem(KEY);
    } catch (error) {
      console.error("Error clearing local storage:", error);
    }
  }
  return {
    ImportLocalStorage,
    ExportLocalStorage,
    ClearLocalStorage,
  };
}

export default LocalStorageSaver;
