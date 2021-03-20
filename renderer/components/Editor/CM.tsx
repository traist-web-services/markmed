import { promises as fs } from "fs";
import { ipcRenderer } from "electron";

import { useContext, useEffect, useRef, useState } from "react";

import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";

import { differenceInSeconds, formatISO } from "date-fns";

import {
  Box,
  useColorMode,
  useColorModeValue,
  useToken,
} from "@chakra-ui/react";

import { AppStateContext, AppDispatchContext } from "../../contexts/AppContext";

import { Extensions } from "./CMExt";

const CM = () => {
  const { currentFileContent, currentFileName, selectedDate } = useContext(
    AppStateContext
  );

  const { colorMode } = useColorMode();
  const [lastSave, setLastSave] = useState(new Date());
  const dispatch = useContext(AppDispatchContext);
  const editor = useRef<EditorView>();

  const bg = useColorModeValue("brand.200", "brand.800");
  const color = useColorModeValue("brand.900", "brand.200");

  const [resolvedBg, resolvedColor] = useToken("colors", [bg, color]);

  const caretColor = EditorView.theme({
    "& *": {
      caretColor: resolvedColor,
    },
  });

  const save = () => {
    if (!editor.current.state.doc.toString() || !currentFileName) {
      return;
    }

    fs.writeFile(currentFileName, editor.current.state.doc.toString())
      .then((e) => {
        setLastSave(new Date());
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const updateListener = () =>
    EditorView.updateListener.of((e) => {
      const doc = e.state.doc.toString();
      if (differenceInSeconds(lastSave, new Date()) > 10) {
        save();
      }
      dispatch({
        type: "SET_EDITOR_CONTENT",
        payload: editor.current.state.doc.toString(),
      });
    });

  useEffect(() => {
    const el = document.getElementById("codemirror-editor-wrapper");
    const initialContent =
      currentFileContent ??
      `# ${formatISO(selectedDate, { representation: "date" })}`;

    editor.current = new EditorView({
      state: EditorState.create({
        doc: initialContent,
        extensions: [...Extensions, caretColor, updateListener()],
      }),

      parent: el as Element,
    });

    if (!currentFileContent) {
      save();
    }

    ipcRenderer.on("before-quit", save);

    return () => {
      if (!editor.current.state.doc.toString() || !currentFileName) {
        editor?.current.destroy();
        return;
      }
      if (currentFileContent !== editor.current.state.doc.toString()) {
        save();
      }
      ipcRenderer.removeListener("before-quit", save);
      editor?.current.destroy();
    };
  }, [currentFileContent, currentFileName, selectedDate, colorMode]);

  return (
    <Box w="60ch" margin="auto" h="100%" overflowY="auto">
      <div
        id="codemirror-editor-wrapper"
        style={{ height: "100%", width: "100%" }}
      />
    </Box>
  );
};

export default CM;
