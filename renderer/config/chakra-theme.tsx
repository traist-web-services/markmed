import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      "50": "#f3f7fa",
      "100": "#e7eff4",
      "200": "#c2d8e4",
      "300": "#9ec0d3",
      "400": "#5591b2",
      "500": "#0C6291",
      "600": "#0b5883",
      "700": "#094a6d",
      "800": "#073b57",
      "900": "#063047",
    },
  },
  config: { useSystemColorMode: true },
});

export default theme;
