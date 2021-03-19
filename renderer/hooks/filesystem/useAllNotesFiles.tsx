import { join, basename } from "path";
import { promises as fs } from "fs";

import { useContext } from "react";

import { AppStateContext, AppDispatchContext } from "../../contexts/AppContext";

interface FileSystemObject {
  path: string;
  name: string;
  type: "file" | "folder";
  children: null | FileSystemObject[];
}

export default function useAllNotesFiles() {
  const { notesDir } = useContext(AppStateContext);
  const dispatch = useContext(AppDispatchContext);

  const fetchNotesDir = async () => {
    if (!notesDir) return;
    const dirTree = async (filename: string) => {
      const info: FileSystemObject = {
        path: filename,
        name: basename(filename),
        type: "file",
        children: null,
      };
      const stats = await fs.lstat(filename);
      if (stats.isDirectory()) {
        const children = await fs.readdir(filename);
        info.type = "folder";
        info.children = await Promise.all(
          children.map(function (child) {
            return dirTree(join(filename, child));
          })
        );
      }
      return info;
    };

    const flattenArr = (arr: FileSystemObject[]) => {
      const result = [];
      arr.forEach((item) => {
        const { path, name, children, type } = item;
        if (type !== "folder") {
          result.push({ path, name });
        }
        if (children) result.push(...flattenArr(children));
      });
      return result;
    };

    dirTree(notesDir).then((data) => {
      const directoryInfo = [data];
      const notesFilesFlat = flattenArr(directoryInfo);
      dispatch({
        type: "SET_NOTES_DIR_TREE",
        payload: { notesDirTree: directoryInfo, notesFilesFlat },
      });
    });
  };

  return { fetchNotesDir };
}
