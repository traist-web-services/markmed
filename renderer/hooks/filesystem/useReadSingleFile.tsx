import { promises as fs } from "fs";

import { basename } from "path";

import { useContext } from "react";

import { ipcRenderer } from "electron";

import { AppDispatchContext } from "../../contexts/AppContext";
import formatISO from "date-fns/formatISO";

import { useAllNotesFiles } from "../useFilesystem";

export default function useReadSingleFile() {
  const dispatch = useContext(AppDispatchContext);
  const { fetchNotesDir } = useAllNotesFiles();

  const readFile = async (filename: string, selectedDate?: Date) => {
    if (!ipcRenderer) {
      return;
    }
    try {
      try {
        await fs.stat(filename);
      } catch (e) {
        await fs.writeFile(
          filename,
          selectedDate
            ? `# ${formatISO(selectedDate, { representation: "date" })}`
            : `# ${basename(filename, ".md")}`
        );
        await fetchNotesDir();
      }
      const data = await fs.readFile(filename, "utf-8");
      dispatch({
        type: "LOAD_FILE_FROM_DISK",
        payload: {
          currentFileName: filename,
          currentFileContent: data,
          selectedDate,
        },
      });
    } catch (e) {
      console.error(e);
    }
  };
  return { readFile };
}
