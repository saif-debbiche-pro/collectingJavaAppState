import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Grid, Paper, IconButton, List, ListItem, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import { Application, Dependency, Port } from '../../types/apiTypes';
import { getApp, update, ValidateUpdate } from '../../api/applicationService';
import { ArrowBack, ArrowBackIos, ArrowBackIosNewOutlined } from '@mui/icons-material';
import MessageDialog from '../../components/Dialog/MessageDialog';
import NavBar from '../../components/NavBar/NavBar';



const EditAppForm: React.FC = () => {

    const { id } = useParams();
    const navigate=useNavigate();
    const [message,setMessage]=useState<string[]|string>([]);
    const [openDialog,setOpenDialog]=useState(false)
    React.useEffect(() => {
        const fetchApps = async () => {
          try {
            const result = await getApp(Number(id)); // Assume getAllApps is correctly typed
            if(!result.blockedDependencies) result.blockedDependencies=[];
            
            setAppDetails(result)
            result.dependencies.forEach(dep=>dep.action=="BLOCK"?result.blockedDependencies.push(dep):null);
            
            result.dependencies=result.dependencies.filter(dep=>dep.action!=="BLOCK")
            console.log(result)
            


          } catch (err) {
            console.log('Failed to fetch apps.');
          }
        };
    
        fetchApps(); // Call the function when the component mounts
      }, []); // Empty dependency array ensures this runs only once on mount
  
  const [appDetails, setAppDetails] = useState<Application>({
    id:0,
    applicationName: "",
  applicationType: "",
  application_version: "",
  platformVersion: "",
    dependencies: [],
    blockedDependencies:[],
    ports:[],
    action:null
  });

  const [newDependency, setNewDependency] = useState<Dependency>({ id:0,name: '', version: '' ,action:""});
  const [newBlockedDependency, setNewBlockedDependency] = useState<Dependency>({ id:0,name: '', version: '',action:"" });
  const [newPort, setNewPort] = useState<Port>({ id:0,protocol: '', portNumber: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setAppDetails({
      ...appDetails,
      [name]: value,
    });
  };

  const handleDependencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDependency({
      ...newDependency,
      [name]: value,
    });
  };
  const handleDependencyBlockedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBlockedDependency({
      ...newBlockedDependency,
      [name]: value,
    });
  };
  const handlePortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPort({
      ...newPort,
      [name]: value,
    });
  };

  const handlePortProtocolChange=(e:SelectChangeEvent<string>)=>{
    const { name, value } = e.target;
    setNewPort({
      ...newPort,
      [name]: value,
    });


  }

  const addDependency = () => {
    if (newDependency.name && newDependency.version) {
      setAppDetails({
        ...appDetails,
        dependencies: [...appDetails.dependencies, newDependency],
      });
      setNewDependency({ name: '', version: '',id:0,action:"" });
    }
  };
  const addBlockedDependency = () => {
    if(!appDetails.blockedDependencies) appDetails.blockedDependencies=[]
    if (newBlockedDependency.name && newBlockedDependency.version) {
      console.log(appDetails.blockedDependencies)
      setAppDetails({
        ...appDetails,
        blockedDependencies: [...appDetails.blockedDependencies, newBlockedDependency],
      });
      setNewBlockedDependency({ name: '', version: '',id:0,action:"" });
    }
  };
  const addPort = () => {
    if (newPort.portNumber && newPort.protocol) {
      setAppDetails({
        ...appDetails,
        ports: [...appDetails.ports, newPort],
      });
      setNewPort({ protocol: '', portNumber: '',id:0 });
    }
  };

  const deleteDependency = (index: number) => {
    const updatedDependencies = appDetails.dependencies.filter((_, i) => i !== index);
    setAppDetails({
      ...appDetails,
      dependencies: updatedDependencies,
    });
  };
  const deleteBlockedDep = (index: number) => {
    const updatedBlockedDependencies = appDetails.blockedDependencies.filter((_, i) => i !== index);
    setAppDetails({
      ...appDetails,
      blockedDependencies: updatedBlockedDependencies,
    });
  };

  
  const deletePort = (index: number) => {
    const updatedPorts = appDetails.ports.filter((_, i) => i !== index);
    setAppDetails({
      ...appDetails,
      ports: updatedPorts,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    appDetails.dependencies.forEach(dep=>{
      dep.action="ADD"
    })
    appDetails.blockedDependencies.forEach(dep=>{
      dep.action="BLOCK"
      appDetails.dependencies.push(dep)
    })
    
    console.log(appDetails)

    setOpenDialog(true)
    ValidateUpdate(appDetails,id).then(data=>{
        console.log(data)
        let message=data;
        message=message.replace(/"/g, '');
        let points=message.split("\n");
        console.log(points)
        setMessage(points)

        //navigate("/apps/"+id)
    },err=>{
      setOpenDialog(true)
      setMessage(err?.response?.data.replace(/"/g, '').replace("\n", ''))  
    });

    // Add logic to handle form submission, e.g., API call
  };


  const updateApp=(actionType:string)=>{
    if(actionType=="save"){
    
      const newApp:Application={
        ...appDetails,
        action:{
          actions: Array.isArray(message)?message.join("\n"):message
        }
      }
      console.log(newApp)

      console.log(newApp)
      update(newApp,id).then(data=>{
        navigate("/apps/"+id);
      }).catch(err=>{
        console.log(err)
      })
    }
  }

  return (
    <>
    <NavBar/>
    <div style={{
      marginTop:"5rem"
    }}>
    <Container maxWidth="lg">
         <button
      onClick={() => navigate(-1)}
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
      }}
    >
      <ArrowBackIosNewOutlined style={{ marginRight: '8px' }} />
      Back
    </button>

    {openDialog  &&  <MessageDialog message={message} openDialog={openDialog} setOpenDialog={setOpenDialog} setMessage={setMessage} action={updateApp}/>}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '2rem' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Edit Application
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Application Name"
                    variant="outlined"
                    fullWidth
                    name="applicationName"
                    value={appDetails.applicationName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Version"
                    variant="outlined"
                    fullWidth
                    name="application_version"
                    value={appDetails.application_version}
                    onChange={handleChange}
                    required
                  />
                  </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Platform Version"
                    variant="outlined"
                    fullWidth
                    name="platformVersion"
                    value={appDetails.platformVersion}
                    onChange={handleChange}
                    required
                  />
                </Grid>
             

                {/* Add Dependency Section */}
                <Grid item xs={12}>
                  <Typography variant="h6">Add Dependency</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Dependency Name"
                        variant="outlined"
                        fullWidth
                        name="name"
                        value={newDependency.name}
                        onChange={handleDependencyChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Version"
                        variant="outlined"
                        fullWidth
                        name="version"
                        value={newDependency.version}
                        onChange={handleDependencyChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={addDependency}
                      >
                        Add Dependency
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6">Add Blocked Dependency</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Dependency Name"
                        variant="outlined"
                        fullWidth
                        name="name"
                        value={newBlockedDependency.name}
                        onChange={handleDependencyBlockedChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Version"
                        variant="outlined"
                        fullWidth
                        name="version"
                        value={newBlockedDependency.version}
                        onChange={handleDependencyBlockedChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={addBlockedDependency}
                      >
                        Add Dependency
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
      <Typography variant="h6">Add Port</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Select
            label="Protocol"
            variant="outlined"
            fullWidth
            name="protocol"
            value={newPort.protocol}
            onChange={handlePortProtocolChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Protocol
            </MenuItem>
            <MenuItem value="TCP">TCP</MenuItem>
            <MenuItem value="UDP">UDP</MenuItem>
            {/* Add more options as needed */}
          </Select>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Port Number"
            variant="outlined"
            fullWidth
            name="portNumber"
            value={newPort.portNumber}
            onChange={handlePortChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={addPort}
          >
            Add Port
          </Button>
        </Grid>
      </Grid>
    </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '2rem',maxHeight:"12rem",overflow:"scroll" }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Dependencies
            </Typography>
            <List>
              {appDetails.dependencies.map((dependency, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${dependency.name} - ${dependency.version}`}
                  />
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteDependency(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
         
          <Paper elevation={3} style={{ padding: '2rem' ,marginTop:"2rem" }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Blocked Dependencies
            </Typography>
            <List>
              {appDetails.blockedDependencies && appDetails.blockedDependencies.map((dep, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${dep.name} - ${dep.version}`}
                  />
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteBlockedDep(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
          <Paper elevation={3} style={{ padding: '2rem' ,marginTop:"2rem" }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Open Ports
            </Typography>
            <List>
              {appDetails.ports.map((port, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${port.protocol} - ${port.portNumber}`}
                  />
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deletePort(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
    </div>
    </>
  );
};

export default EditAppForm;
