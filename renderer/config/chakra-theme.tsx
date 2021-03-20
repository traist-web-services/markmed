import { extendTheme } from "@chakra-ui/react";

import colors from "./colors";

const theme = extendTheme({
  colors: {
    brand: colors["traist-brand"],
  },
  config: { useSystemColorMode: true },
});

export default theme;
