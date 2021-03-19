import { ipcRenderer } from "electron";
import os from "os";

import { useContext, useEffect } from "react";

import {
  Grid,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

import { VscSettingsGear } from "react-icons/vsc";

import { AppDispatchContext } from "../../contexts/AppContext";

export default function UserMenu() {
  const { toggleColorMode } = useColorMode();
  const dispatch = useContext(AppDispatchContext);
  const setNotesDir = async () => {
    if (!ipcRenderer) {
      return;
    }

    const dir = await ipcRenderer.invoke("get-notes-dir");
    if (dir && dir[0]) {
      dispatch({ type: "SET_NOTES_DIR", payload: dir[0] });
      ipcRenderer.invoke("setStoreValue", {
        key: "notesDir",
        value: dir[0],
      });
    }
  };

  const handleQuit = () => {
    ipcRenderer.send("quit");
  };

  const bg = useColorModeValue("brand.200", "brand.800");
  const color = useColorModeValue("brand.900", "brand.200");
  return (
    <HStack alignItems="center" w="100%">
      <Grid
        w={12}
        h={12}
        rounded={100}
        placeItems="center"
        bg={color}
        color={bg}
      >
        <Text casing="capitalize" fontWeight={700} fontSize="xl">
          {os.userInfo().username[0]}
        </Text>
      </Grid>
      <Text casing="capitalize">{os.userInfo().username}</Text>
      <Spacer />
      <Menu colorScheme="brand">
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<VscSettingsGear />}
          size="md"
          variant="outline"
          _active={{
            outline: "0px solid transparent",
          }}
          _focus={{
            outline: "0px solid transparent",
          }}
        />
        <MenuList>
          <MenuItem onClick={setNotesDir}>Choose notes directory</MenuItem>
          <MenuItem onClick={toggleColorMode}>Toggle dark mode</MenuItem>
          <MenuItem onClick={handleQuit}>Quit</MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  );
}
