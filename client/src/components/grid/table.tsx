import * as React from "react";
import {
  AlertColor,
  Autocomplete,
  Box,
  Button,
  Chip,
  DialogContentText,
  FormLabel,
  Grid,
  LinearProgress,
  ListItem,
  MenuItem,
  Paper,
  Popover,
  Popper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
  TooltipProps,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridToolbar,
  GridRenderCellParams,
  GridActionsCellItem,
  GridRowParams,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import LaunchIcon from "@mui/icons-material/Launch";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import axios from "axios";
import MaxWidthDialog from "../common/dialogBox";
import DropzoneComponent from "../common/dropzone";
import CustomSnackbar from "../common/snackBar";
import { useAuth } from "../auth/authProvider";
import { apidelete, apiget, apipost, apiput } from "../../services/axiosClient";
import { BASE_URL } from "../../appConstants";
import ReactWordcloud from "react-wordcloud";

export default function Table() {
  const { loading, snackOpen, setSnackOpen, message, setLoading, setMessage } =
    useAuth();
  const [open, setOpen] = React.useState(false);
  const [selectedParams, setSelectedParams] = React.useState<any>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [data, setData] = React.useState([] as any);
  const [status, setStatus] = React.useState("");
  const [comments, setComments] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElName, setAnchorElName] = React.useState<null | HTMLElement>(null);
  const [files, setFiles] = React.useState([] as any);

  const handleClose = () => {
    setOpen(false);
    setFiles([]);
  };

  const formatData = (list: any) => {
    const formattedData = [] as any;
    list?.map((resume: any, index: number) => {
      formattedData?.push({
        resumeId: resume?._id,
        id: index + 1,
        isDeleted: resume?.isDeleted,
        name: resume?.name,
        email: resume?.email,
        phone: resume?.phone,
        role: resume?.suitable_role,
        score: resume?.score,
        location: resume?.place,
        skills: resume?.skills,
        status: resume?.status,
        comments: resume?.comments,
      });
    });
    setData(formattedData);
    setLoading(false);
  };

  const fetchResumes = async () => {
    try {
      const data = await apiget("/pdf/list-scores");
      if (data?.data) {
        formatData(data?.data);
      }
    } catch (err: any) {
      setLoading(false);
      setSnackOpen(true);
      setMessage({ msg: "failed", color: "error" });
    }
  };

  const fetchEmails = async (email: string, index: number) => {
    try {
      const results = await apipost(`/pdf/generate-score?email=${email}`, {});
      if (index === files.length - 1 && results?.data) {
        setSnackOpen(true);
        setMessage({ msg: "uploaded files!!", color: "success" });
        fetchResumes();
      }
    } catch (err: any) {
      setLoading(false);
      setSnackOpen(true);
      setMessage({ msg: "failed", color: "error" });
    }
  };

  const handleSubmit = async () => {
    setOpen(false);
    const formData = new FormData();
    files.map((file: File) => {
      formData.append("files", file);
    });
    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/pdf/extract-texts`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response) {
        response?.data?.map((file: any, index: number) => {
          fetchEmails(file?.text?.email, index);
        });
        setFiles([]);
      }
    } catch (err: any) {
      setLoading(false);
      console.log(err);
      setSnackOpen(true);
      setMessage({ msg: "failed", color: "error" });
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
    setFiles([]);
  };

  const handleOpen = async (params: any) => {
    try {
      const email = params?.row?.email;
      const response = await apiget(`/pdf/list-S3?email=${email}`);
      const url = response?.data?.s3Url;
      if (response) window?.open(url, "_blank")?.focus();
    } catch (err: any) {
      setLoading(false);
      setSnackOpen(true);
      setMessage({ msg: "Failed to Open", color: "error" });
    }
  };

  const handleDelete = async () => {
    setDeleteOpen(false);
    try {
      const email = selectedParams?.row?.email;
      const response = await apidelete(`/pdf/delete-user-score?email=${email}`);
      if (response?.data?.statusCode == 204) {
        setSnackOpen(true);
        setMessage({ msg: "Deleted successfully", color: "success" });
        fetchResumes();
      }
    } catch (err: any) {
      setLoading(false);
      setSnackOpen(true);
      setMessage({ msg: "Failed to Delete", color: "error" });
    }
  };

  const handleDeleteConfirm = (params: any) => {
    setDeleteOpen(true);
    setSelectedParams(params);
  };

  React.useEffect(() => {
    fetchResumes();
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      renderCell: (params: GridRenderCellParams<any>) => {
        const skills = params?.row?.skills.map((skill: any)=>({
          text: skill?.skill,
          value:skill?.value
        }))
        // const words = [
        //   {
        //     text: "told",
        //     value: 64,
        //   },
        //   {
        //     text: "mistake",
        //     value: 11,
        //   },
        //   {
        //     text: "thought",
        //     value: 16,
        //   },
        //   {
        //     text: "bad",
        //     value: 17,
        //   },
        // ];
        const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
          setAnchorElName(event.currentTarget);
        };
      
        const handlePopoverClose = () => {
          setAnchorElName(null);
        };
      
        const openName = Boolean(anchorEl);
        return (
          <div>
          <Typography
            aria-owns={openName ? 'mouse-over-popover' : undefined}
            aria-haspopup="true"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            {params?.value}
          </Typography>
          <Popover
            id="mouse-over-popover"
            sx={{
              pointerEvents: 'none',
            }}
            open={openName}
            anchorEl={anchorElName}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            {/* <ReactWordcloud words={skills}/> */}
            <Typography sx={{ p: 1 }}>{params?.value}</Typography>
          </Popover>
        </div>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      width: 150,
      maxWidth: 300,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
      maxWidth: 300,
    },
    {
      field: "location",
      headerName: "Present Location",
      width: 150,
      maxWidth: 300,
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
        let color = "0,0,0";
        let progress = params?.value;
        if (params?.value >= 25) {
          color = "230, 0, 0";
        } else if (params?.value >= 50) {
          color = "255, 153, 51";
        } else if (params?.value >= 75) {
          color = "0, 153, 51";
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
                  backgroundColor: `rgb(${color})`,
                },
              }}
            />
          </Stack>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 180,
      renderCell: (params: GridRenderCellParams<any>) => {
        const handleChange = async (event: SelectChangeEvent) => {
          setStatus(event?.target?.value);
          const data = {
            email: params?.row?.email,
            status: event?.target?.value,
            comments: params?.row?.comments,
          };
          try {
            const response = await apiput("/pdf/update-status/comments", data);
            console.log("response");
            if (response) {
              setSnackOpen(true);
              setMessage({ msg: "Status updated", color: "success" });
            }
          } catch (err) {
            setSnackOpen(true);
            setMessage({ msg: "Could not update status", color: "error" });
          }
        };
        let options = [
          { label: "New", value: "New" },
          { label: "InProgress", value: "InProgress" },
          { label: "Shortlisted", value: "Shortlisted" },
          { label: "OnHold", value: "OnHold" },
          { label: "Selected", value: "Selected" },
          { label: "Rejected", value: "Rejected" },
          { label: "InterviewScheduled", value: "InterviewScheduled" },
        ];
        return (
          <Stack sx={{ width: "100%" }}>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={status != "" ? status : params?.value}
              defaultValue={params?.value}
              onChange={handleChange}
              label="Status"
              variant="standard"
            >
              {options.map((opt: any) => {
                return <MenuItem value={opt?.value}>{opt?.label}</MenuItem>;
              })}
            </Select>
          </Stack>
        );
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
                <Grid item>
                  <Chip label={data?.skill} />
                </Grid>
              );
            })}
          </Grid>
        );
      },
    },
    {
      field: "comments",
      headerName: "Comments",
      sortable: false,
      minWidth: 240,
      editable: true,
      renderCell: (params: GridRenderCellParams<any, Date>) => {
        const handleChange = async (
          event: any
        ) => {
          console.log(event)
          setComments(event?.target?.value);
          const data = {
            email: params?.row?.email,
            status: params?.row?.status,
            comments: event?.target?.value,
          };
          try {
            const response = await apiput("/pdf/update-status/comments", data);
            console.log("response");
            if (response) {
              setSnackOpen(true);
              setMessage({ msg: "Comments updated", color: "success" });
            }
          } catch (err) {
            setSnackOpen(true);
            setMessage({ msg: "Could not update comments", color: "error" });
          }
        };
        const handleClick = (event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(anchorEl ? null : event.currentTarget);
        };

        const openComments = Boolean(anchorEl);
        const id = openComments ? "simple-popper" : undefined;
        return (
          <Stack sx={{ width: "100%" }}>
            <div>
              <Button onClick={handleClick}>Add Comments</Button>
              <Popper id={id} open={openComments} anchorEl={anchorEl}>
                <Box
                  sx={{ border: 1, p: 1, bgcolor: "background.paper" }}
                  component="form"
                  onSubmit={handleChange}
                >
                  <TextField
                    id="outlined-multiline-static"
                    label=""
                    multiline
                    rows={2}
                    variant="outlined"
                    value={comments != "" ? comments : params?.value}
                    defaultValue={params?.value}
                  />
                  <Button type="submit">Add</Button>
                </Box>
              </Popper>
            </div>
          </Stack>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<LaunchIcon />}
          onClick={(e: any) => handleOpen(params)}
          label="Open"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          onClick={(e: any) => handleDeleteConfirm(params)}
          label="Delete"
        />,
      ],
    },
  ];
  const rows = data;

  return (
    <Box sx={{ width: "100%", py: 5, px: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "end",
          justifyContent: "end",
          py: 2,
        }}
      >
        <Button
          variant="contained"
          component="label"
          onClick={handleClickOpen}
          startIcon={<UploadFileIcon />}
        >
          Upload Files
        </Button>
      </Box>
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
        getRowHeight={() => "auto"}
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
          ),
        }}
      />
      <MaxWidthDialog
        setOpen={setDeleteOpen}
        open={deleteOpen}
        handleClose={() => {
          setDeleteOpen(false);
        }}
        handleSubmit={handleDelete}
        title=" Are you sure you want to delete?"
        primaryButtonText="Delete"
        children={
          <Box>
            <DialogContentText>
              This resume will be deleted permanently. Please confirm your
              action.
            </DialogContentText>
          </Box>
        }
      />
    </Box>
  );
}
