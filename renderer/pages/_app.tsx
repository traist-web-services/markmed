import Head from "next/head";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "../config/chakra-theme";

export default function Markmed(props) {
  const { Component, pageProps } = props;
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <title>{process.env.APP_NAME}</title>
      </Head>
      <style global jsx>{`
        @font-face {
          font-family: "Jura";
          src: url("fonts/Jura-VariableFont_wght.ttf")
            format("truetype-variations");
          font-weight: 1 999;
        }
      `}</style>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
