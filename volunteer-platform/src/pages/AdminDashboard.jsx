import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [events, setEvents] = useState([]);
  const [donations, setDonations] = useState([]);
  const [expanded, setExpanded] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const toggleSection = (section) => {
    setExpanded(expanded === section ? '' : section);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    const { role } = JSON.parse(atob(token.split('.')[1]));
    if (role !== 'admin') return navigate('/login');
  }, []);

  useEffect(() => {
    fetchAllData();
  }, []);

const fetchAllData = async () => {
  try {
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    const [userRes, ngoRes, eventRes, donationRes] = await Promise.all([
      axios.get('http://localhost:5000/api/user', { headers }),
      axios.get('http://localhost:5000/api/admin/ngos', { headers }),
      axios.get('http://localhost:5000/api/event', { headers }),
      axios.get('http://localhost:5000/api/donate', { headers })
    ]);

    // Set data with proper error checking
    if (userRes.data) setUsers(Array.isArray(userRes.data) ? userRes.data : userRes.data.users || []);
    if (ngoRes.data) setNgos(Array.isArray(ngoRes.data) ? ngoRes.data : ngoRes.data.ngos || []);
    if (eventRes.data) setEvents(Array.isArray(eventRes.data) ? eventRes.data : eventRes.data.events || []);
    if (donationRes.data) setDonations(Array.isArray(donationRes.data) ? donationRes.data : donationRes.data.donations || []);

  } catch (error) {
    console.error('Error loading admin data:', error.response?.data || error.message);
    alert('Failed to fetch data. Please check your connection and try again.');
  }
};

  const handleApprove = (id) => {
    axios.put(`http://localhost:5000/api/admin/approve/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setNgos(prev => prev.map(ngo => ngo._id === id ? { ...ngo, isApproved: true } : ngo));
      })
      .catch(err => console.log(err));
  };

  const handleRemoveUser = async (userId) => {
  if (!window.confirm('Are you sure you want to remove this user?')) return;

  try {
    const headers = { Authorization: `Bearer ${token}` };
    await axios.delete(`http://localhost:5000/api/user/${userId}`, { headers });

    setUsers(prev => prev.filter(users => users._id !== userId));
  } catch (err) {
    console.error("Failed to remove user:", err.response?.data || err.message);
    alert("Failed to remove user. Check backend.");
  }
};



  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <header className="p-2 flex justify-between items-center bg-dark text-white mb-2">
        <h1 className="text-lg font-semibold">Admin Panel – VolunteerConnect</h1>
      </header>

      <section className='bg-gray-100 p-3 mt-0 mb-4 rounded shadow'>
        <h2 className="text-xl font-semibold px-2 mb-1">Welcome, Admin</h2>
        <p className="text-sm px-2 text-gray-600">Manage all NGOs, users, events, and donations here.</p>
      </section>

      {/* Summary Widgets */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 mb-4">
        <div className="bg-white p-2 m-1 rounded shadow text-center">
          <h3 className="text-sm text-gray-600">Total Users</h3>
          <p className="text-xl font-bold text-gray-800">{users.length}</p>
        </div>
        <div className="bg-white p-2 m-1 rounded shadow text-center">
          <h3 className="text-sm text-gray-600">Total NGOs</h3>
          <p className="text-xl font-bold text-gray-800">{ngos.length}</p>
        </div>
        <div className="bg-white p-2 m-1 rounded shadow text-center">
          <h3 className="text-sm text-gray-600">Total Events</h3>
          <p className="text-xl font-bold text-gray-800">{events.length}</p>
        </div>
        <div className="bg-white p-2 m-1 rounded shadow text-center">
          <h3 className="text-sm text-gray-600">Total Donations</h3>
          <p className="text-xl font-bold text-gray-800">₹{donations.reduce((sum, d) => sum + d.amount, 0)}</p>
        </div>
      </section>

      <section className="mb-4 px-4">
        <h2 className="text-xl font-semibold text-gray-800 cursor-pointer flex justify-between items-center "
          onClick={() => toggleSection('ngo')}>NGO Approvals <span>{expanded === 'ngo' ? '▲' : '▼'}</span></h2>
        {expanded === 'ngo' && (
          <div className="overflow-x-auto mx-5 mt-4">
            <table className="text-sm w-full bg-white shadow rounded">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Approved</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {ngos.map(ngo => (
                  <tr key={ngo._id}>
                    <td className="border p-2">{ngo.name}</td>
                    <td className="border p-2">{ngo.email}</td>
                    <td className="border p-2">{ngo.isApproved ? "Yes" : "No"}</td>
                    <td className="border p-2">
                      {!ngo.isApproved && (
                        <button onClick={() => handleApprove(ngo._id)} className="bg-dark text-white px-4 py-2 rounded m-1">
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mb-4 px-4">
        <h2 className="text-xl font-semibold text-gray-800 cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection('users')}>All Users <span>{expanded === 'users' ? '▲' : '▼'}</span></h2>
        {expanded === 'users' && (
          <ul className="mt-4 space-y-2 ">
            {users.map(u => (
              <li key={u._id} className="text-sm text-gray-700 border rounded p-1 m-1 flex justify-between items-center p-2">
                <span>{u.name} - {u.email} - [{u.role}]</span>
                <button
                  onClick={() => handleRemoveUser(u._id)}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded mx-2"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-4 px-4">
        <h2 className="text-xl font-semibold text-gray-800 cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection('events')}>All Events <span>{expanded === 'events' ? '▲' : '▼'}</span></h2>
        {expanded === 'events' && (
          <ul className="mt-4 space-y-2">
            {events.map(e => (
              <li key={e._id} className="border p-2 rounded flex justify-between items-center">
                <span>{e.title} - {e.location}</span>
                <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded mx-2">Edit</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-4 px-4">
        <h2 className="text-xl font-semibold text-gray-800 cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection('donations')}>All Donations <span>{expanded === 'donations' ? '▲' : '▼'}</span></h2>
        {expanded === 'donations' && (
          <ul className="mt-4 space-y-2">
            {donations.map(d => (
              <li key={d._id} className="border p-2 m-1 rounded flex justify-between items-center">
                ₹{d.amount} by {d.donor?.name || 'Unknown'} to {d.ngo?.name || 'NGO'}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
