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
  VStack,
  Grid,
  Flex,
} from "@chakra-ui/react";

import useToDos from "../../hooks/todos/useTodos";
import { AppStateContext } from "../../contexts/AppContext";
import formatISO from "date-fns/formatISO";
import { isSameDay } from "date-fns";

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
    const initialSetup = async () => {
      const toDosFromEditor = parseToDos(editorContent, currentFileName);
      const toDosforSelectedDayFromOtherFiles = await findToDosAllFiles(
        formatISO(selectedDate, { representation: "date" })
      );
      setThisDaysToDos([
        ...toDosFromEditor,
        ...toDosforSelectedDayFromOtherFiles.filter((todo) =>
          isSameDay(todo.date, selectedDate)
        ),
      ]);
    };
    initialSetup();
    return () => setThisDaysToDos([]);
  }, [currentFileContent, editorContent, selectedDate]);

  useEffect(() => {
    const updateToDosFromAllFiles = async () => {
      const allToDosFromFiles = await findToDosAllFiles();
      setAllToDos([
        ...allToDosFromFiles,
        ...thisDaysToDos.filter((el) => !el.complete),
      ]);
    };
    updateToDosFromAllFiles();
    return () => setAllToDos([]);
  }, [selectedDate, currentFileContent]);

  return (
    <VStack w="100%" h="100%" overflowY="hidden" pos="relative">
      <Heading fontSize="2xl" pb={2} w="100%">
        To Do
      </Heading>
      <Tabs
        isLazy
        variant="soft-rounded"
        size="sm"
        colorScheme="brand"
        pos="relative"
        h="100%"
        w="100%"
        pb={
          20 /* This is an ugly hack, I should work out how to do this properly rather than just pushing the content up */
        }
      >
        <TabList>
          <Tab>Today's To Dos</Tab>
          <Tab>All To Dos</Tab>
        </TabList>

        <TabPanels h="100%" overflowY="hidden" position="relative">
          <TabPanel h="100%" overflowY="scroll">
            {thisDaysToDos
              .filter((el) => isSameDay(el.date, selectedDate))
              .map((todo, index) => (
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
                  <Spacer />
                  <Badge>{todo.fromFilePath.match(/\d{4}-\d{2}-\d{2}/)}</Badge>
                </HStack>
              ))}
          </TabPanel>
          <TabPanel h="100%" overflowY="scroll" as={VStack}>
            {allToDos.map((todo, index) => (
              <HStack key={index} w="100%">
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
                <Spacer />
                <Badge>{todo.fromFilePath.match(/\d{4}-\d{2}-\d{2}/)}</Badge>
              </HStack>
            ))}
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Spacer />
    </VStack>
  );
}
