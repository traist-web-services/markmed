import { Box, VStack, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";

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
      <VStack
        bg={bg}
        color={color}
        p={4}
        h="100%"
        overflowY="auto"
        pos="relative"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          w={1}
          h={`${100 * percentElapsed}%`}
          bg={color}
          roundedBottom="full"
          transition="height 2000ms"
        ></Box>
        <Calendar />
        <Events />
        <ToDoList />
      </VStack>
    </>
  );
}
