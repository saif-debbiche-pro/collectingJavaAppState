import './ApplicationDetails.css'
import ApplicationChangesHistory from '../../components/ApplicationChangeHistory/ApplicationChangeHistory';
import React, { useState } from 'react';
import { deleteApp, getApp, getAppHistoryChanges, getCuurentstate, reevaluateActions } from '../../api/applicationService';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Application, ApplicationHistory } from '../../types/apiTypes';
import { ArrowBackIosNewOutlined } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import MessageDialog from '../../components/Dialog/MessageDialog';
import axios from 'axios';
import NavBar from '../../components/NavBar/NavBar';
import PodMetrics from '../../components/Mertics/Metrics';



export default function ApplicationDetails() {
  const [app,setApp]=useState<Application>();
    const [changes,setChanges]=useState<ApplicationHistory[]>([]);
    const navigate=useNavigate();
    const [waiting,setWating]=useState(false);
    const [error,setError]=useState<string|null>(null);

    
    const { id } = useParams();

    React.useEffect(() => {
      const fetchApps = async () => {
        try {
          const result = await getApp(Number(id)); // Assume getAllApps is correctly typed
          
          if(!result.blockedDependencies) result.blockedDependencies=[];
            
          result.dependencies.forEach(dep=>dep.action=="BLOCK"?result.blockedDependencies.push(dep):null);
          
          result.dependencies=result.dependencies.filter(dep=>dep.action!=="BLOCK")
          

         
          setApp(result);


          console.log(result)
        } catch (err) {
          console.log('Failed to fetch apps.');
        }
      };
  
      fetchApps(); // Call the function when the component mounts
    }, []); // Empty dependency array ensures this runs only once on mount


    const handleSyncronize=async ()=>{
      const userConfirmed = window.confirm("Are you sure you want to replace the desired state with the current state ,the desired state will be deleted ?");
        if(userConfirmed){
          setWating(true)
          try{
            const data=await getCuurentstate(app,id);
            setWating(false);
            setApp(data);


          console.log(data)
        
          } catch (err:unknown) {
            setWating(false);
            if (axios.isAxiosError(err)) {
              // Handle Axios error
              setError(err.response?.data?.message||err.response?.data || "something went wrong");
              console.log(err.response?.data);
          } else if (err instanceof Error) {
              // Handle generic error
              setError(err.message || "something went wrong");
              console.log(err);
          } else {
              // Handle unknown errors
              setError("something went wrong");
              console.log(err);
          }
        }


    }}








    const getActionPoints=(message:string)=>{

      console.log(message.replace(/"/g, '').split("\n"))
      let points=message.replace(/\\n/g, '\n').replace(/"/g, '').split("\n");
      if(points[points.length-1].length==0) points.pop();
      return points;
    }
    const handleReevaluation= async ()=>{
      
      setWating(true)
      try {
        const result = await reevaluateActions(app,id); // Assume getAllApps is correctly typed
        
        setWating(false);
        if(!result.blockedDependencies) result.blockedDependencies=[];
            
          result.dependencies.forEach(dep=>dep.action=="BLOCK"?result.blockedDependencies.push(dep):null);
          
          result.dependencies=result.dependencies.filter(dep=>dep.action!=="BLOCK")
        setApp(result);


        console.log(result)
      } catch (err:unknown) {
        setWating(false);
        if (axios.isAxiosError(err)) {
          // Handle Axios error
          setError(err.response?.data?.message||err.response?.data || "something went wrong");
          console.log(err.response?.data);
      } else if (err instanceof Error) {
          // Handle generic error
          setError(err.message || "something went wrong");
          console.log(err);
      } else {
          // Handle unknown errors
          setError("something went wrong");
          console.log(err);
      }
    }}
    React.useEffect(() => {
      const fetchApps = async () => {
        try {
          const result = await getAppHistoryChanges(Number(id)); // Assume getAllApps is correctly typed
          setChanges(result);
          console.log(result)
        } catch (err) {
          console.log('Failed to fetch apps.');
        }
      };
  
      fetchApps(); // Call the function when the component mounts
    }, []); // Empty dependency array ensures this runs only once on mount
    
  return (<>
    <NavBar/>
 
    <div style={{
      marginTop:"5rem"
    }}>
    <div style={{
        width:"100vw",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        paddingLeft:"2rem",
        paddingRight:"2rem",
        boxSizing:"border-box"
  
      }}>
     {
     waiting && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
        >
          <CircularProgress  />
        </div>)
        }



    <div className="app-info-page">
      <div style={{
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center"
      }}>
    <button
      onClick={() => navigate("/apps")}
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
    <div style={{
      display:"flex"
    }}>
    <button
      onClick={() => handleReevaluation()}
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

      
      {app?.action?.actions ? "Reavaluating":"Evaluate"}
    </button>
<div style={{
  width:".7rem"
}}></div>
    <button
      onClick={() => handleSyncronize()}
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

      
     Synchronize
    </button>
    </div>
    </div>
    <header>
      <h1>{app?.applicationName}</h1>
    </header>
    <main className="content-grid">
    {error  &&  <MessageDialog message={error} openDialog={error!=null} setOpenDialog={(()=>{})} setMessage={setError} action={()=>{}}/>}
      <section className="general-info">
        <h2>General Information</h2>
        <p><strong>{app?.applicationType.toLocaleLowerCase()} Version:</strong> {app?.platformVersion}</p>
        <p><strong>Type:</strong> {app?.applicationType}</p>
      </section>
      <section className="dependencies" style={{

        overflow:"scroll"
      }}>
        <h2>Dependencies</h2>
        <ul>
          {
            app?.dependencies.map((dep,i)=><li key={i}>{dep.name} - Version {dep.version}</li>)
          }
          {/* more dependencies */}
        </ul>
      </section>
     {
     app?.ports && app?.ports.length > 0
      && <section className="dependencies">
        <h2>Open Ports</h2>
        <ul>
          {
            app?.ports.map((port,i)=><li key={i}>{port.protocol} -  {port.portNumber}</li>)
          }
          {/* more dependencies */}
        </ul>
      </section>
      
      }
         {
     app?.blockedDependencies && app?.blockedDependencies.length > 0
      && <section className="dependencies">
        <h2>Blocked Dependencies</h2>
        <ul>
          {
            app?.blockedDependencies.map((dep,i)=><li key={i}>{dep.name} - Version {dep.version}</li>)
          }
          {/* more dependencies */}
        </ul>
      </section>
      
      }
 {
     app?.action && app?.action.actions 
      && <section className="dependencies">
        <h2>Action to get to the desired state</h2>
        <ul>
          {
            getActionPoints(app.action.actions).map((action,i)=>{ 
              const boldTextMatch = action.match(/\*\*(.*?)\*\*/);
              console.log(action);
              if (boldTextMatch) {
                const boldText = boldTextMatch[1]; // Text inside the ** **
                const remainingText = action.replace(`**${boldText}**`, ''); // Remove **Text**
                return (
                  <li key={i}>
                    <strong>{boldText}:</strong> {remainingText.trim()}
                  </li>
                );
              } else {
                return <li key={i}>{action.trim()}</li>;
              }})
          }
          {/* more dependencies */}
        </ul>
      </section>
      
      }
         <PodMetrics app={app} id={id}/>
      

      
    </main>
      <ApplicationChangesHistory changes={changes} />

    <footer style={{
      display:"flex",
      justifyContent:"space-between"
    }}>
      <button><Link to={"edit"}> Edit Application</Link></button>
      <button onClick={async ()=>{
        await deleteApp(id)
        navigate('/apps')
        }}>Delete Application</button>
    </footer>
  </div>
  </div>
  </div>
  </>
);
  
  
}
