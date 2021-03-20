import { join } from "path";

import { Fragment, useContext } from "react";

import {
  addMonths,
  differenceInCalendarDays,
  endOfISOWeek,
  endOfMonth,
  format,
  formatISO,
  getISOWeek,
  startOfISOWeek,
  startOfMonth,
} from "date-fns";

import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { AppStateContext, AppDispatchContext } from "../../contexts/AppContext";

import { useReadSingleFile } from "../../hooks/useFilesystem";

import DateElement from "./DateElement";

export default function Calendar() {
  const { displayMonth, notesDir } = useContext(AppStateContext);
  const dispatch = useContext(AppDispatchContext);
  const { readFile } = useReadSingleFile();
  const bg = useColorModeValue("brand.100", "brand.700");

  const firstMonday = startOfISOWeek(startOfMonth(displayMonth));
  const lastSunday = endOfISOWeek(endOfMonth(displayMonth));
  const dateDifference = differenceInCalendarDays(lastSunday, firstMonday) + 1;
  const daysToDisplay = [];

  for (let i = 0; i < dateDifference; i++) {
    const thisDate = new Date(firstMonday.getTime());
    thisDate.setDate(thisDate.getDate() + i);
    daysToDisplay.push(thisDate);
  }

  return (
    <Box w="100%" pb={4}>
      <Heading pb={2} fontSize="2xl">
        Calendar
      </Heading>
      <Box bg={bg} p={4} pt={2} rounded={8}>
        <Flex
          w="100%"
          justifyContent="space-between"
          px={4}
          pb={2}
          alignItems="center"
        >
          <Button
            variant="ghost"
            colorScheme="brand"
            onClick={() =>
              dispatch({
                type: "SET_DISPLAY_MONTH",
                payload: addMonths(displayMonth, -1),
              })
            }
            _active={{
              outline: "0px solid transparent",
              border: "0px",
            }}
            _focus={{
              outline: "0px solid transparent",
              border: "0px",
            }}
          >
            &larr;
          </Button>
          <Button
            variant="unstyled"
            colorScheme="brand"
            onClick={() => {
              dispatch({
                type: "SET_DISPLAY_MONTH",
                payload: new Date(),
              });
              const date = new Date();
              const filename = `${formatISO(date, {
                representation: "date",
              })}.md`;
              const fileToRead = join(notesDir, "Dailies", filename);
              readFile(fileToRead, date);
            }}
            _active={{
              outline: "0px solid transparent",
              border: "0px",
            }}
            _focus={{
              outline: "0px solid transparent",
              border: "0px",
            }}
          >
            <Heading fontSize="2xl">{format(displayMonth, "MMM yyyy")}</Heading>
          </Button>
          <Button
            variant="ghost"
            colorScheme="brand"
            onClick={() =>
              dispatch({
                type: "SET_DISPLAY_MONTH",
                payload: addMonths(displayMonth, 1),
              })
            }
            _active={{
              outline: "0px solid transparent",
              border: "0px",
            }}
            _focus={{
              outline: "0px solid transparent",
              border: "0px",
            }}
          >
            &rarr;
          </Button>
        </Flex>
        <Grid
          gridTemplateColumns="repeat(8, 1fr)"
          fontSize="sm"
          alignItems="center"
          justifyContent="center"
          placeItems="center"
          textAlign="center"
        >
          <Box></Box>
          <Text fontWeight={700}>M</Text>
          <Text fontWeight={700}>T</Text>
          <Text fontWeight={700}>W</Text>
          <Text fontWeight={700}>T</Text>
          <Text fontWeight={700}>F</Text>
          <Text fontWeight={700}>S</Text>
          <Text fontWeight={700}>S</Text>
          {daysToDisplay.map((el, i) => (
            <Fragment key={formatISO(el, { representation: "date" })}>
              {i % 7 === 0 && <Text fontWeight={700}>{getISOWeek(el)}</Text>}
              <DateElement date={el} />
            </Fragment>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
