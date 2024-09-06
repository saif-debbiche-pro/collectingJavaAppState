import React from 'react';
import { ApplicationHistory } from '../../types/apiTypes';

interface Change {
  date: string;
  changeType: string;
  oldValue: string;
  newValue: string;
}

interface ApplicationChangesHistoryProps {
  changes: ApplicationHistory[];
}
const ApplicationChangesHistory: React.FC<ApplicationChangesHistoryProps> = ({ changes }) => {
  return (
    <div style={{ marginTop: '20px' ,width:"100%"}}>
      <h2>Application Changes History</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Change Type</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>application name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>version</th>
          </tr>
        </thead>
        <tbody>
          {changes.map((change, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(change.timestamp).toLocaleTimeString("en-US", {
    // Optional: specify formatting options
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{change.changeType}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{change.applicationName}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{change.application_version}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationChangesHistory;
