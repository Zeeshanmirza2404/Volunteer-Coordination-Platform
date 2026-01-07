import React, { useState } from 'react';
import axios from 'axios';

function EventCard({ event }) {
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [amount, setAmount] = useState('');

  const handleDonate = async () => {
    try {
      const token = localStorage.getItem('token'); // assuming you stored it here
      await axios.post('http://localhost:5000/api/donation/donate', {
        amount,
        ngoId: event.ngo._id,
        eventId: event._id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Donation successful!');
      setShowDonationForm(false);
      setAmount('');
    } catch (err) {
      console.error(err);
      alert('Donation failed');
    }
  };

  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      <p>Location: {event.location}</p>

      {/* Donation button */}
      <button onClick={() => setShowDonationForm(!showDonationForm)}>
        {showDonationForm ? 'Cancel' : 'Donate'}
      </button>

      {/* Donation form */}
      {showDonationForm && (
        <div style={{ marginTop: '10px' }}>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={handleDonate}>Confirm Donation</button>
        </div>
      )}
    </div>
  );
}

export default EventCard;
