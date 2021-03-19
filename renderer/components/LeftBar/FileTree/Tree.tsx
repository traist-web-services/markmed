import { useCallback, useContext, useEffect } from "react";
import { AppStateContext } from "../../../contexts/AppContext";
import { useAllNotesFiles } from "../../../hooks/useFilesystem";

import File from "./File";
import Folder from "./Folder";

export default function Tree({ filter }) {
  const { notesDir, notesDirTree } = useContext(AppStateContext);
  const { fetchNotesDir } = useAllNotesFiles();

  useEffect(() => {
    if (notesDir && notesDirTree.length === 0) {
      fetchNotesDir();
    }
  }, [notesDir]);

  const TreeRecursive = useCallback(
    ({ data = [] }) => {
      data.sort((a, b) => (a.name < b.name ? 1 : a.name > b.name ? -1 : 0));

      const tree = data.map((item, index) => {
        if (item.path === notesDir) {
          return <TreeRecursive data={item.children} key={index} />;
        }
        if (item.name[0] === ".") {
          return;
        }
        if (item.type === "file") {
          if (
            item.name.substr(item.name.length - 3, 3) !== ".md" ||
            (filter && item.name.indexOf(filter) < 0)
          ) {
            return;
          }
          return <File path={item.path} name={item.name} key={index} />;
        }
        if (item.type === "folder") {
          return (
            <Folder name={item.name} key={index}>
              <TreeRecursive data={item.children} />
            </Folder>
          );
        }
      });
      return <>{tree.sort()}</>;
    },
    [notesDirTree]
  );
  return <TreeRecursive data={notesDirTree} />;
}
