import { join } from "path";

import { useContext } from "react";

import { formatISO, isSameDay } from "date-fns";

import { Badge, Button } from "@chakra-ui/react";

import { AppStateContext } from "../../contexts/AppContext";
import { useReadSingleFile } from "../../hooks/useFilesystem";

export default function DateElement({ date }) {
  const { notesDir, selectedDate } = useContext(AppStateContext);
  const { readFile } = useReadSingleFile();

  const selectDate = async (date: Date) => {
    const filename = `${formatISO(date, { representation: "date" })}.md`;
    const fileToRead = join(notesDir, "Dailies", filename);
    readFile(fileToRead, date);
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
