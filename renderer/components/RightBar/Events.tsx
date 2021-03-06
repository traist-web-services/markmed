import { Fragment, useContext, useEffect, useState } from "react";

import {
  Badge,
  Box,
  Heading,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";

import { AppDispatchContext, AppStateContext } from "../../contexts/AppContext";

import useEvents from "../../hooks/events/useEvents";
import { format, formatISO, parseISO, isSameDay } from "date-fns";
import { useReadSingleFile } from "../../hooks/useFilesystem";
export default function Events() {
  const { findEventsAllFiles, parseEvents } = useEvents();
  const {
    currentFileContent,
    currentFileName,
    editorContent,
    selectedDate,
    notesFilesFlat,
  } = useContext(AppStateContext);
  const [otherFilesEvents, setOtherFilesEvents] = useState([]);
  const [displayEvents, setDisplayEvents] = useState([]);

  const { readFile } = useReadSingleFile();

  const dispatch = useContext(AppDispatchContext);

  useEffect(() => {
    const setInitialState = async () => {
      const thisFile = parseEvents(
        currentFileContent,
        currentFileName,
        formatISO(selectedDate, { representation: "date" })
      ).filter((el) => isSameDay(el.startTime, selectedDate));
      const otherFiles = await findEventsAllFiles(
        formatISO(selectedDate, { representation: "date" })
      );
      setOtherFilesEvents(otherFiles);
      setDisplayEvents([...thisFile, ...otherFiles]);
    };
    setInitialState();
  }, [notesFilesFlat, selectedDate, currentFileContent]);

  useEffect(() => {
    const thisFile = parseEvents(
      editorContent,
      currentFileName,
      formatISO(selectedDate, { representation: "date" })
    ).filter((el) => {
      return isSameDay(el.startTime, selectedDate);
    });
    const merged = [...thisFile, ...otherFilesEvents];
    merged.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    setDisplayEvents(merged);
  }, [editorContent, selectedDate, currentFileContent]);

  const color = useColorModeValue("brand.900", "brand.200");

  return (
    <VStack w="100%" h="100%">
      <Heading pb={2} fontSize="2xl" w="100%">
        Events
      </Heading>
      <SimpleGrid
        columns={2}
        templateColumns="auto 1fr"
        overflowY="auto"
        w="100%"
      >
        {displayEvents.map((event, index) => {
          const formattedStartTime = format(event.startTime, "HHmm");
          const formattedEndTime = format(event.endTime, "HHmm");
          return (
            <Fragment key={index}>
              <VStack alignItems="center" w="100%">
                <Text>
                  {event.allDay
                    ? "All Day"
                    : `${formattedStartTime}
                -
                ${formattedEndTime}`}
                </Text>
                {formatISO(selectedDate, { representation: "date" }) !==
                  event.fromFile && (
                  <Badge
                    onClick={() => {
                      readFile(event.fromFilePath, parseISO(event.fromFile));
                    }}
                  >
                    {event.fromFile}
                  </Badge>
                )}
              </VStack>
              <Text
                borderColor={color}
                borderLeft="1px solid"
                key={index}
                pl={2}
                ml={2}
              >
                {event.description}
              </Text>
            </Fragment>
          );
        })}
      </SimpleGrid>
    </VStack>
  );
}
