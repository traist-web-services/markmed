import fs from "fs";
import { join } from "path";

import { ipcRenderer } from "electron";

import { useCallback, useContext } from "react";

import { AppDispatchContext } from "../../contexts/AppContext";
import { useAllNotesFiles } from "../useFilesystem";

export default function useDeleteFile() {
  const dispatch = useContext(AppDispatchContext);
  const { fetchNotesDir } = useAllNotesFiles();

  if (!ipcRenderer) {
    return;
  }
  const deleteFile = useCallback(
    (filename: string) =>
      ipcRenderer
        .invoke("ask-user-question", {
          message: "Are you sure you want to delete this file?",
          type: "question",
          buttons: [`No, don't delete it`, `Yes, delete it`],
          title: "Delete file",
          detail: `Are you sure you want to delete the following file:
      ${filename}?`,
        })
        .then((data) => {
          if (data > 0) {
            fs.unlink(filename, (err) => console.error(err));
            // TODO: If editor is dirty, then CM will 'resave' this file when it tears down.
            dispatch({
              type: "LOAD_FILE_FROM_DISK",
              payload: {
                currentFileName: "",
                currentFileContent: "",
              },
            });
            fetchNotesDir();
          } else {
            const notification = new Notification("Not deleted", {
              body: "Your file was not deleted.",
              silent: true,
            });
          }
        })
        .catch((e) => {
          const notification = new Notification("Not deleted", {
            body: "Your file could not be deleted.",
          });
        }),
    []
  );
  return { deleteFile };
}
