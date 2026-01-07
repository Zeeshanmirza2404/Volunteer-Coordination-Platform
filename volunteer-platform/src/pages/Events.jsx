// src/pages/Events.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API from '../api';


const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch events from the backend
    axios.get('http://localhost:5000/api/event')
      .then(response => {
        // Backend now returns { success: true, data: events }
        const eventsData = response.data.data || response.data;
        setEvents(Array.isArray(eventsData) ? eventsData : []);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        setEvents([]); // Set empty array on error
      });
  }, []);

    const handleJoin = async (eventId) => {
        try {
         const token = localStorage.getItem('token'); // JWT token from login
        await axios.put(`http://localhost:5000/api/event/join/${eventId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
            }   
        });
        alert('Successfully joined the event!');
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
    <div className="p-6">
      <h2 className="text-2xl font-bold px-4 p-2 bg-dark text-white">Upcoming Events</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="grid border gap-4 m-1">
          {events.map(event => (
            <div key={event._id} className="border p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p>{event.description}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <button  className="mt-2 px-4 py-2 bg-dark text-white rounded" onClick={() => handleJoin(event._id)}>  
                 Join Event
                 </button>
                  <button
                          onClick={() => handleDonate(event._id)}
                          className="px-4 py-2 rounded mx-2 m-1"
                        >
                          Donate
                        </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
