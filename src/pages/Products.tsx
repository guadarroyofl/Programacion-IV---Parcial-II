import { useEffect, useState } from "react"; // NUEVO
import type { ChangeEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getProducts } from "../services/api"; // NUEVO (reemplaza el import de ../data/products)
import { useCart } from "../context/CartContext";
import type { Category, Product } from "../types"; // NUEVO: se suma Product

const categorias: Category[] = ["bebidas", "snacks", "golosinas", "limpieza"];

function Products() {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  // La URL es la fuente de verdad: /products?category=bebidas
  const categoriaActiva = searchParams.get("category");

  // NUEVO: los productos vienen del backend, con estados de carga y error
  const [productos, setProductos] = useState<Product[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NUEVO: el filtro ahora lo hace el backend (?category=), así que se vuelve a pedir
  // cada vez que cambia la categoría. Antes: products.filter(...)
  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setError(null);

    getProducts(categoriaActiva ?? undefined)
      .then((data) => {
        if (!cancelado) setProductos(data);
      })
      .catch((err: unknown) => {
        if (!cancelado) setError(err instanceof Error ? err.message : "Error desconocido");
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    // Limpieza: si cambia la categoría antes de que llegue la respuesta, se ignora la vieja
    return () => {
      cancelado = true;
    };
  }, [categoriaActiva]);

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

      {/* NUEVO: estados de carga y error visibles en pantalla */}
      {cargando && <p>Cargando productos...</p>}

      {error && (
        <p role="alert" style={{ color: "crimson" }}>
          No se pudieron cargar los productos. Intentá de nuevo. ({error})
        </p>
      )}

      {!cargando && !error && productos.length === 0 && (
        <p>No hay productos en esta categoría.</p>
      )}

      {!cargando && !error && (
        <div className="grilla">
          {productos.map((producto) => (
            <article key={producto.id}>
              <img src={producto.imageUrl} alt={producto.name} width={120} />
              <h3>{producto.name}</h3>
              <p>${producto.precio}</p>
              <Link to={`/products/${producto.id}`}>Ver detalle</Link>
              <button onClick={() => addToCart(producto, 1)}>Agregar al carrito</button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Products;