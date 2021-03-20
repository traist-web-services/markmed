import { app, ipcRenderer } from "electron";

import fs from "fs";
import { join } from "path";

import { useEffect, useReducer } from "react";

import Head from "next/head";

import { formatISO } from "date-fns";

import { Box, HStack, useColorModeValue, useToken } from "@chakra-ui/react";

import {
  AppDispatchContext,
  AppStateContext,
  AppContextDefault,
} from "../contexts/AppContext";

import { useAllNotesFiles } from "../hooks/useFilesystem";

import LeftBar from "../components/LeftBar";
import AppReducer from "../reducers/AppReducer";
import MainPanel from "../components/MainPanel";
import RightBar from "../components/RightBar";

const Home = () => {
  const [state, dispatch] = useReducer(AppReducer, AppContextDefault);
  const { fetchNotesDir } = useAllNotesFiles();

  const bg = useColorModeValue("brand.200", "brand.800");
  const color = useColorModeValue("brand.900", "brand.200");

  const [resolvedBg, resolvedColor] = useToken("colors", [bg, color]);

  useEffect(() => {
    const setUp = async () => {
      if (!ipcRenderer) {
        return;
      }
      let notesDir = state.notesDir;
      if (!notesDir) {
        notesDir = await ipcRenderer.invoke("getStoreValue", "notesDir");
        dispatch({ type: "SET_NOTES_DIR", payload: notesDir });
      }

      if (!notesDir) {
        notesDir = await ipcRenderer.invoke("get-notes-dir");
        if (!notesDir) {
          ipcRenderer.send("quit");
        }
        dispatch({ type: "SET_NOTES_DIR", payload: notesDir[0] });
        ipcRenderer.invoke("setStoreValue", {
          key: "notesDir",
          value: notesDir[0],
        });
      }

      const date = new Date();
      const filename = `${formatISO(date, { representation: "date" })}.md`;
      const fileToRead = join(notesDir, "Dailies", filename);
      fs.readFile(fileToRead, "utf-8", (error, data) => {
        dispatch({
          type: "SET_SELECTED_DATE",
          payload: date,
        });
        dispatch({
          type: "LOAD_FILE_FROM_DISK",
          payload: { currentFileName: fileToRead, currentFileContent: data },
        });
      });
    };
    setUp();
  }, []);

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME}</title>
      </Head>
      <style global jsx>{`
        ::-webkit-scrollbar {
          background: ${resolvedBg};
          width: 0.5rem;
        }

        ::-webkit-scrollbar-track {
          background-color: ${resolvedBg};
        }

        ::-webkit-scrollbar-thumb {
          background: ${resolvedColor};
          border-radius: 1000px;
        }

        ::-webkit-scrollbar-thumb:window-inactive {
          background: ${resolvedColor};
        }
      `}</style>

      <AppDispatchContext.Provider value={dispatch}>
        <AppStateContext.Provider value={state}>
          <HStack w="100%" h="100vh" spacing={0}>
            <Box w="25%" h="100%">
              <LeftBar />
            </Box>
            <Box w="50%" h="100%">
              <MainPanel />
            </Box>
            <Box w="25%" h="100%">
              <RightBar />
            </Box>
          </HStack>
        </AppStateContext.Provider>
      </AppDispatchContext.Provider>
    </>
  );
};

export default Home;
