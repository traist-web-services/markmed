import fs from "fs";
import { join } from "path";

import { ipcRenderer } from "electron";

import { useContext } from "react";

import { HStack, Icon, Text, Spacer } from "@chakra-ui/react";
import {
  AppStateContext,
  AppDispatchContext,
} from "../../../contexts/AppContext";
import { VscMarkdown, VscTrash } from "react-icons/vsc";
import { useAllNotesFiles, useDeleteFile } from "../../../hooks/useFilesystem";

export default function File({ name, path }) {
  // const { fetchNotesDir } = useAllNotesFiles();
  const { deleteFile } = useDeleteFile();
  const dispatch = useContext(AppDispatchContext);
  const loadFile = async () => {
    if (!ipcRenderer) {
      return;
    }
    const fileToRead = path;
    fs.readFile(fileToRead, "utf-8", (error, data) => {
      if (error) {
        console.error(error);
      }
      dispatch({
        type: "LOAD_FILE_FROM_DISK",
        payload: { currentFileName: fileToRead, currentFileContent: data },
      });
    });
  };

  const handleDelete = async (filename: string) => {};
  const thisFile = path;
  return (
    <HStack alignItems="center" role="group">
      <Icon as={VscMarkdown} />
      <Text onClick={() => loadFile()}>{name}</Text>
      <Spacer />
      <Icon
        display="none"
        _groupHover={{ display: "block" }}
        as={VscTrash}
        aria-label={`Delete file name`}
        cursor="pointer"
        alignItems="center"
        onClick={() => deleteFile(thisFile)}
      />
    </HStack>
  );
}
