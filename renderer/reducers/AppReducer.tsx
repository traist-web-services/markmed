export default function AppReducer(state, action) {
  switch (action.type) {
    case "LOAD_FILE_FROM_DISK":
      const {
        currentFileContent,
        currentFileName,
        selectedDate: selectedDateFile,
      } = action.payload;
      return {
        ...state,
        editorContent: currentFileContent,
        currentFileContent,
        currentFileName,
        selectedDate: selectedDateFile ?? state.selectedDate,
      };
    case "SET_SELECTED_DATE":
      const selectedDate = action.payload;
      return {
        ...state,
        selectedDate,
      };
    case "SET_NOTES_DIR":
      const notesDir = action.payload;
      return {
        ...state,
        notesDir,
      };
    case "SET_DISPLAY_MONTH":
      const displayMonth = action.payload;
      return {
        ...state,
        displayMonth,
      };
    case "SET_EDITOR_CONTENT":
      const editorContent = action.payload;
      return {
        ...state,
        editorContent,
      };
    case "SET_NOTES_DIR_TREE":
      const { notesDirTree, notesFilesFlat } = action.payload;
      return {
        ...state,
        notesDirTree,
        notesFilesFlat,
      };
    case "RELOAD_FILE": {
      const newContent = action.payload;
      return {
        ...state,
        editorContent: newContent,
        currentFileContent: newContent,
      };
    }
    default:
      console.error("Unrecognised action");
      return state;
  }
}
