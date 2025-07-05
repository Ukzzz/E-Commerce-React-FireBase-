import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { useCart } from '../contexts/CartContext';

function ItemPreview() {
  const { category } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, category));
        setItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error('Error fetching items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [category]);

  return (
    <div className="container">
      <h1 className="capitalize">{category}</h1>
      {loading ? (
        <div className="spinner" aria-label="Loading items"></div>
      ) : items.length === 0 ? (
        <p>No items found in this category.</p>
      ) : (
        <div className="item-grid">
          {items.map((item) => (
            <div key={item.id} className="card">
              <img
                src={item.image || '/fallback.jpg'}
                alt={item.name || 'Item'}
                className="image"
                onError={(e) => { e.target.src = '/fallback.jpg'; }}
              />
              <h2>{item.name || 'Unnamed Item'}</h2>
              <p className="price">${(item.price || 0).toFixed(2)}</p>
              <p>{item.color || 'N/A'}</p>
              <button
                className="button"
                onClick={() => addToCart(item)}
                aria-label={`Add ${item.name || 'item'} to cart`}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ItemPreview;