import * as React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import SearchModal from "./searchModal";
import { Popover } from "@mui/material";

export default function SearchChat() {
  const [openSearchModal, setOpenSearchModal] = React.useState(false);
  const handleSearchOpen = () => {
    setOpenSearchModal(true);
  };
  return (
    <Box sx={{ "& > :not(style)": { p: 1 } }}>
      <SearchModal open={openSearchModal} setOpen={setOpenSearchModal} />
      <Fab color="secondary" aria-label="edit" onClick={handleSearchOpen}>
        <EditIcon />
      </Fab>
    </Box>
  );
}
