import { Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import ItemPreview from './components/ItemPreview';
import Cart from './components/Cart';
import Login from './components/Login';
import SignUp from './components/Signup';
import Checkout from './components/Checkout';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import { CartProvider } from './contexts/CartContext';
import './index.css';

function App() {
  return (
    <div className="App">
      <CartProvider>
        <Navbar />
        <main className="App-main">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/item/:category" element={<ItemPreview />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </CartProvider>
    </div>
  );
}

export default App;