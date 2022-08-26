import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { theme } from "./utils";
import { MantineProvider } from "@mantine/core";

import "intl";
import "core-js";

// worker.init();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <App />
    </MantineProvider>
  </React.StrictMode>
);
