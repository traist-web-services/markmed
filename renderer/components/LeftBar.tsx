import { useEffect, useState } from "react";

import {
  Box,
  Heading,
  HStack,
  Image,
  Input,
  Spacer,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";

import Tree from "./LeftBar/FileTree/Tree";

import UserMenu from "./LeftBar/UserMenu";

export default function LeftBar() {
  const [filter, setFilter] = useState("");

  const bg = useColorModeValue("brand.200", "brand.800");
  const color = useColorModeValue("brand.900", "brand.200");

  return (
    <VStack
      h="100%"
      w="100%"
      justifyContent="flex-start"
      bg={bg}
      color={color}
      p={4}
      pos="relative"
    >
      <HStack alignItems="center" w="100%">
        <Image src="images/logo.png" w={12} h={12} mr={2} />
        <Heading
          fontSize="2xl"
          fontFamily="Jura"
          fontWeight={400}
          _hover={{
            fontWeight: 999,
          }}
          transition="font-weight 500ms"
        >
          {process.env.APP_NAME || "App Name"}
        </Heading>
      </HStack>
      <Box h="100%" w="100%">
        <VStack h="100%" w="100%">
          <Box w="100%"></Box>
          <Box w="100%" h="50%">
            <Heading fontSize="xl" mb={2}>
              Notes
            </Heading>
            <Input
              py={4}
              px={4}
              rounded={100}
              mb={2}
              w="100%"
              bg="brand.50"
              borderColor="brand.900"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
              }}
            />
            <Tree filter={filter} />
          </Box>
        </VStack>
      </Box>
      <Spacer />
      <UserMenu />
    </VStack>
  );
}
