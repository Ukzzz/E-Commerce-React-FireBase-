import React from 'react';  // React import kar rahe hain
import { Link } from 'react-router-dom';  // Link component import kar rahe hain

const categories = ['shoes', 'watches', 'phones'];  // Static categories array jise hum list karenge

function MainPage() {  // MainPage component define kar rahe hain
  return (
    <div className="container">  {/* Container div */}
      <h1>Shop by Category</h1>  {/* Heading */}

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>  {/* Flexbox layout jisme gap aur wrap styling hai */}
        {categories.map((cat) => (  // Categories ko map karke cards banayenge
          <Link to={`/item/${cat}`} key={cat} className="card">  {/* Har category ka link jo us category ke items dikhata hai */}
            <img src={`/${cat}.jpg`} alt={cat} className="image" />  {/* Category ki image */}
            <h2>{cat}</h2>  {/* Category ka naam */}
            <button className="button">View More</button>  {/* View more button */}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MainPage;  // Export kar rahe hain
