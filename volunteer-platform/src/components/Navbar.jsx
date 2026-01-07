import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleDashboard = () => {
  const token = localStorage.getItem('token');
  if (!token) return navigate('/login');

  try {
    const { role } = JSON.parse(atob(token.split('.')[1]));
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'ngo') navigate('/ngo/dashboard');
    else if (role === 'volunteer') navigate('/volunteer/dashboard');
    else navigate('/login');
    } catch (err) {
    console.error('Invalid token', err);
    navigate('/login');
    }
 };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const isLoggedIn = !!localStorage.getItem('token');
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black px-2">
      <div className="container-fluid">
        <Link className="navbar-brand fs-2 fw-semibold" to="/">VolunteerConnect</Link>
        <div className="navbar-nav ms-auto">
           {isLoggedIn ? (
          <>
          {/* <button onClick={handleDashboard} className="btn btn-outline-light fs-4 mx-2">Dashboard</button> */}
         <button onClick={handleLogout} className="btn btn-outline-light fs-4 mx-2">Logout</button>
         </>
        ) : (
          <>
          <Link to="/events" className="btn btn-outline-light fs-4 m-2">Browse Events</Link>
          <Link className="btn btn-outline-light fs-4 m-2" to="/login">Login</Link>
          <Link className="btn btn-outline-light fs-4 m-2" to="/register">Register</Link>
          </>
        )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
