import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase-config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFormData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            address: userData.address || '',
            phoneNumber: userData.phoneNumber || '',
          });
        }
      } catch (err) {
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.firstName || !formData.lastName || !formData.address || !formData.phoneNumber) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!/^\+?\d{10,}$/.test(formData.phoneNumber)) {
      setError('Invalid phone number.');
      return;
    }

    try {
      await setDoc(doc(db, 'users', user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        email: user.email,
      });

      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/checkout'), 2000);
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  return (
    <div className="form-box">
      <h2 className="auth-title">Complete Your Profile</h2>
      {loading && <div className="spinner" aria-label="Loading profile"></div>}
      {!loading && error && <p className="error-message">{error}</p>}
      {!loading && success && <p className="success-message">{success}</p>}
      {!loading && !success && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="input"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
            aria-label="First Name"
          />
          <input
            type="text"
            className="input"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
            aria-label="Last Name"
          />
          <input
            type="text"
            className="input"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            aria-label="Address"
          />
          <input
            type="tel"
            className="input"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            aria-label="Phone Number"
          />
          <button type="submit" className="button" aria-label="Save Profile">Save Profile</button>
        </form>
      )}
    </div>
  );
}

export default Profile;