import fs from "fs";

import { join } from "path";

import { ipcRenderer } from "electron";

import { useContext } from "react";

import { formatISO, isSameDay } from "date-fns";

import { Badge, Button } from "@chakra-ui/react";

import { AppDispatchContext, AppStateContext } from "../../contexts/AppContext";

export default function DateElement({ date }) {
  const { notesDir, selectedDate } = useContext(AppStateContext);
  const dispatch = useContext(AppDispatchContext);

  const selectDate = async (date: Date) => {
    if (!ipcRenderer) {
      return;
    }
    const filename = `${formatISO(date, { representation: "date" })}.md`;
    const fileToRead = join(notesDir, "Dailies", filename);
    fs.readFile(fileToRead, "utf-8", (error, data) => {
      dispatch({
        type: "LOAD_FILE_FROM_DISK",
        payload: { currentFileName: fileToRead, currentFileContent: data },
      });
      dispatch({
        type: "SET_SELECTED_DATE",
        payload: date,
      });
    });
  };
  return (
    <Button
      fontWeight={300}
      variant="ghost"
      colorScheme="brand"
      size="smaller"
      _active={{
        outline: "0px solid transparent",
        border: "0px",
      }}
      _focus={{
        outline: "0px solid transparent",
        border: "0px",
      }}
      onClick={() => selectDate(date)}
    >
      {isSameDay(date, new Date()) ? (
        <Badge colorScheme="brand" variant="solid" fontSize="1em" py={0.5}>
          {date.getDate()}
        </Badge>
      ) : isSameDay(date, selectedDate) ? (
        <Badge colorScheme="brand" variant="outline" py={0.5}>
          {date.getDate()}
        </Badge>
      ) : (
        date.getDate()
      )}
    </Button>
  );
}
