import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DropzoneComponent from "./dropzone";

interface DialogBoxProps {
  setOpen: Function;
  open: boolean;
  children: any;
  handleClose: any;
  handleSubmit: any;
  title?: string;
  primaryButtonText?: string;
}

export default function MaxWidthDialog(props: DialogBoxProps) {
  const { open, setOpen, children, handleClose, handleSubmit, primaryButtonText, title } = props;
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps["maxWidth"]>("md");

  return (
    <React.Fragment>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
        color="primary"
      >
        <DialogTitle>{title ?? 'Upload Files' }</DialogTitle>
        <DialogContent>
          <Box
            noValidate
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              width: "100%",
            }}
          >
            {children}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>{ primaryButtonText ?? 'Submit' }</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
