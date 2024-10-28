import './App.css';
import NavBar from './components/navbar/NavBar';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Home from './pages/Home';
import ShopCategory from './pages/ShopCategory';
import Product from './pages/Product';
import Cart from './pages/Cart'
import LoginSignup from './pages/LoginSignup'

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
      </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
