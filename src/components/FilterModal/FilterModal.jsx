/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogContent,
  IconButton,
  useMediaQuery,
  Slide,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { forwardRef } from "react";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FilterModal = ({ open, onClose, children }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down(700));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xl"
      PaperProps={{
        style: {
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          width: "100%",
          height: "auto",
          margin: "0",
          position: "fixed",
          bottom: 0,
        },
      }}
      TransitionComponent={Transition}
      TransitionProps={{
        onEntering: () => {
          if (fullScreen) {
            document.body.style.overflow = "hidden";
          }
        },
        onExiting: () => {
          if (fullScreen) {
            document.body.style.overflow = "auto";
          }
        },
      }}
    >
      <DialogContent
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          position: "relative",
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
