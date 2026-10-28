import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Cart from './pages/Cart';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import './App.css'

function App() {
   return (
    <Routes>

      <Route path='/' element={<Layout/>}>
        <Route index element= {<Home/>}/>
        <Route path='products' element= {<Products/>}/>
        <Route path='products/:id' element= {<ProductDetail/>}/>
        <Route path='cart' element= {<Cart/>}/>
        <Route path='*' element= {<NotFound/>}/>
      </Route>

    </Routes>
  );

}

export default App;