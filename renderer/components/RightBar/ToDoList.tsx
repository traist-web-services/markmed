import { promises as fs } from "fs";
import { join } from "path";
import { useContext, useEffect, useState } from "react";

import {
  Box,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  HStack,
  Checkbox,
  Text,
  Badge,
  Spacer,
} from "@chakra-ui/react";

import useToDos from "../../hooks/todos/useTodos";
import { AppStateContext } from "../../contexts/AppContext";
import formatISO from "date-fns/formatISO";

export default function ToDoList() {
  const [thisDaysToDos, setThisDaysToDos] = useState([]);
  const [allToDos, setAllToDos] = useState([]);
  const {
    currentFileContent,
    currentFileName,
    editorContent,
    selectedDate,
  } = useContext(AppStateContext);
  const { findToDosAllFiles, parseToDos, toggleToDoComplete } = useToDos();

  useEffect(() => {
    setThisDaysToDos(parseToDos(editorContent, currentFileName));
  }, [currentFileContent, editorContent]);

  useEffect(() => {
    const updateToDosFromAllFiles = async () => {
      const allToDosFromFiles = await findToDosAllFiles(
        formatISO(selectedDate, { representation: "date" })
      );
      setAllToDos(allToDosFromFiles);
    };
    updateToDosFromAllFiles();
  }, [selectedDate]);
  return (
    <Box w="100%" h="100%">
      <Heading fontSize="2xl" pb={2}>
        To Do
      </Heading>
      <Tabs
        isLazy
        variant="soft-rounded"
        size="sm"
        colorScheme="brand"
        h="100%"
        pos="relative"
      >
        <TabList>
          <Tab>Today's To Dos</Tab>
          <Tab>All To Dos</Tab>
        </TabList>

        <TabPanels h="100%" pos="relative">
          <TabPanel h="100%">
            {thisDaysToDos.map((todo, index) => (
              <HStack key={index}>
                <Checkbox
                  mr={2}
                  isChecked={todo.complete}
                  onClick={() =>
                    toggleToDoComplete(
                      todo.todo,
                      !todo.complete,
                      todo.fromFilePath
                    )
                  }
                />
                <Text>{todo.todo}</Text>
              </HStack>
            ))}
          </TabPanel>
          <TabPanel>
            {allToDos.map((todo, index) => (
              <HStack key={index}>
                <Checkbox
                  mr={2}
                  isChecked={todo.checked}
                  onClick={() =>
                    toggleToDoComplete(
                      todo.todo,
                      !todo.complete,
                      todo.fromFilePath
                    )
                  }
                />
                <Text>{todo.todo}</Text>
                <Spacer />
                <Badge>{todo.fromFile.match(/\d{4}-\d{2}-\d{2}/)}</Badge>
              </HStack>
            ))}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
