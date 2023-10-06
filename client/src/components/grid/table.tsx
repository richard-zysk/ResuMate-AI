import * as React from "react";
import { AlertColor, Autocomplete, Box, Button, Chip, FormLabel, Grid, LinearProgress, ListItem, MenuItem, Paper, Select, SelectChangeEvent, Stack, TextField } from "@mui/material";
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
  const {loading, setLoading} = useAuth();
  const [open, setOpen] = React.useState(false);
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [data, setData] = React.useState([] as any)
  const [status, setStatus] =React.useState('')
  const [comments, setComments] = React.useState('')
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
        resumeId: resume?._id,
        id: index + 1,
        isDeleted: resume?.data?.isDeleted,
        name: resume?.data?.name,
        email: resume?.data?.email,
        phone: resume?.data?.phone,
        role: resume?.data?.role,
        score: resume?.data?.score,
        location: resume?.data?.place,
        skills: resume?.skills,
        status: resume?.status,
        comments: resume?.comments
      })
    })
    setData(formattedData)
    setLoading(false)
  }

  const fetchResumes = async () => {
    try {
      const data = await apiget('/pdf/list-scores')
      if (data?.data) {
        formatData(data?.data)
      }
    }
    catch (err: any) {
      setLoading(false)
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
      setLoading(false)
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
      setLoading(true);
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
      setLoading(false)
      console.log(err);
      setMessage({ msg: "failed", color: "error" })
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleOpen = async (params: any) => {
    try {
      const email = params?.row?.email
      const response = await apiget(`/pdf/list-S3?email=${email}`)
      const url = response?.data?.s3Url
      if (response) window?.open(url, '_blank')?.focus();
    }
    catch (err: any) {
      setLoading(false)
      setSnackOpen(true)
      setMessage({ msg: "Failed to Open", color: 'error' })
    }

  }

  const handleDelete = async (params: any) => {
    try {
      const email = params?.row?.email
      const response = await apiget(`/pdf/status?email=${email}`)
      console.log("DTA", response)
      if (response?.data) {
        setSnackOpen(true)
        setMessage({ msg: "Deleted successfully", color: 'success' })
        fetchResumes();
      }
    }
    catch (err: any) {
      setLoading(false)
      setSnackOpen(true)
      setMessage({ msg: "Failed to Delete", color: 'error' })
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
      width: 180,
      renderCell: (params: GridRenderCellParams<any>) => {

        let value = { label: params?.value, value: params?.value };
        const handleChange = (event: SelectChangeEvent) => {
          console.log(event.target.value, params?.value);
        };
        let options = [{ label: "New", value: "New" },
        { label: "InProgress", value: "InProgress" },
        { label: "Shortlisted", value: "Shortlisted" },
        { label: "OnHold", value: "OnHold" },
        { label: "Selected", value: "Selected" },
        { label: "Rejected", value: "Rejected" },
        { label: "InterviewScheduled", value: "InterviewScheduled" }]
        return (
          <Stack sx={{ width: "100%" }}>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={params?.value}
            defaultValue={params?.value}
            onChange={handleChange}
            label="Status"
            variant="standard"
          >
            {options.map((opt: any) => {
              return (<MenuItem value={opt?.value}>{opt?.label}</MenuItem>)
            })}
          </Select>
          </Stack>
        )
      },
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
                    label={data?.skill}
                  />
                </Grid>
              );
            })}
          </Grid>
        )
      },
    },
    {
      field: "comments",
      headerName: "Comments",
      sortable: false,
      minWidth: 240,
      editable: true,
      renderCell: (params: GridRenderCellParams<any, Date>) => {
        const handleChange = (event: any) => {
          console.log(event.target.value, params?.value);
        };
        return(
        <Stack sx={{ width: "100%" }}>
          <TextField
          id="outlined-multiline-static"
          label=""
          multiline
          rows={2}
          variant="outlined"
          onChange={handleChange}
          value={params?.value}
          defaultValue={params?.value}
        />
        </Stack>
      )}
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem icon={<LaunchIcon />} onClick={(e: any) => handleOpen(params)} label="Open" />,
        <GridActionsCellItem icon={<DeleteIcon />} onClick={(e: any) => handleDelete(params)} label="Delete" />,
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


