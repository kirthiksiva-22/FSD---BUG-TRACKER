import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function BugList() {
  const [bugs, setBugs] = useState([]);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  useEffect(() => {
    const q = new URLSearchParams();
    if (status) q.append('status', status);
    if (priority) q.append('priority', priority);
    api('/bugs?' + q.toString()).then(setBugs);
  }, [status, priority]);

  return (
    <div className="container">
      <h2>All Bugs</h2>
      <div className="card">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
          <option>Closed</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All priorities</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>
      </div>
      {bugs.length === 0 && <p>No bugs found.</p>}
      {bugs.map((b) => (
        <div className="card" key={b.id}>
          <Link to={'/bugs/' + b.id}><b>#{b.id} {b.title}</b></Link>
          <p>Priority: {b.priority} | Status: {b.status}</p>
        </div>
      ))}
    </div>
  );
}