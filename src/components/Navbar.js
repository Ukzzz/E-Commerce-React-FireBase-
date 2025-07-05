import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase-config';
import { signOut } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

function Navbar() {
  const { user } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="navbar" aria-label="Main navigation">
      <Link to="/" className="navbar-logo">E-Shop</Link>
      <div
        className={`hamburger ${isMenuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        role="button"
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
        <Link to="/cart" className="nav-link" onClick={() => setIsMenuOpen(false)}>
          <span className="cart-bucket">
            <span className="cart-icon">🛒</span>
            Cart
            {cart.length > 0 && (
              <span className="cart-badge" data-count={cart.length} title={`You have ${cart.length} items in your cart`}>
                {cart.length}
              </span>
            )}
          </span>
        </Link>
        {user ? (
          <button className="button" onClick={handleLogout} aria-label="Logout">Logout</button>
        ) : (
          <>
            <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>Login</Link>
            <Link to="/signup" className="nav-link" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;