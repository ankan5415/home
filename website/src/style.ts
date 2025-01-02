import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React from "react";

// Extend the default theme
const theme = extendTheme({
  colors: {
    text: "#494949",
  },
  styles: {
    global: {
      // This will apply the color to most text elements globally
      body: {
        color: "text",
      },
    },
  },
  components: {
    // If there are specific components that don't inherit the global styles, you can adjust them here
    Heading: {
      baseStyle: {
        color: "text",
      },
    },
    Text: {
      baseStyle: {
        color: "text",
      },
    },
    // ... add more components as needed
  },
});
export default theme;
