import { promises as fs } from "fs";

import { useContext } from "react";

import { parseISO } from "date-fns";

import { AppStateContext } from "../../contexts/AppContext";

interface ToDo {
  complete: boolean;
  todo: string;
  date: Date;
  fromFile: string;
  fromFilePath: string;
}

export default function useToDos() {
  const { notesFilesFlat } = useContext(AppStateContext);
  const toDoRegex = /- \[(.{0,1})\] (\d{4}-\d{2}-\d{2} ){0,1}(.*).*/;
  const parseToDo = (
    toDoString: string,
    fromFilePath: string,
    fromFile?: string
  ): ToDo => {
    const [_, complete, date, todo] = toDoString.match(toDoRegex);
    const toDoDate =
      (date && parseISO(date)) ??
      (fromFile && parseISO(fromFile)) ??
      new Date();
    return {
      complete: complete === "x",
      todo,
      date: toDoDate,
      fromFilePath: fromFilePath,
      fromFile,
    };
  };

  const isToDo = (toDoString: string): Boolean => {
    return toDoRegex.test(toDoString);
  };

  const parseToDos = (
    longString: string,
    fromFilePath: string,
    fromFile?: string
  ) => {
    return longString
      .split("\n")
      .map((el) => {
        if (isToDo(el)) {
          return parseToDo(el, fromFilePath, fromFile);
        }
      })
      .filter((el) => el)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const findToDosAllFiles = async (
    currentDateAsString: string
  ): Promise<ToDo[]> => {
    const todos = await Promise.all(
      notesFilesFlat.map(async (file) => {
        if (file.type === "folder") {
          return;
        }
        const fileDate = file.name.substring(0, file.name.length - 3);
        if (fileDate === currentDateAsString) {
          return [];
        }
        const data = await fs.readFile(file.path, "utf-8");
        return parseToDos(data, file.path, fileDate).filter(
          (todo) => !todo.complete
        );
      })
    );
    return todos.flat();
  };

  return { parseToDos, findToDosAllFiles };
}
