import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Header() {
  const { totalItems } = useCart();

  return (
    <header>
      <h1>Kiosco Don Julio</h1>
      <nav>
        <NavLink to="/"> Inicio </NavLink>
        <NavLink to="/products"> Productos </NavLink>
        <NavLink to="/cart"> Carrito ({totalItems}) </NavLink>
      </nav>
    </header>
  );
}

export default Header;