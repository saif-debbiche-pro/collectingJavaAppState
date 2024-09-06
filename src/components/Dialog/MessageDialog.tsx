import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));



interface CustomizedDialogsProps {
    message: string[]|string;
    openDialog:boolean;
    setOpenDialog:Function;
    setMessage:Function;
    action:Function
  }

  const MessageDialog: React.FC<CustomizedDialogsProps> = ({ message,openDialog,setOpenDialog,setMessage,action }) => {
    const [type,setType] = React.useState(Array.isArray(message));


   React.useEffect(() => {
    console.log(message)
          setType(Array.isArray(message))
    
      }, [message]); // Empty dependency array ensures this runs only once on mount
  
  console.log(type)
  const handleClose = () => {
    
    action(type ?"save":"");

    console.log(type+" : mean info and save ")
    console.log("CLOSING")
    setOpenDialog(false)
    setMessage(null)
  };
  const handleCancel=()=>{
    console.log("CANCELING")

    setOpenDialog(false)
    setMessage(null)
  }

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleCancel}
        aria-labelledby="customized-dialog-title"
        open={openDialog}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {
  message ? (
    type ? (
     "To reach desired state you have to :"
    ) : (
       "ERROR"
    )
  ) : (
    <div 
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <p>Waiting ...</p>
    </div>
  )
}



        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCancel}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
         
         
        {
  message ? (
    Array.isArray(message) ? (
      message.map((point, index) => (
        <Typography key={index} gutterBottom>
          {point}
        </Typography>
      ))
    ) : (
      <Typography gutterBottom><p style={{color:"red",fontWeight:"bold"}}>{message}</p></Typography>
    )
  ) : (
    <div 
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <CircularProgress />
    </div>
  )
}


         
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>

          {
  message ? (
    type ? (
      "Save changes"
    ) : (
       "Cancel"
    )
  ) : (
    <div 
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <p>Waiting ...</p>
    </div>
  )
}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
export default MessageDialog;