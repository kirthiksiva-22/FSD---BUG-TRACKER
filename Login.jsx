import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'reporter' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (isRegister) {
      const r = await api('/auth/register', 'POST', form);
      if (r.error) return setError(r.error);
    }
    const r = await api('/auth/login', 'POST', { email: form.email, password: form.password });
    if (r.error) return setError(r.error);
    localStorage.setItem('token', r.token);
    localStorage.setItem('user', JSON.stringify(r.user));
    navigate('/bugs');
  }

  return (
    <div className="container" style={{ maxWidth: 400 }}>
      <div className="card">
        <h2>{isRegister ? 'Register' : 'Login'}</h2>
        <form onSubmit={submit}>
          {isRegister && (
            <>
              <input name="name" placeholder="Name" onChange={change} required />
              <select name="role" onChange={change}>
                <option value="reporter">Reporter</option>
                <option value="developer">Developer</option>
              </select>
            </>
          )}
          <input name="email" type="email" placeholder="Email" onChange={change} required />
          <input name="password" type="password" placeholder="Password" onChange={change} required />
          <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p style={{ cursor: 'pointer', color: '#2563eb' }} onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Already have an account? Login' : 'New here? Register'}
        </p>
      </div>
    </div>
  );
}