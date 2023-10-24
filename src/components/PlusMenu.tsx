import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import { produce } from "immer";
import React from "react";
import { useReactFlow } from "reactflow";
import * as model from "../model.js";
import { canvasCenter, useContext, State } from "../store.js";

interface ItemProps {
  callback: () => void;
  close: () => void;
  icon: IconProp;
  text: string;
}

const Item: React.FC<ItemProps> = ({ callback, close, icon, text }) => {
  return (
    <MenuItem
      onClick={() => {
        callback();
        close();
      }}
    >
      <ListItemIcon>
        <FontAwesomeIcon icon={icon} />
      </ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </MenuItem>
  );
};

export interface PlusMenuProps {
  plusButton: null | HTMLElement;
  setPlusButton: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

export const PlusMenu: React.FC<PlusMenuProps> = ({
  plusButton,
  setPlusButton,
}) => {
  const useStore = useContext()

  const theme = useTheme();
  const isOpen = Boolean(plusButton);
  const open = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPlusButton(event.currentTarget);
  };
  const close = () => {
    setPlusButton(null);
  };
  const flow = useReactFlow();

  return (
    <>
      <Box
        className="arguemapper-hidden"
        position="absolute"
        right={10}
        bottom={10}
        zIndex={10}
      >
        <IconButton
          size="large"
          sx={{ backgroundColor: theme.palette.primary.dark }}
          onClick={open}
        >
          <FontAwesomeIcon icon={faPlus} />
        </IconButton>
      </Box>
      <Menu
        open={isOpen}
        onClose={close}
        anchorEl={plusButton}
        sx={{ zIndex: 10, marginBottom: 10 }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Item
          callback={() => {
            const { x, y } = flow.project(canvasCenter(useStore));
            const node = model.initAtom({
              data: { text: "" },
              position: { x, y },
            });
            node.selected = true;

            useStore.setState(
              produce((draft: State) => {
                draft.nodes.push(node);
              })
            );
          }}
          close={close}
          icon={faPlus}
          text="Add Atom"
        />
        <Item
          callback={() => {
            const { x, y } = flow.project(canvasCenter(useStore));
            const node = model.initScheme({ data: {}, position: { x, y } });
            node.selected = true;

            useStore.setState(
              produce((draft: State) => {
                draft.nodes.push(node);
              })
            );
          }}
          close={close}
          icon={faPlus}
          text="Add Scheme"
        />
      </Menu>
    </>
  );
};
