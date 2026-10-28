import { Link } from "react-router-dom";

function Home() {
  return (
    <section>
      <h1>¡Bienvenido a Kiosco Don Julio!</h1>
      <p>Bebidas, snacks, golosinas y productos de limpieza, todo en un solo lugar.</p>
      <Link to="/products" className="boton-grande">
        Ver el catálogo
      </Link>
    </section>
  );
}

export default Home;