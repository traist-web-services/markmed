import { useEffect, useState } from "react";

import { Box, Grid, VStack, useColorModeValue } from "@chakra-ui/react";
import { format } from "date-fns";

import Calendar from "./RightBar/Calendar";
import Events from "./RightBar/Events";
import ToDoList from "./RightBar/ToDoList";

export default function RightBar() {
  const [percentElapsed, setPercentElapsed] = useState(0);
  const bg = useColorModeValue("brand.200", "brand.800");
  const color = useColorModeValue("brand.900", "brand.200");

  const getDayPercent = () => {
    const d = new Date();
    const dayPercent =
      (d.getHours() * 3600 +
        d.getMinutes() * 60 +
        d.getSeconds() +
        d.getMilliseconds() / 1000) /
      86400;
    setPercentElapsed(dayPercent);
    return;
  };
  useEffect(() => {
    getDayPercent();
    const int = setInterval(getDayPercent, 5000);
    return () => clearInterval(int);
  }, []);

  return (
    <>
      <Box
        position="absolute"
        top={0}
        left={0}
        w={1}
        h={`${100 * percentElapsed}%`}
        bg={color}
        transition="height 2000ms"
      >
        <Grid
          pos="absolute"
          px={2}
          py={1}
          fontSize="xs"
          bottom={0}
          bg={color}
          color={bg}
          transform="translateX(-50%)"
          placeItems="center"
          rounded="full"
        >
          {format(new Date(), "HH:mm")}
        </Grid>
      </Box>
      <VStack bg={bg} color={color} p={4} pb={0} h="100%" overflowY="hidden">
        <Box w="100%">
          <Calendar />
        </Box>
        <Box h="50%" w="100%" overflowY="hidden">
          <Events />
        </Box>
        <Box h="50%" w="100%" overflowY="hidden">
          <ToDoList />
        </Box>
      </VStack>
    </>
  );
}
