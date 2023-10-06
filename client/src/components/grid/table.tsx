import * as React from "react";
import { AlertColor, Box, Button, Chip, FormLabel, Grid, LinearProgress, ListItem, Paper, Stack } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridToolbar,
  GridRenderCellParams,
  GridActionsCellItem,
  GridRowParams,
} from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import LaunchIcon from '@mui/icons-material/Launch';
import axios from "axios";
import MaxWidthDialog from "../common/dialogBox";
import DropzoneComponent from "../common/dropzone";
import CustomSnackbar from "../common/snackBar";
import { useAuth } from "../auth/authProvider";
import { apiget, apipost } from "../../services/axiosClient";
import { BASE_URL } from "../../appConstants";





interface SnackMessageProps {
  msg: string;
  color: AlertColor;
}

export default function Table() {
  const [open, setOpen] = React.useState(false);
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [data, setData] = React.useState([] as any)
  const [message, setMessage] = React.useState<SnackMessageProps>({
    msg: "uploaded!!",
    color: "success",
  });
  const [files, setFiles] = React.useState([] as any);

  const handleClose = () => {
    setOpen(false);
  };

  const formatData = (list: any) => {
    const formattedData = [] as any
    list?.map((resume: any, index: number) => {
      formattedData?.push({
        id: index + 1,
        isDeleted: resume?.data?.isDeleted,
        name: resume?.data?.name,
        email: resume?.data?.email,
        phone: resume?.data?.phone,
        role: resume?.data?.role,
        score: resume?.data?.score,
        location: resume?.data?.place,
        skills: resume?.skills
      })
    })
    setData(formattedData)
  }

  const fetchResumes = async () => {
    try {
      const data = await apiget('/pdf/list-scores')
      if (data?.data) {
        formatData(data?.data)
      }
    }
    catch (err: any) {
      console.log(err);
      setMessage({ msg: "failed", color: "error" })
    }

  }

  const fetchEmails = async (email: string, index: number) => {
    try {
      const results = await apipost(`/pdf/generate-score?email=${email}`, {})
      if (index === (files.length - 1) && results?.status === 201) {
        setSnackOpen(true);
        setMessage({ msg: "uploaded", color: "success" })
        fetchResumes();
      }
    }
    catch (err: any) {
      console.log(err);
      setMessage({ msg: "failed", color: "error" })
    }
  }

  const handleSubmit = async () => {
    setOpen(false);
    const formData = new FormData();
    files.map((file: File) => {
      formData.append("files", file)
    })
    try {
      const response = await axios.post(`${BASE_URL}/pdf/extract-texts`, formData, {
        headers: {
          "Content-Type": 'multipart/form-data'
        }
      });
      if (response) {
        response?.data?.map((file: any, index: number) => {
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

  const handleOpen = async (params: any ) => {
    try{
      const response = await apiget('/pdf/list-S3')
      console.log("DTA", response)
    }
    catch(err: any){
      setSnackOpen(err?.data)
    }

  }

  const handleDelete = async (params: any) => {
    try{
      const response = await apiget('/pdf/list-S3')
      console.log("DTA", response)
      if(response?.status == 201){
        fetchResumes();
      }
    }
    catch(err: any){
      setSnackOpen(err?.data)
    }
  }

  React.useEffect(() => {
    fetchResumes();
  }, []);


  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      width: 150,
      editable: true,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
      editable: true,
    },
    {
      field: "location",
      headerName: "Present Location",
      width: 150,
      editable: true,
    },
    {
      field: "role",
      headerName: "Suited Role",
      width: 150,
      editable: true,
    },
    {
      field: "score",
      headerName: "Score",
      renderCell: (params: GridRenderCellParams<any>) => {
        let color = "0,255,0"
        let progress = params?.value
        if (params?.value <= 25) {
          color = "255,0,0"
        } else if (params?.value <= 50) {
          color = "255,255,0"
        } else if (params?.value <= 75) {
          color = "0,0,255"
        } else {
          color = "0,255,0";
        }
        return (
          <Stack sx={{ width: "100%" }}>
          <FormLabel>{progress}%</FormLabel>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              backgroundColor: `rgb(${color},0.4)`,
              "& .MuiLinearProgress-bar": {
                backgroundColor: `rgb(${color})`
              }
            }}
          />
        </Stack>
          
        )
      }
    },
    {
      field: "status",
      headerName: "Status",
      type: "singleSelect",
      valueOptions: ["Rejected", "Accepted", "In Progress", "New"],
    },
    {
      field: "skills",
      headerName: "Skills",
      width: 400,
      maxWidth: 800,
      type: "actions",
      renderCell: (params: GridRenderCellParams<any>) => {
        let arr = [] as any;
        arr = params?.value;
        return (
          <Grid container spacing={1}>
            {arr?.map((data: any) => {
  
              return (
                <Grid item >
                  <Chip
                    label={data}
                  />
                </Grid>
              );
            })}
          </Grid>
        )
      },
    },
    // {
    //   field: "resume",
    //   headerName: "Resume",
    //   sortable: false,
    //   minWidth: 140,
    //   editable: false,
    //   renderCell: (params: GridRenderCellParams<any, Date>) => (
    //     <strong>
    //       <Button
    //         variant="contained"
    //         size="small"
    //         style={{ marginLeft: 16 }}
    //         tabIndex={params.hasFocus ? 0 : -1}
    //       >
    //         Open
    //       </Button>
    //     </strong>
    //   ),
    // },
    {
      field: 'actions',
      type: 'actions',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem icon={<DeleteIcon/>} onClick={(e: any)=>handleDelete(params)} label="Delete" showInMenu/>,
        <GridActionsCellItem icon={<LaunchIcon/>} onClick={(e: any)=>handleOpen(params)} label="Open" showInMenu />,
      ]
    }
  ];
  const rows = data

  return (
    <Box sx={{ width: "100%" }}>
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
              pageSize: 50,
            },
          },
        }}
        pageSizeOptions={[10]}
        checkboxSelection
        disableRowSelectionOnClick
        getRowHeight={() => 'auto'}
        components={{
          NoRowsOverlay: () => (
            <Box height="100%" alignItems="center" justifyContent="center">
              No rows in DataGrid
            </Box>
          ),
          NoResultsOverlay: () => (
            <Box height="100%" alignItems="center" justifyContent="center">
              Local filter returns no result
            </Box>
          )
        }}
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


