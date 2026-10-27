import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import BugList from './pages/BugList';
import ReportBug from './pages/ReportBug';
import BugDetail from './pages/BugDetail';
import Navbar from './Navbar';

function Protected({ children }) {
  if (!localStorage.getItem('token')) return <Navigate to="/" />;
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/bugs" element={<Protected><BugList /></Protected>} />
      <Route path="/report" element={<Protected><ReportBug /></Protected>} />
      <Route path="/bugs/:id" element={<Protected><BugDetail /></Protected>} />
    </Routes>
  );
}