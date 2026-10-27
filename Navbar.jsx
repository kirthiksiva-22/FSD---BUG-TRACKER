import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  function logout() {
    localStorage.clear();
    navigate('/');
  }

  return (
    <div className="nav">
      <b>Bug Tracker</b>
      <Link to="/bugs">All Bugs</Link>
      <Link to="/report">Report Bug</Link>
      <span>{user?.name} ({user?.role})</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}