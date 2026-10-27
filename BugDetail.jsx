import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';

export default function BugDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [devs, setDevs] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  async function load() {
    setData(await api('/bugs/' + id));
  }

  useEffect(() => {
    load();
    api('/users').then(setDevs);
  }, [id]);

  async function update(field, value) {
    await api('/bugs/' + id, 'PUT', { [field]: value });
    load();
  }

  if (!data) return <div className="container">Loading...</div>;
  const { bug, history } = data;

  const devName = (devId) =>
    devs.find((d) => String(d.id) === String(devId))?.name || 'Unassigned';
  const show = (field, v) => (field === 'assigned_to' ? devName(v) : v);

  return (
    <div className="container">
      <div className="card">
        <h2>#{bug.id} {bug.title}</h2>
        <p>{bug.description}</p>
        <p>
          Priority: <b>{bug.priority}</b> | Status: <b>{bug.status}</b> |
          Assigned to: <b>{devName(bug.assigned_to)}</b>
        </p>
      </div>

      {user.role === 'developer' && (
        <div className="card">
          <h3>Update Bug</h3>
          <label>Status</label>
          <select value={bug.status} onChange={(e) => update('status', e.target.value)}>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
            <option>Closed</option>
          </select>
          <label>Priority</label>
          <select value={bug.priority} onChange={(e) => update('priority', e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
          <label>Assign to</label>
          <select value={bug.assigned_to ?? ''} onChange={(e) => update('assigned_to', e.target.value)}>
            <option value="" disabled>Select developer</option>
            {devs.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="card">
        <h3>Issue History</h3>
        {history.length === 0 && <p>No changes yet.</p>}
        {history.map((h) => (
          <p key={h.id}>
            {h.changed_at}: <b>{h.changed_by_name}</b> changed {h.field} from{' '}
            <b>{show(h.field, h.old_value) ?? 'none'}</b> to <b>{show(h.field, h.new_value)}</b>
          </p>
        ))}
      </div>
    </div>
  );
}