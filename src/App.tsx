import { Box, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";
import { useStore as useFlowStore } from "reactflow";
import Graph from "./components/Graph.js";
import Header from "./components/Header.js";
import Inspector from "./components/Inspector.js";
import Resources from "./components/Resources.js";
// import Sidebar from "./components/Sidebar.js";
import { useContext } from "./store.js";

import React, { createContext } from "react";
//import "@fontsource/roboto/300.css";
//import "@fontsource/roboto/400.css";
//import "@fontsource/roboto/500.css";
//import "@fontsource/roboto/700.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Paper from '@mui/material/Paper';
import { ConfirmProvider } from "material-ui-confirm";
import { SnackbarProvider } from "notistack";
import CacheBuster from "react-cache-buster";
// import { createRoot } from "react-dom/client";
import { ReactFlowProvider } from "reactflow";
import { version as npmVersion } from "../package.json";
import ErrorBoundary from "./components/ErrorBoundary.js";
import "./style.css";
import theme from "./theme.js";
// import {StoreApi, create, UseBoundStore} from "zustand";
import {useComponentStore} from "./store.js";


// https://dev.to/maciejtrzcinski/100vh-problem-with-ios-safari-3ge9

// Properties for arguemapper-core
type ArguemapperArgs = {
  width?: number;
  height?: number;
  sidebarWidth?: number;
  persist?: boolean;
}

export const StoreContext = createContext<undefined |  ReturnType<typeof useComponentStore>>(undefined);


const Layout: React.FC<ArguemapperArgs> = ({width, height, sidebarWidth, persist = false}) => {
  // const sidebarWidth = useStore((state) => state.sidebarWidth);
  /*
  const useStore = create<State>()(
    () => initialState
  );
  //const store = useStore();
  //const { getState, setState, subscribe } = useStore;
  */

  const useStore = useContext();
  // const useStore = store.setState;

  const isMobile = useMediaQuery(useTheme().breakpoints.down("md"));
  
  const leftSidebarOpen = useStore((state) => state.leftSidebarOpen);
  const rightSidebarOpen = useStore((state) => state.rightSidebarOpen);


  useEffect(() => {
    useStore.setState({ leftSidebarOpen: !isMobile, rightSidebarOpen: !isMobile });
  }, [isMobile]);

  const setLeftSidebarOpen = (value: boolean) => {
    useStore.setState({ leftSidebarOpen: value });
  };

  const setRightSidebarOpen = (value: boolean) => {
    useStore.setState({ rightSidebarOpen: value });
  };

  const resetSelectedElements = useFlowStore(
    (state) => state.resetSelectedElements
  );

  return (
    <Box width={width} height={height}>
      <Stack direction="row" justifyContent={"center"} sx={{width: "100%", height: "100%"}}>
        <Paper sx={{overflow: 'auto', width: sidebarWidth, borderRadius: "0px"}}>
        <Resources />
        </Paper>
        <Stack sx={{ height: "100%", width: "100%"}}>
          <Header
            toggleLeft={() => setLeftSidebarOpen(!leftSidebarOpen)}
            toggleRight={() => setRightSidebarOpen(!rightSidebarOpen)}
          />
          <Graph />
        </Stack>
        <Paper sx={{overflow: 'auto', width: sidebarWidth, borderRadius: "0px"}}>
          <Inspector
            close={() => {
              if (isMobile) {
                setRightSidebarOpen(false);
              }
              resetSelectedElements();
            }}
          />
          </Paper>
      </Stack>
    </Box>
  );
}


export const Arguemapper: React.FC<ArguemapperArgs> = ({width = 1000, height = 400, sidebarWidth = 300, persist=true}) => {
  // https://stackoverflow.com/a/58936230
  // const query = window.matchMedia("(prefers-color-scheme: dark)");
  // const [darkMode, setDarkMode] = useState(query.matches);
  // query.addEventListener("change", (e) => setDarkMode(e.matches));
  const useStore = useComponentStore(persist);

  const darkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const isProduction = process.env.NODE_ENV === "production";

  return (
    // @ts-ignore
    <CacheBuster
      currentVersion={npmVersion}
      isEnabled={isProduction}
      isVerboseMode={false}
      loadingComponent={undefined}
    >
      <ThemeProvider theme={theme(darkMode)}>
        <CssBaseline />
        <ConfirmProvider
          defaultOptions={{
            title: "Are you sure?",
            description: "This action is destructive and cannot be undone!",
            confirmationText: "OK",
            cancellationText: "Cancel",
            confirmationButtonProps: { autoFocus: true },
          }}
        >
          <SnackbarProvider maxSnack={3} preventDuplicate>
            <ErrorBoundary>
              <ReactFlowProvider>
                <StoreContext.Provider value={useStore}>
                  <Layout width={width} height={height} sidebarWidth={sidebarWidth}/>
                </StoreContext.Provider>
              </ReactFlowProvider>
            </ErrorBoundary>
          </SnackbarProvider>
        </ConfirmProvider>
      </ThemeProvider>
    </CacheBuster>
  );
}
