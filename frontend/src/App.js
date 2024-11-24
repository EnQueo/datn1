import './App.css';
import NavBar from './components/navbar/NavBar';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Home from './pages/Home';
import ShopCategory from './pages/ShopCategory';
import Product from './pages/Product';
import Cart from './pages/Cart'
import LoginSignup from './pages/LoginSignup'
import Payment from './pages/Payment';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <div >    
      <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/shoes' element={<ShopCategory category="shoes"/>}/>
        <Route path='/basketballs' element={<ShopCategory  category="basketballs"/>}/>
        <Route path='/accessories' element={<ShopCategory category="accessories"/>}/>
        <Route path="/product" element={<Product/>}>
          <Route path=':productId' element={<Product/>}/>
        </Route>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/login' element={<LoginSignup/>}/>
        <Route path='/payment' element={<Payment/>}/>
        <Route path='/user-profile' element={<UserProfile/>}/>
      </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
