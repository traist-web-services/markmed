import { HighlightStyle, tags as t } from "@codemirror/highlight";
import {
  EditorView,
  keymap,
  highlightSpecialChars,
  highlightActiveLine,
} from "@codemirror/view";
import { EditorState, Extension } from "@codemirror/state";
import { history, historyKeymap } from "@codemirror/history";
import { indentOnInput } from "@codemirror/language";
import { defaultKeymap } from "@codemirror/commands";
import { bracketMatching } from "@codemirror/matchbrackets";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/closebrackets";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { markdown } from "@codemirror/lang-markdown";

import { useColorModeValue } from "@chakra-ui/react";

export const MainTheme = EditorView.theme(
  {
    "&": {
      outline: "0px solid transparent !important",
    },
    "& *": {
      fontFamily:
        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      whiteSpace: "break-spaces",
      outline: "0px solid transparent",
    },

    "&.cm-focused .cm-cursor": { opacity: 1 },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {},

    ".cm-panels": {},
    ".cm-panels.cm-panels-top": {},
    ".cm-panels.cm-panels-bottom": {},

    ".cm-searchMatch": {},
    ".cm-searchMatch.cm-searchMatch-selected": {},

    ".cm-line:not(.cm-activeLine)": { opacity: 0.7 },
    ".cm-activeLine": { opacity: 1, background: "transparent" },
    ".cm-selectionMatch": {},

    ".cm-matchingBracket, .cm-nonmatchingBracket": {},

    ".cm-gutters": {
      background: "transparent",
    },
    ".cm-lineNumbers .cm-gutterElement": {},

    ".cm-foldPlaceholder": {},

    ".cm-tooltip": {},
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {},
    },
    ".cm-scroller": {
      outline: "none",
    },
  },
  { dark: false }
);

/// The highlighting style for code in the One Dark theme.
export const ThemeHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: "red" },
  {
    tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
    color: "red",
  },
  { tag: [t.function(t.variableName), t.labelName], color: "red" },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: "red" },
  { tag: [t.definition(t.name), t.separator], color: "red" },
  {
    tag: [
      t.typeName,
      t.className,
      t.number,
      t.changed,
      t.annotation,
      t.modifier,
      t.self,
      t.namespace,
    ],
    color: "red",
  },
  {
    tag: [
      t.operator,
      t.operatorKeyword,
      t.url,
      t.escape,
      t.regexp,
      t.link,
      t.special(t.string),
    ],
    color: "red",
  },
  { tag: [t.meta, t.comment], color: "red" },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.link, textDecoration: "underline" },
  { tag: t.heading, fontWeight: "bold" },
  {
    tag: t.heading1,
    fontWeight: "bold",
    fontSize: "2.875rem",
    lineHeight: "1.8em",
  },
  {
    tag: t.heading2,
    fontWeight: "bold",
    fontSize: "2.25rem",
    lineHeight: "1.8em",
  },
  {
    tag: t.heading3,
    fontWeight: "bold",
    fontSize: "1.75rem",
    lineHeight: "1.8em",
  },
  {
    tag: t.heading4,
    fontWeight: "bold",
    fontSize: "1.375rem",
    lineHeight: "1.8em",
  },
  {
    tag: t.heading5,
    fontWeight: "bold",
    fontSize: "1.125rem",
    lineHeight: "1.8em",
  },
  {
    tag: t.heading5,
    fontWeight: "bold",
    fontSize: "1rem",
    lineHeight: "1.8em",
  },
  {
    tag: [t.atom, t.bool, t.special(t.variableName)],
    color: "red",
    lineHeight: "1.8em",
  },
  {
    tag: [t.processingInstruction, t.string, t.inserted],
    opacity: 0.5,
  },
  { tag: t.invalid, color: "red" },
]);

/// Extension to enable the One Dark theme (both the editor theme and
/// the highlight style).
export const Extensions: Extension[] = [
  MainTheme,
  ThemeHighlightStyle,
  highlightSpecialChars(),
  history(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  bracketMatching(),
  closeBrackets(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  keymap.of([
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...closeBracketsKeymap,
  ]),
  markdown(),
];
