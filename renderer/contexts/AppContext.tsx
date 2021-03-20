import { createContext } from "react";

import { startOfMonth } from "date-fns";

export const AppContextDefault = {
  currentFileContent: "",
  currentFileName: "",
  displayMonth: startOfMonth(new Date()), // Candidate to move to local state
  editorContent: "",
  notesDir: "",
  notesDirTree: [],
  notesFilesFlat: [],
  selectedDate: new Date(),
};

export const AppStateContext = createContext(AppContextDefault);
export const AppDispatchContext = createContext(
  (dispatch: any) => dispatch.state
);
