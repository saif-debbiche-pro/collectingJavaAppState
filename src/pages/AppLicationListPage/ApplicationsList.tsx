import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { Application } from '../../types/apiTypes';
import { getAllApps } from '../../api/applicationService';
import { Paper } from '@mui/material';
import NavBar from '../../components/NavBar/NavBar';

interface Data {
  id:number;
  applicationName: string;
  applicationType: string;
  application_version: string;
  platformVersion: string;
}

function createData(
  id:number,
  applicationName: string,
  applicationType: string,
  application_version: string,
  platformVersion: string
): Data {
  return {
    id,
    applicationName,
  applicationType,
  application_version,
  platformVersion
  };
}




type Order = 'asc' | 'desc';



interface Column {
  id: 'id' | 'applicationName' | 'application_version' | 'platformVersion' | 'applicationType';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number|string) => string;
}
const columns: readonly Column[] = [
  { id: 'id', label: 'Id', minWidth: 100 },
  { id: 'applicationName', label: 'Name', minWidth: 170 },
  {
    id: 'applicationType',
    label: 'Type',
    minWidth: 170,
  },
  {
    id: 'platformVersion',
    label: 'Platform Version',
    minWidth: 170,
   
  },
  {
    id: 'application_version',
    label: 'application_version',
    minWidth: 170,
  },
];



export default function Applications_list() {
  const [apps,setApps]=React.useState<Application[]>([])
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const location = useLocation(); 
  const navigate =useNavigate();



  React.useEffect(() => {
    const fetchApps = async () => {
      try {
        const result = await getAllApps(); // Assume getAllApps is correctly typed
        setApps(result);
        console.log(apps)
        console.log(result)
      } catch (err) {
        console.log('Failed to fetch apps.');
      }
    };

    fetchApps(); // Call the function when the component mounts
  }, [location]); // Empty dependency array ensures this runs only once on mount

  

 
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  

  return (
    <div style={{
      
    }}>
      <div style={{
        width:"100vw",
        paddingLeft:".3rem",
        paddingRight:".3rem",
        boxSizing:"border-box"
        
      }}>
      <NavBar/>
      </div>
    
    <div style={{
      width:"100vw",
      display:"flex",
     
      
      flexDirection:"column",
      paddingLeft:"2rem",
      paddingRight:"2rem",
      boxSizing:"border-box"

    }}>
      
   <Paper sx={{ width: '100%', overflow: 'hidden',marginTop:"2rem" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align}
                  style={{ minWidth: col.minWidth }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {apps
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id} onClick={()=>navigate("/apps/"+row["id"])}>
                    {columns.map((column) => {
                      let value = row[column.id];
                      if(column.id=="platformVersion")
                        {
                          value=row["applicationType"].toLowerCase()+":"+row["platformVersion"]
                        } 
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={apps.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    
    </div>
    <div style={{
      padding:"2rem",
      display:"flex",
      justifyContent:"flex-end"
    }}>
    <button
      onClick={() => navigate("/apps/add")}
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
      Add Application
    </button>
    </div>
    </div>
    
  );
}
