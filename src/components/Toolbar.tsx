import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faCompress,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
  faRedo,
  faSitemap,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import React, { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useReactFlow } from "reactflow";
import { useContext, useTemporalStore } from "../store.js";

interface ItemProps {
  disabled?: boolean;
  text: string;
  callback?: () => void;
  icon: IconProp;
}

const Item: React.FC<ItemProps> = ({ disabled, text, callback, icon }) => {
  return (
    <Tooltip describeChild title={text} placement="right">
      <span>
        <IconButton disabled={disabled ?? false} onClick={callback}>
          <FontAwesomeIcon icon={icon} />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export interface ToolbarProps {}

export const Toolbar: React.FC<ToolbarProps> = () => {
  const useStore = useContext()

  const undo = useTemporalStore(useStore, (state) => state.undo);
  const redo = useTemporalStore(useStore, (state) => state.redo);
  const futureStates = useTemporalStore(useStore, (state) => state.futureStates);
  const pastStates = useTemporalStore(useStore, (state) => state.pastStates);
  const undoable = pastStates.length > 0;
  const redoable = futureStates.length > 0;
  const setShouldLayout = useCallback((value: boolean) => {
    useStore.setState({ shouldLayout: value });
  }, [useStore]);
  const flow = useReactFlow();

  const onLayout = useCallback(() => {
    setShouldLayout(true);
  }, [setShouldLayout]);

  useHotkeys(
    "mod+z",
    () => {
      undoable && undo();
    },
    { preventDefault: true }
  );

  useHotkeys(
    "mod+y, mod+shift+z",
    () => {
      redoable && redo();
    },
    { preventDefault: true }
  );

  return (
    <Box
      className="arguemapper-hidden"
      position="absolute"
      left={0}
      bottom={0}
      zIndex={10}
    >
      <Stack direction="column">
        <Item
          text="Automatically layout graph elements"
          callback={onLayout}
          icon={faSitemap}
        />
        <Item
          text="Undo last action"
          disabled={!undoable}
          callback={() => {
            undo();
          }}
          icon={faUndo}
        />
        <Item
          text="Redo last action"
          disabled={!redoable}
          callback={() => {
            redo();
          }}
          icon={faRedo}
        />
        <Item
          text="Zoom in"
          callback={() => {
            flow.zoomIn();
          }}
          icon={faMagnifyingGlassPlus}
        />
        <Item
          text="Zoom in"
          callback={() => {
            flow.zoomOut();
          }}
          icon={faMagnifyingGlassMinus}
        />
        <Item
          text="Fit graph in view"
          callback={() => {
            flow.fitView();
          }}
          icon={faCompress}
        />
      </Stack>
    </Box>
  );
};

export default Toolbar;