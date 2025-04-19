import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#f5f5f5",
      100: "#e2e2e2",
      200: "#c7c7c7",
      300: "#a8a8a8",
      400: "#8a8a8a",
      500: "#6b6b6b",
      600: "#4a4a4a",
      700: "#2b2b2b",
      800: "#1b1b1b",
      900: "#0b0b0b",
    },
    // Define other color schemes if needed
  },
  fonts: {
    heading: "Work Sans, sans-serif",
    body: "Work Sans, sans-serif",
  },
  styles: {
    global: {
      "html, body": {
        fontSize: "16px",
        fontWeight: "normal",
        color: "black", // Default text color
        bg: "white", // Default background color
      },
      "*": {
        boxSizing: "border-box",
      },
    },
  },
});

export default theme;
