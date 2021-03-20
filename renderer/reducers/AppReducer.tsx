export default function AppReducer(state, action) {
  switch (action.type) {
    case "LOAD_FILE_FROM_DISK":
      const { currentFileContent, currentFileName } = action.payload;
      return {
        ...state,
        currentFileContent,
        currentFileName,
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
    case "TOGGLE_TO_DO": {
      // TODO: This isn't working for some reason, seems to be a problem in the 'replace' method
      const todo = action.payload;
      const regex = new RegExp(`- \\[.{0,1}\\].${todo}`);
      const toDoInContent = state.editorContent.match(/- \[(.{0,1})\].*/);
      const isComplete = toDoInContent[1] && toDoInContent[1] !== " ";
      const replacementText = `- [${isComplete ? " " : "x"}] ${todo}`;
      const newContent = state.editorContent.replace(regex, replacementText);
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
