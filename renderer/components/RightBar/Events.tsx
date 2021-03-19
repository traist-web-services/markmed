import { Fragment, useContext, useEffect, useState } from "react";

import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Spacer,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { AppStateContext } from "../../contexts/AppContext";

import { parseEvents } from "../../lib/index";

export default function Events() {
  const { currentFileContent, editorContent, selectedDate } = useContext(
    AppStateContext
  );
  const [displayEvents, setDisplayEvents] = useState(
    parseEvents(currentFileContent)
  );

  useEffect(() => {
    setDisplayEvents(parseEvents(editorContent));
  }, [editorContent]);

  const color = useColorModeValue("brand.900", "brand.200");

  return (
    <Box w="100%" mb={4}>
      <Heading mb={2} fontSize="2xl">
        Events
      </Heading>
      <SimpleGrid
        columns={2}
        templateColumns="auto 1fr"
        alignItems="flex-start"
        mb={4}
      >
        {displayEvents &&
          displayEvents.map((event, index) => {
            return (
              <Fragment key={index}>
                {event.startTime && event.endTime && event.description && (
                  <>
                    <Text w="100%" textAlign="center" pr={2}>
                      {event.startTime === "0000" && event.endTime === "2359"
                        ? "All Day"
                        : `${event.startTime}
                -
                ${event.endTime}`}
                    </Text>
                    <Flex alignItems="center">
                      <Text
                        borderColor={color}
                        borderLeft="1px solid"
                        key={index}
                        pl={2}
                      >
                        {event.description}
                      </Text>
                      <Spacer />
                    </Flex>
                  </>
                )}
              </Fragment>
            );
          })}
      </SimpleGrid>
    </Box>
  );
}
