import { useState } from "react";

import { Box, Icon, Text } from "@chakra-ui/react";

import { VscFolder, VscFolderOpened, VscChevronRight } from "react-icons/vsc";

export default function Folder({ name, children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Box>
      <Text onClick={() => setIsOpen(!isOpen)}>
        <Icon as={isOpen ? VscFolderOpened : VscFolder} /> {name}{" "}
        <Icon
          as={VscChevronRight}
          transition="transform 0.2s"
          transform={isOpen ? "rotate(90deg)" : ""}
        />
      </Text>
      <Box
        ml={2}
        h={isOpen ? "auto" : 0}
        overflow="hidden"
        transition="height 0.2s"
      >
        {children}
      </Box>
    </Box>
  );
}
