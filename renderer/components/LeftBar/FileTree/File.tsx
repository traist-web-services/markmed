import { HStack, Icon, Text, Spacer } from "@chakra-ui/react";
import { parseISO } from "date-fns";
import { useContext } from "react";

import { VscMarkdown, VscTrash } from "react-icons/vsc";
import { AppStateContext } from "../../../contexts/AppContext";

import { useDeleteFile, useReadSingleFile } from "../../../hooks/useFilesystem";

export default function File({ name, path }) {
  const { currentFileName } = useContext(AppStateContext);
  const { deleteFile } = useDeleteFile();
  const { readFile } = useReadSingleFile();

  const isDateFile = /\d{4}-\d{2}-\d{2}\.md/.test(name);

  return (
    <HStack
      alignItems="center"
      role="group"
      cursor="pointer"
      fontWeight={path === currentFileName ? 700 : 400}
    >
      <Icon as={VscMarkdown} />
      <Text
        onClick={() =>
          readFile(
            path,
            isDateFile ? parseISO(name.substr(0, name.length - 3)) : null
          )
        }
      >
        {name}
      </Text>
      <Spacer />
      <Icon
        display="none"
        _groupHover={{ display: "block" }}
        as={VscTrash}
        aria-label={`Delete file name`}
        cursor="pointer"
        alignItems="center"
        onClick={() => deleteFile(path)}
      />
    </HStack>
  );
}
