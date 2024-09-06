import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Grid, Paper, IconButton, List, ListItem, ListItemText, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import { Application, Dependency, Port } from '../../types/apiTypes';
import { addApp, getApp, update } from '../../api/applicationService';
import {  ArrowBackIosNewOutlined } from '@mui/icons-material';
import MessageDialog from '../../components/Dialog/MessageDialog';
import NavBar from '../../components/NavBar/NavBar';



const AddAppForm: React.FC = () => {

    const navigate=useNavigate();
    const [error,setError]=useState<string|null>(null);
  const [newApp, setNewApp] = useState<Application>({
    id:0,
    applicationName: "",
  applicationType: "",
  application_version: "",
  platformVersion: "",
    dependencies: [],
    ports:[],
    blockedDependencies:[],
    action:null
  });

  const [newDependency, setNewDependency] = useState<Dependency>({ id:0,name: '', version: '',action:'' });
  const [newBlockedDependency, setNewBlockedDependency] = useState<Dependency>({ id:0,name: '', version: '',action:"" });

  const [newPort, setNewPort] = useState<Port>({ id:0,protocol: '', portNumber: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewApp({
      ...newApp,
      [name]: value,
    });
  };
  const handleChangeSelect=(e:SelectChangeEvent<string>)=>{
    e.preventDefault();
    const { name, value } = e.target;
    setNewApp({
      ...newApp,
      [name]: value,
    });
}


  const handleDependencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDependency({
      ...newDependency,
      [name]: value,
    });
  };

  

  const addDependency = () => {
    if (newDependency.name && newDependency.version) {
      setNewApp({
        ...newApp,
        dependencies: [...newApp.dependencies, newDependency],
      });
      setNewDependency({ name: '', version: '',id:0,action:'' });
    }
  };

    const handleDependencyBlockedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBlockedDependency({
      ...newBlockedDependency,
      [name]: value,
    });
  };

  const deleteDependency = (index: number) => {
    const updatedDependencies = newApp.dependencies.filter((_, i) => i !== index);
    setNewApp({
      ...newApp,
      dependencies: updatedDependencies,
    });
  };

  const addBlockedDependency = () => {
    if(!newApp.blockedDependencies) newApp.blockedDependencies=[]
    if (newBlockedDependency.name && newBlockedDependency.version) {
      setNewApp({
        ...newApp,
        blockedDependencies: [...newApp.blockedDependencies, newBlockedDependency],
      });
      setNewBlockedDependency({ name: '', version: '',id:0,action:"" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    newApp.dependencies.forEach(dep=>{
      dep.action="ADD"
    })
    newApp.blockedDependencies.forEach(dep=>{
      dep.action="BLOCK"
      newApp.dependencies.push(dep)
    })
    addApp(newApp).then(data=>{
        console.log(data)
        navigate("/apps")
    },err=>{
      setError(err?.response?.data?.message||"there is something wrong")
      console.log(err)
    });

    // Add logic to handle form submission, e.g., API call
  };
  const addPort = () => {
    if (newPort.portNumber && newPort.protocol) {
      setNewApp({
        ...newApp,
        ports: [...newApp.ports, newPort],
      });
      setNewPort({ protocol: '', portNumber: '',id:0 });
    }
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

  const deletePort = (index: number) => {
    const updatedPorts = newApp.ports.filter((_, i) => i !== index);
    setNewApp({
      ...newApp,
      ports: updatedPorts,
    });
  };

  const deleteBlockedDep = (index: number) => {
    const updatedBlockedDependencies = newApp.blockedDependencies.filter((_, i) => i !== index);
    setNewApp({
      ...newApp,
      blockedDependencies: updatedBlockedDependencies,
    });
  };
  return (<div style={{
    width:"100vw"
  }}>
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
    {error  &&  <MessageDialog message={error} openDialog={error!=null} setOpenDialog={(()=>{})} setMessage={setError} action={()=>{}}/>}

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
                    value={newApp.applicationName}
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
                    value={newApp.application_version}
                    onChange={handleChange}
                    required
                  />
                  </Grid>
                  <Grid item xs={12}>
      <FormControl variant="outlined" fullWidth required>
        <InputLabel id="version-label">Type</InputLabel>
        <Select
          labelId="version-label"
          label="Version"
          name="applicationType"
          value={newApp.applicationType}
          onChange={handleChangeSelect}
        >
          <MenuItem value="JAVA">JAVA</MenuItem>
          <MenuItem value="PYTHON">PYTHON</MenuItem>
          <MenuItem value="GO">GO</MenuItem>
          {/* Add more versions as needed */}
        </Select>
      </FormControl>
    </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Platform Version"
                    variant="outlined"
                    fullWidth
                    name="platformVersion"
                    value={newApp.platformVersion}
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
                    Save 
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '2rem' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Dependencies
            </Typography>
            <List>
              {newApp.dependencies.map((dependency, index) => (
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
              {newApp.blockedDependencies && newApp.blockedDependencies.map((dep, index) => (
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
              {newApp.ports.map((port, index) => (
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
    </div>
  );
};

export default AddAppForm;
