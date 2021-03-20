import { promises as fs } from "fs";

import { useContext } from "react";

import { ipcRenderer } from "electron";

import { AppDispatchContext } from "../../contexts/AppContext";

export default function useReadSingleFile() {
  const dispatch = useContext(AppDispatchContext);

  const readFile = async (filename: string) => {
    if (!ipcRenderer) {
      return;
    }
    try {
      const data = await fs.readFile(filename, "utf-8");
      dispatch({
        type: "LOAD_FILE_FROM_DISK",
        payload: { currentFileName: filename, currentFileContent: data },
      });
    } catch (e) {
      console.error(e);
    }
  };
  return { readFile };
}
