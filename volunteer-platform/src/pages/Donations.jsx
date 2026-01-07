/**
 * Donations Page
 * Display and manage donations
 */

import React, { useState, useEffect } from 'react';
import API from '../api';
import PaymentModal from '../components/PaymentModal';

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Payment modal state
  const [showPayment, setShowPayment] = useState(false);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');

  useEffect(() => {
    fetchDonations();
    fetchNGOs();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await API.get('/donate');
      setDonations(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch donations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNGOs = async () => {
    try {
      const response = await API.get('/ngo');
      setNgos(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch NGOs:', err);
    }
  };

  const handleDonateClick = (ngo) => {
    setSelectedNgo(ngo);
    setDonationAmount('');
    setShowPayment(true);
  };

  const handlePaymentSuccess = (donation) => {
    // Add new donation to list
    setDonations([donation, ...donations]);
    setShowPayment(false);
    setSelectedNgo(null);
    setDonationAmount('');
    
    // Show success message
    alert('Thank you for your donation!');
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="row mb-5">
        <div className="col-lg-8">
          <h1 className="mb-2">Support Our Causes</h1>
          <p className="text-muted lead">
            Your donations help organizations create meaningful change in communities.
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {/* Donate to NGO Section */}
      <div className="row mb-5">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">💰 Make a Donation</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Select NGO</label>
                <select
                  className="form-select"
                  onChange={(e) => {
                    const ngo = ngos.find(n => n._id === e.target.value);
                    if (ngo) setSelectedNgo(ngo);
                  }}
                  value={selectedNgo?._id || ''}
                >
                  <option value="">-- Choose an NGO --</option>
                  {ngos.map(ngo => (
                    <option key={ngo._id} value={ngo._id}>
                      {ngo.name} {ngo.category && `(${ngo.category})`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Donation Amount (INR)</label>
                <div className="input-group">
                  <span className="input-group-text">₹</span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="100"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    min="1"
                  />
                </div>
                <small className="text-muted d-block mt-1">
                  Minimum donation: ₹1
                </small>
              </div>

              <button
                className="btn btn-primary btn-lg w-100"
                onClick={() => setShowPayment(true)}
                disabled={!selectedNgo || !donationAmount || parseInt(donationAmount) < 1}
              >
                Proceed to Payment
              </button>
              <small className="text-muted d-block mt-2">
                🔒 This is a mock payment system for demonstration
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Donations */}
      <div className="row">
        <div className="col-lg-8">
          <h3 className="mb-4">Recent Donations</h3>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : donations.length === 0 ? (
            <div className="alert alert-info">
              No donations yet. Be the first to donate!
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Donor</th>
                    <th>Amount</th>
                    <th>NGO</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map(donation => (
                    <tr key={donation._id}>
                      <td>{donation.donor?.name || 'Anonymous'}</td>
                      <td className="fw-bold">₹{donation.amount}</td>
                      <td>{donation.ngo?.name || 'N/A'}</td>
                      <td>
                        <span className={`badge bg-${donation.paymentStatus === 'completed' ? 'success' : 'warning'}`}>
                          {donation.paymentStatus === 'completed' ? '✓ Completed' : 'Pending'}
                        </span>
                      </td>
                      <td className="text-muted">
                        {donation.date ? new Date(donation.date).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        show={showPayment}
        onClose={() => setShowPayment(false)}
        ngoId={selectedNgo?._id}
        amount={parseInt(donationAmount) || 0}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Donations;
