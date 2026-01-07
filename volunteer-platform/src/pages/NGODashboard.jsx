import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const NGODashboard = () => {
  const [events, setEvents] = useState([]);
  const [ngoProfile, setNgoProfile] = useState(null);
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: ''
  });
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const toggleSection = (section) => {
    setExpanded(expanded === section ? '' : section);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    const { role } = JSON.parse(atob(token.split('.')[1]));
    if (role !== 'ngo') return navigate('/login');
  }, []);

  useEffect(() => {
    if (token) {
      fetchNGOProfile();
    }
  }, []);

  useEffect(() => {
    if (ngoProfile?._id) {
      fetchEvents();
    }
  }, [ngoProfile]);

  const fetchNGOProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNgoProfile(res.data);
    } catch (err) {
      console.error('Error fetching NGO profile:', err);
    }
  };

  const fetchEvents = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get('http://localhost:5000/api/event', { headers });
      // Backend now returns { success: true, data: events }
      const eventsData = res.data.data || res.data;
      const ngoEvents = eventsData.filter(e => e.ngo?._id === ngoProfile._id);
      setEvents(ngoEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createEvent = async (e) => {
    e.preventDefault();
    try {
       const eventData = { ...form, ngo: ngoProfile._id }; // Add this line
      const res = await axios.post('http://localhost:5000/api/event', form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage(res.data.message);
      setForm({ title: '', description: '', date: '', location: '' });
      fetchEvents();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Error creating event');
    }
  };

  const deleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/event/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage('Event deleted');
      fetchEvents();
    } catch (err) {
      console.error(err);
      setMessage('Error deleting event');
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
     <header className="p-2 px-4 flex justify-between items-center bg-dark text-white mb-2">
        <h1 className="text-lg font-semibold">NGO Dashboard – VolunteerConnect</h1>
      </header>

      <section className='bg-gray-100 px-4 p-1 mt-0 mb-4 rounded shadow'>
        <h2 className="text-xl font-semibold mb-1">Welcome, {ngoProfile ? ngoProfile.name : ''}</h2>
        <p className="text-sm text-gray-600">Manage your profile and events here.</p>
      </section>

      {/* Profile Section */}
      {ngoProfile && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 mb-4">
        <div className="bg-white px-4 py-2 m-1 border rounded shadow mb-4 col-span-2">
          <h2 className="text-sm text-gray-600">Profile</h2>
          <p className="text-lg font-bold text-gray-800"><strong>Name : </strong>{ngoProfile.name}</p>
          <p className="text-lg font-bold text-gray-800"><strong>Email :  </strong>{ngoProfile.email}</p>
          <p className="text-lg font-bold text-gray-800"><strong>Total Events : </strong>{events.length}</p>
        </div>
          </section>
      )}

      {/* Event Message */}
      {message && <div className="mb-4 text-green-600">{message}</div>}

      {/* Event Creation Form */}
        <section className="mb-4 px-4">
          <h2 className="text-xl font-semibold px-4 py-3 m-1 border rounded shadow text-gray-800 cursor-pointer inline-flex text-center items-center"
            onClick={() => toggleSection('create')}>Create Event <span>{expanded === 'create' ? '' : ''}</span></h2>
          {expanded === 'create' && (
            <form onSubmit={createEvent} className="space-y-4 bg-gray-200 p-3 border rounded m-4 mt-4">
          <input type="text" name="title" value={form.title} onChange={handleInput} placeholder="Title" required className="w-full p-2 border " />
          <input type="text" name="description" value={form.description} onChange={handleInput} placeholder="Description" className="w-full p-2 border m-1" />
          <input type="date" name="date" value={form.date} onChange={handleInput} required className="w-full p-2 border" />
          <input type="text" name="location" value={form.location} onChange={handleInput} placeholder="Location" required className="w-full p-2 border m-1" />
          <button type="submit" className="bg-dark text-white px-4 py-2 m-1 rounded">Create Event</button>
            </form>
          )}
        </section>

        {/* Events List */}
     <section className="mb-4 px-4">
        <h2 className="text-xl font-semibold px-4 py-3 m-1 border rounded shadow text-gray-800 cursor-pointer inline-flex text-center items-center"
          onClick={() => toggleSection('events')}>Your Events <span>{expanded === 'events' ? '' : ''}</span></h2>
        {expanded === 'events' && (
          events.length === 0 ? (
            <p className="mt-4 text-center">No events found.</p>
          ) : (
            <div className="space-y-4 bg-gray-200 p-3 border rounded m-4 overflow-x-auto mt-4">
              <table className="text-sm w-full bg-white shadow rounded">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 border">Title</th>
                    <th className="p-2 border">Description</th>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Location</th>
                    <th className="p-2 border">Volunteers</th>
                    <th className="p-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(event => (
                    <tr key={event._id}>
                      <td className="border p-2">{event.title}</td>
                      <td className="border p-2">{event.description}</td>
                      <td className="border p-2">{new Date(event.date).toLocaleDateString()}</td>
                      <td className="border p-2">{event.location}</td>
                      <td className="border p-2">{event.volunteers?.length || 0}</td>
                      <td className="border p-2">
                        <button onClick={() => deleteEvent(event._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </section>
    </div>
  );
};

export default NGODashboard;
