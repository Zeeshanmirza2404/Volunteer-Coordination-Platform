/**
 * Payment Modal Component
 * Handles fake payment flow for donations
 */

import React, { useState } from "react";
import API from "../api";

const PaymentModal = ({ show, onClose, ngoId, eventId, amount, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, processing, success, error
  const [donationId, setDonationId] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleInitiatePayment = async () => {
    if (!amount || amount < 1) {
      setErrorMsg("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setStatus("processing");
    setErrorMsg("");

    try {
      // Step 1: Initiate payment
      const response = await API.post("/payment/initiate", {
        amount,
        ngoId,
        eventId,
      });

      const { data } = response.data;
      setDonationId(data.donationId);
      setPaymentId(data.paymentId);
      setOrderId(data.orderId);

      // Simulate payment processing delay
      setTimeout(
        () =>
          handleVerifyPayment(data.donationId, data.paymentId, data.orderId),
        2000
      );
    } catch (error) {
      setStatus("error");
      setErrorMsg(
        error.response?.data?.message || "Failed to initiate payment"
      );
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (donId, payId, ordId) => {
    try {
      // Step 2: Verify payment
      const response = await API.post("/payment/verify", {
        donationId: donId,
        paymentId: payId,
        orderId: ordId,
      });

      setStatus("success");
      setLoading(false);

      // Call success callback
      if (onSuccess) {
        onSuccess(response.data.data);
      }
    } catch (error) {
      setStatus("error");
      setErrorMsg(
        error.response?.data?.message || "Payment verification failed"
      );
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStatus("idle");
    setErrorMsg("");
    setDonationId(null);
    setPaymentId(null);
    setOrderId(null);
    onClose();
  };

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header bg-light">
            <h5 className="modal-title">
              {status === "success"
                ? "✓ Payment Successful"
                : "Complete Your Donation"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              disabled={loading}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            {status === "idle" && (
              <div>
                <div className="alert alert-info" role="alert">
                  <strong>🔒 Mock Payment System</strong>
                  <p className="mb-0">
                    This is a demonstration. No real charge will be made.
                  </p>
                </div>

                <div className="mb-3">
                  <label className="form-label">Donation Amount (INR)</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      value={amount}
                      readOnly
                      disabled
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-muted small">
                    <strong>Note:</strong> You will be redirected to complete
                    payment. This is a simulated flow.
                  </p>
                </div>
              </div>
            )}

            {status === "processing" && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Processing...</span>
                </div>
                <p className="text-muted">
                  <strong>Processing your donation...</strong>
                </p>
                <small className="text-secondary">
                  This may take a few seconds
                </small>
              </div>
            )}

            {status === "success" && (
              <div>
                <div className="alert alert-success" role="alert">
                  <strong>🎉 Thank you for your donation!</strong>
                </div>

                <div className="payment-details bg-light p-3 rounded mb-3">
                  <dl className="row mb-0">
                    <dt className="col-sm-6">Donation ID</dt>
                    <dd className="col-sm-6 text-end font-monospace text-break">
                      {donationId?.toString().slice(-8)}
                    </dd>

                    <dt className="col-sm-6">Amount</dt>
                    <dd className="col-sm-6 text-end">
                      <strong>₹{amount}</strong>
                    </dd>

                    <dt className="col-sm-6">Status</dt>
                    <dd className="col-sm-6 text-end">
                      <span className="badge bg-success">Completed</span>
                    </dd>
                  </dl>
                </div>

                <p className="text-muted small mb-0">
                  A confirmation email will be sent to your registered email
                  address.
                </p>
              </div>
            )}

            {status === "error" && (
              <div>
                <div className="alert alert-danger" role="alert">
                  <strong>❌ Payment Failed</strong>
                  <p className="mb-0">{errorMsg}</p>
                </div>

                <p className="text-muted small">
                  Please try again or contact support if the problem persists.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              {status === "success" ? "Close" : "Cancel"}
            </button>

            {(status === "idle" || status === "error") && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleInitiatePayment}
                disabled={loading || !amount || amount < 1}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Processing...
                  </>
                ) : (
                  `Pay ₹${amount || 0}`
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
