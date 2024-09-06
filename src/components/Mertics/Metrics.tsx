import React, { useEffect, useState } from 'react';
import { getMetrics } from '../../api/applicationService';
import { Application, Metrics } from '../../types/apiTypes';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';


interface MetricsProps {
    app:Application|undefined;
    id:string |undefined

  }


const PodMetrics: React.FC<MetricsProps> = ({app,id}) => {
    const [metrics, setMetrics] = useState<Metrics>({
        cpu_usage:"",
        health_status:"",
        memory_usage:"",
        timestamp:""
    });
    const [chartData, setChartData] = useState({});

    useEffect(() => {
              
            getMetrics(app,id)
                .then(data => {
                    setMetrics(data);
                    console.log(data)
                },err=>console.log(err))
        

        
        
    },[app?.applicationName]);

   
      return (
        <div>
          <h2>Pod Metrics</h2>
          <p><strong>CPU Usage:</strong> {metrics.cpu_usage}</p>
          <p><strong>Memory Usage:</strong> {metrics.memory_usage}</p>
          <p><strong>Health Status:</strong> {metrics.health_status === 'True' ? 'Healthy' : 'Unhealthy'}</p>
          <p><strong>Timestamp:</strong> {new Date(metrics.timestamp).toLocaleString()}</p>
        </div>
      );
    };


export default PodMetrics;
