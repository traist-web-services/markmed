import { HStack, Icon, Text, Spacer } from "@chakra-ui/react";

import { VscMarkdown, VscTrash } from "react-icons/vsc";

import { useDeleteFile, useReadSingleFile } from "../../../hooks/useFilesystem";

export default function File({ name, path }) {
  const { deleteFile } = useDeleteFile();
  const { readFile } = useReadSingleFile();

  return (
    <HStack alignItems="center" role="group">
      <Icon as={VscMarkdown} />
      <Text onClick={() => readFile(path)}>{name}</Text>
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
