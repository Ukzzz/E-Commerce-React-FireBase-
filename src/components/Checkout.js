import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { db } from '../firebase-config';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';

function Checkout() {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    phoneNumber: '',
  });
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const TAX_RATE = 0.1;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfile(userData);
          setFormData({
            name: `${userData.firstName} ${userData.lastName}`,
            address: userData.address,
            city: '',
            country: '',
            phoneNumber: userData.phoneNumber,
          });
        } else {
          setError('Profile not found. Please complete your profile.');
        }
      } catch (err) {
        setError('Failed to load profile.');
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const validateForm = (data) => {
    const errors = {};
    if (!data.name) errors.name = 'Full name is required';
    if (!data.address) errors.address = 'Address is required';
    if (!data.city) errors.city = 'City is required';
    if (!data.country) errors.country = 'Country is required';
    if (!data.phoneNumber) errors.phoneNumber = 'Phone number is required';
    else if (!/^\+?\d{10,}$/.test(data.phoneNumber)) errors.phoneNumber = 'Invalid phone number';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (profile) {
      const fullName = `${profile.firstName} ${profile.lastName}`;
      if (formData.name !== fullName || formData.address !== profile.address || formData.phoneNumber !== profile.phoneNumber) {
        setError('Please enter correct details matching your profile.');
        return;
      }
    } else {
      setError('Profile not found. Please sign up or complete your profile.');
      return;
    }

    try {
      const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
      const tax = subtotal * TAX_RATE;
      const total = subtotal + tax;

      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        items: cart,
        name: formData.name,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        phoneNumber: formData.phoneNumber,
        subtotal,
        tax,
        total,
        date: new Date().toISOString(),
      });

      clearCart();
      setSuccess('Order successfully placed!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError('Failed to place order.');
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <div className="form-box">
      <h2 className="auth-title">Checkout</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      {!success && profile && (
        <form onSubmit={handleConfirmOrder}>
          <div>
            <input
              type="text"
              className="input"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              aria-invalid={formErrors.name ? 'true' : 'false'}
            />
            {formErrors.name && <p className="error-message">{formErrors.name}</p>}
          </div>
          <div>
            <input
              type="text"
              className="input"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              aria-invalid={formErrors.address ? 'true' : 'false'}
            />
            {formErrors.address && <p className="error-message">{formErrors.address}</p>}
          </div>
          <div>
            <input
              type="text"
              className="input"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
              aria-invalid={formErrors.city ? 'true' : 'false'}
            />
            {formErrors.city && <p className="error-message">{formErrors.city}</p>}
          </div>
          <div>
            <input
              type="text"
              className="input"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              required
              aria-invalid={formErrors.country ? 'true' : 'false'}
            />
            {formErrors.country && <p className="error-message">{formErrors.country}</p>}
          </div>
          <div>
            <input
              type="tel"
              className="input"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              aria-invalid={formErrors.phoneNumber ? 'true' : 'false'}
            />
            {formErrors.phoneNumber && <p className="error-message">{formErrors.phoneNumber}</p>}
          </div>
          <h3>Order Summary</h3>
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Tax (10%): ${tax.toFixed(2)}</p>
          <p><strong>Total: ${total.toFixed(2)}</strong></p>
          <button type="submit" className="button">Confirm Order</button>
        </form>
      )}
    </div>
  );
}

export default Checkout;