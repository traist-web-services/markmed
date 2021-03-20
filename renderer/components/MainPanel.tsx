import { useColorModeValue, VStack } from "@chakra-ui/react";

import CM from "./Editor/CM";

export default function MainPanel() {
  const bg = useColorModeValue("brand.50", "brand.900");
  const color = useColorModeValue("brand.900", "brand.100");
  return (
    <VStack h="100%" w="100" bg={bg} color={color}>
      <CM />
    </VStack>
  );
}
