import type { ChangeEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import type { Category } from "../types";

const categorias: Category[] = ["bebidas", "snacks", "golosinas", "limpieza"];

function Products() {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  // La URL es la fuente de verdad: /products?category=bebidas
  const categoriaActiva = searchParams.get("category");

  const productosFiltrados = categoriaActiva
    ? products.filter((p) => p.categoria === categoriaActiva)
    : products;

  function cambiarFiltro(e: ChangeEvent<HTMLSelectElement>) {
    const valor = e.target.value;
    if (valor === "") {
      setSearchParams({}); // sin filtro: /products
    } else {
      setSearchParams({ category: valor }); // /products?category=valor
    }
  }

  return (
    <section>
      <h1>Productos</h1>

      <label>
        Categoría:
        <select value={categoriaActiva ?? ""} onChange={cambiarFiltro}>
          <option value="">Todas</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </label>

      {productosFiltrados.length === 0 && <p>No hay productos en esta categoría.</p>}

      <div className="grilla">
        {productosFiltrados.map((producto) => (
          <article key={producto.id}>
            <img src={producto.imageUrl} alt={producto.name} width={120} />
            <h3>{producto.name}</h3>
            <p>${producto.precio}</p>
            <Link to={`/products/${producto.id}`}>Ver detalle</Link>
            <button onClick={() => addToCart(producto, 1)}>Agregar al carrito</button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Products;