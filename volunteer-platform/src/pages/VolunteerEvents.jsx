import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VolunteerEvents = () => {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/event');
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const joinEvent = async (eventId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/event/join/${eventId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Failed to join event');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>

      {message && <div className="mb-4 text-blue-600">{message}</div>}

      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <div className="space-y-4">
          {events.map(event => (
            <div key={event._id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-bold">{event.title}</h3>
              <p>{event.description}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <button
                onClick={() => joinEvent(event._id)}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
              >
                Join Event
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VolunteerEvents;
