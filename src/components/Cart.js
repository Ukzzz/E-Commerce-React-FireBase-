import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleIncreaseQuantity = (itemId) => {
    const item = cart.find((i) => i.id === itemId);
    if (item) {
      updateQuantity(itemId, (item.quantity || 1) + 1);
    }
  };

  const handleDecreaseQuantity = (itemId) => {
    const item = cart.find((i) => i.id === itemId);
    if (item && item.quantity > 1) {
      updateQuantity(itemId, (item.quantity || 1) - 1);
    } else {
      removeFromCart(itemId);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  return (
    <div className="container">
      <h1>Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty. <a href="/" className="nav-link">Start shopping!</a></p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image || '/fallback.jpg'} alt={item.name || 'Item'} onError={(e) => { e.target.src = '/fallback.jpg'; }} />
              <div>
                <h3>{item.name || 'Unnamed Item'}</h3>
                <p className="price">Price: ${(item.price || 0).toFixed(2)}</p>
                <p>Quantity: {item.quantity || 1}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    className="button quantity-button"
                    onClick={() => handleIncreaseQuantity(item.id)}
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    +
                  </button>
                  <button
                    className="button quantity-button"
                    onClick={() => handleDecreaseQuantity(item.id)}
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    −
                  </button>
                  <button
                    className="button"
                    onClick={() => removeFromCart(item.id)}
                    style={{ background: '#c62828' }}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <p className="cart-total">Total: ${total.toFixed(2)}</p>
          <button className="button" onClick={handleCheckout}>Check Out</button>
        </>
      )}
    </div>
  );
}

export default Cart;