import * as React from "react";
import { AlertColor, Box, Button } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridToolbar,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import axios from "axios";
import MaxWidthDialog from "../common/dialogBox";
import DropzoneComponent from "../common/dropzone";
import CustomSnackbar from "../common/snackBar";
import { useAuth } from "../auth/authProvider";
import { apiget, apipost } from "../../services/axiosClient";
import { BASE_URL } from "../../appConstants";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "resume",
    headerName: "Resume",
    sortable: false,
    minWidth: 140,
    editable: false,
    renderCell: (params: GridRenderCellParams<any, Date>) => (
      <strong>
        <Button
          variant="contained"
          size="small"
          style={{ marginLeft: 16 }}
          tabIndex={params.hasFocus ? 0 : -1}
        >
          Open
        </Button>
      </strong>
    ),
  },
  {
    field: "firstName",
    headerName: "First name",
    width: 150,
    editable: true,
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 150,
    editable: true,
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 110,
    editable: true,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },
  {
    field: "status",
    headerName: "Status",
    type: "singleSelect",
    valueOptions: ["Rejected", "Accepted", "In Progress", "New"],
  },
];

const rows = [{ id: 1, lastName: "Snow", firstName: "Jon", age: 35 }];

const handleUpload = (e: any) => {
  const fileReader = new FileReader();

  fileReader.readAsDataURL(e?.target?.files[0]);
  fileReader.onload = (e) => {
    console.log("FILE", e?.target?.result);
    // this.setState((prevState) => ({
    //     [name]: [...prevState[name], e.target.result]
    // }));
  };
};

interface SnackMessageProps {
  msg: string;
  color: AlertColor;
}

export default function Table() {
  const [open, setOpen] = React.useState(false);
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [message, setMessage] = React.useState<SnackMessageProps>({
    msg: "uploaded!!",
    color: "success",
  });
  const [files, setFiles] = React.useState([] as any);

  const handleClose = () => {
    setOpen(false);
  };

  const fetchResumes = async()=>{
    try{
      const data = await apiget('/pdf/list-scores')
      if(data){
        console.log("Dta", data)
        setSnackOpen(true);
        setMessage({ msg: "uploaded", color: "success" })
      }
    }
    catch (err: any) {
      console.log(err);
      setMessage({ msg: "failed", color: "error" })
    }
    
  }

  const fetchEmails = async(email: string, index: number)=>{
    try{
      const results = await apipost(`/pdf/generate-score?email=${email}` ,{})
      if(index === (files.length -1) && results?.status === 201){
        fetchResumes()
      }
    }
    catch(err:any){
      console.log(err);
      setMessage({ msg: "failed", color: "error" }) 
    }
  }

  const handleSubmit = async () => {
    setOpen(false);
    const formData = new FormData();
    files.map((file: File)=>{
      formData.append("files", file)
    })
    try {
      const response = await axios.post(`${BASE_URL}/pdf/extract-texts`, formData, {
        headers: {
          "Content-Type": 'multipart/form-data'
      }});
    if (response) {
      response?.data?.map((file: any, index: number)=>{
        fetchEmails(file?.text?.email, index)
      })
    }
  } catch (err: any) {
    console.log(err);
    setMessage({ msg: "failed", color: "error" })
  }
};

const handleClickOpen = () => {
  setOpen(true);
};
return (
  <Box sx={{ height: 400, width: "100%" }}>
    <Button variant="contained" component="label" onClick={handleClickOpen}>
      Upload File
    </Button>
    <MaxWidthDialog
      setOpen={setOpen}
      open={open}
      handleClose={handleClose}
      handleSubmit={handleSubmit}
      children={<DropzoneComponent files={files} setFiles={setFiles} />}
    />
    <DataGrid
      rows={rows}
      columns={columns}
      slots={{
        toolbar: GridToolbar,
      }}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 5,
          },
        },
      }}
      pageSizeOptions={[5]}
      checkboxSelection
      disableRowSelectionOnClick
    />
    <CustomSnackbar
      open={snackOpen}
      setOpen={setSnackOpen}
      message={message.msg}
      severity={message.color}
    />
  </Box>
);
}
