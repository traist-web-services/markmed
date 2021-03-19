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

import { AppDispatchContext, AppStateContext } from "../../contexts/AppContext";

import { parseToDos } from "../../lib/index";
import { formatISO } from "date-fns";

export default function ToDoList() {
  // TODO: the variable names in this file are all over the place
  const [thisDaysToDos, setThisDaysToDos] = useState([]);
  const [allToDos, setAllToDos] = useState([]);
  const { currentFileName, editorContent, notesDir, selectedDate } = useContext(
    AppStateContext
  );
  const dispatch = useContext(AppDispatchContext);

  useEffect(() => {
    const getAllToDos = async () => {
      const date = formatISO(selectedDate, { representation: "date" });
      setThisDaysToDos(
        parseToDos(editorContent).map((el) => {
          return {
            ...el,
            fromFile: currentFileName,
          };
        })
      );

      // const regexToTest = new RegExp(`@\\d\\d\\d\\d ${date} .*`);
      const regexToTest = new RegExp(`- \\[{0,1}.\\] ${date} .*`);
      const allToDoRegex = new RegExp(`- \\[{0,1}.\\] .*`);
      const incompleteRegex = new RegExp(`- \\[{0,1} \\] .*`);
      // Matches '@1234 <TODAY> anytexthere'
      const dailyFileReference = /@\d\d\d\d (?!\d{4}-\d{2}-\d{2}).*/;
      // Matches '@1234 DATE.*

      let forToday = [];
      let allIncomplete = [];

      if (!notesDir) return;
      const dirTree = async (filename: string) => {
        const stats = await fs.lstat(filename);
        if (stats.isDirectory()) {
          const children = await fs.readdir(filename);
          await Promise.all(
            children.map(function (child) {
              return dirTree(join(filename, child));
            })
          );
        } else {
          const content = await fs.readFile(filename, "utf8");
          const lines = content.toString().split(/\n/);
          const thisFilesMatchesForToday = [];
          const incompleteForToday = [];

          for (let j = 0; j < lines.length; j++) {
            const line = lines[j];
            if (regexToTest.test(line) && filename.indexOf(`${date}.md`) < 0) {
              const parsedToDo = line.replace(`${date} `, "");
              thisFilesMatchesForToday.push(parsedToDo);
              if (incompleteRegex.test(line)) {
                incompleteForToday.push(parsedToDo);
              }
            }

            if (allToDoRegex.test(line) && incompleteRegex.test(line)) {
              incompleteForToday.push(line);
            }
          }
          const thisFilesTodosForToday = parseToDos(
            thisFilesMatchesForToday.join("\n")
          ).map((el) => {
            return {
              ...el,
              fromFile: filename,
            };
          });
          const thisFilesIncompleteForToday = parseToDos(
            incompleteForToday.join("\n")
          ).map((el) => {
            return {
              ...el,
              fromFile: filename,
            };
          });
          allIncomplete.push(thisFilesIncompleteForToday);
        }
      };
      await dirTree(notesDir);

      const [otherDaysToDos] = forToday.filter((el) => el.length > 0);
      const allIncompleteToDos = allIncomplete.filter((el) => el.length > 0);

      if (otherDaysToDos) {
        setThisDaysToDos([...thisDaysToDos, ...otherDaysToDos]);
      }
      setAllToDos(
        allIncomplete
          .flat()
          .sort((a, b) => (a.name < b.name ? 1 : a.name > b.name ? -1 : 0))
      );
    };
    getAllToDos();
  }, [editorContent, notesDir, selectedDate]);

  const handleClick = (todo: string) => {
    dispatch({ type: "TOGGLE_TO_DO", payload: todo });
  };

  return (
    <Box w="100%">
      <Heading fontSize="2xl" mb={2}>
        To Do
      </Heading>
      <Tabs isLazy variant="soft-rounded" size="sm" colorScheme="brand">
        <TabList>
          <Tab>Today's To Dos</Tab>
          <Tab>All To Dos</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {thisDaysToDos.map((todo, index) => (
              <HStack key={index}>
                <Checkbox
                  mr={2}
                  isChecked={todo.checked}
                  onChange={() => handleClick(todo.todo)}
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
                  onChange={() => handleClick(todo.todo)}
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
