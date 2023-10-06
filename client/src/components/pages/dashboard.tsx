import React from "react";
import Table from "../grid/table";
import MenuAppBar from "../common/navbar";
import { Box } from "@mui/material";
import SearchChat from "../common/searchChat";

const DashBoard = () => {
  return (
    <>
      <MenuAppBar />
      <Table />
      <Box
        sx={{
          display: "flex",
          alignItems: "end",
          justifyContent: "end",
          py: 2,
        }}
      >
        <SearchChat />
      </Box>
    </>
  );
};

export default DashBoard;
