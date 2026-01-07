import { useEffect, useState } from 'react';
import axios from 'axios';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const VolunteerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [profile, setProfile] = useState({});
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
    if (role !== 'volunteer') return navigate('/login'); // only allow volunteers
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchEvents();
  }, []);

  const fetchProfile = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get('http://localhost:5000/api/user/me', { headers });
      setProfile(res.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

 const fetchEvents = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get('http://localhost:5000/api/event', { headers });
      // Backend now returns { success: true, data: events }
      const eventsData = res.data.data || res.data;
      setEvents(eventsData);
      const userId = JSON.parse(atob(token.split('.')[1])).id;
      const joined = eventsData.filter(event => event.volunteers.includes(userId));
      setJoinedEvents(joined.map(e => e._id));
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const joinEvent = async (eventId) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(`http://localhost:5000/api/event/join/${eventId}`, {}, { headers });
      setJoinedEvents([...joinedEvents, eventId]);
    } catch (err) {
      alert(err.response?.data?.message || 'Error joining event');
    }
  };

  const handleDonate = async (eventId) => {
    const amount = prompt("Enter donation amount (in ₹):");
    if (!amount || isNaN(amount)) return alert("Invalid amount");

    try {
      const token = localStorage.getItem('token');
      await API.post(`/donate/event/${eventId}`, { amount: parseFloat(amount) }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Donation successful!");
    } catch (err) {
      console.error(err);
      alert("Donation failed. Try again.");
    }
  };

  

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <header className="p-2 flex justify-between items-center bg-dark text-white mb-2">
        <h1 className="text-lg font-semibold px-2 p-1">Volunteer Dashboard – VolunteerConnect</h1>
      </header>

      <section className='bg-gray-100 p-3 mt-1 mb-4 rounded shadow'>
        <h2 className="text-xl font-semibold px-2 mb-2">Welcome, {profile.name}</h2>
        <p className="text-sm px-3 mb-0 text-gray-600">View your profile and join events here.</p>
      </section>

      {profile && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 mb-4">
        <div className="bg-white px-4 py-2 m-1 border rounded shadow mb-4 col-span-2">
          <h2 className="text-sm text-gray-600">Profile</h2>
          <p className="text-lg font-bold text-gray-800"><strong>Name : </strong> {profile.name}</p>
          <p className="text-lg font-bold text-gray-800"><strong>Email : </strong> {profile.email}</p>
          <p className="text-lg font-bold text-gray-800"><strong>Joined Events :</strong> {joinedEvents.length}</p>
        </div>
          </section>
      )}

     <section className="mb-4 px-4">
        <h2 className="text-xl font-semibold text-gray-800 text-center border rounded p-2 shadow px-4 cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection('events')}>Available Events <span>{expanded === 'events' ? '' : ''}</span></h2>
        {expanded === 'events' && (
          <div className="overflow-x-auto px-4 mt-4">
            <table className="text-sm w-full bg-white shadow rounded">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 border text-center">Title</th>
                  <th className="p-2 border text-center">Description</th>
                  <th className="p-2 border text-center">Date</th>
                  <th className="p-2 border text-center">NGO</th>
                  <th className="p-2 border text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event._id}>
                    <td className="border p-2 w-full">{event.title}</td>
                    <td className="border p-2">{event.description}</td>
                    <td className="border p-2">{new Date(event.date).toLocaleDateString()}</td>
                    <td className="border p-2">{event.ngo?.name || 'N/A'}</td>
                    <td className="border p-2">
                        {joinedEvents.includes(event._id) ? (
                          <span className="text-green-600 font-semibold">Joined</span>
                        ) : (
                          <button
                            onClick={() => joinEvent(event._id)}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded mx-2 m-1"
                          >
                            Join
                          </button>
                        )}
                        <button
                          onClick={() => handleDonate(event._id)}
                          className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded mx-2 m-1"
                        >
                          Donate
                        </button>
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default VolunteerDashboard;
