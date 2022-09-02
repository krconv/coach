import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { theme } from "./utils";

import "core-js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "intl";

dayjs.extend(relativeTime);

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
