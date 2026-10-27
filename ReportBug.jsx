import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function ReportBug() {
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium' });
  const navigate = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    await api('/bugs', 'POST', form);
    navigate('/bugs');
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Report a Bug</h2>
        <form onSubmit={submit}>
          <input name="title" placeholder="Title" onChange={change} required />
          <textarea name="description" placeholder="Describe the bug" rows="5" onChange={change} required />
          <select name="priority" value={form.priority} onChange={change}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
          <button type="submit">Submit Bug</button>
        </form>
      </div>
    </div>
  );
}