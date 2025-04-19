import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./Context/ChatProvider";

// Create the root element for React rendering
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the React application
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
