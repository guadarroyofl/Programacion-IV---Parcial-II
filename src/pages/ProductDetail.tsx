import { useEffect, useState } from "react"; // NUEVO: useEffect
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../services/api"; // NUEVO (reemplaza el import de ../data/products)
import { useCart } from "../context/CartContext";
import type { Product } from "../types"; // NUEVO

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [cantidad, setCantidad] = useState(1);

  // NUEVO: el producto viene del backend, con estados de carga y error
  const [producto, setProducto] = useState<Product | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useParams siempre devuelve texto, por eso Number(id)
  // Antes: products.find((p) => p.id === Number(id))
  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setError(null);

    getProductById(Number(id))
      .then((data) => {
        if (!cancelado) setProducto(data);
      })
      .catch((err: unknown) => {
        if (!cancelado) setError(err instanceof Error ? err.message : "Error desconocido");
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [id]);

  // NUEVO
  if (cargando) {
    return (
      <section>
        <p>Cargando producto...</p>
      </section>
    );
  }

  // NUEVO: error visible en pantalla (red caída, producto inexistente, etc.)
  if (error) {
    return (
      <section>
        <h1>No se pudo cargar el producto</h1>
        <p role="alert" style={{ color: "crimson" }}>
          {error}
        </p>
        <Link to="/products">Volver al catálogo</Link>
      </section>
    );
  }

  if (!producto) {
    return (
      <section>
        <h1>Producto no encontrado</h1>
        <Link to="/products">Volver al catálogo</Link>
      </section>
    );
  }

  return (
    <section className="detalle">
      <img src={producto.imageUrl} alt={producto.name} width={200} />
      <h1>{producto.name}</h1>
      <p>Categoría: {producto.categoria}</p>
      <p>Precio: ${producto.precio}</p>
      <p>Stock: {producto.stock}</p>
      <p>{producto.descripcion}</p>

      <label>
        Cantidad:
        <input
          type="number"
          min={1}
          max={producto.stock}
          value={cantidad}
          onChange={(e) =>
            setCantidad(Math.min(Math.max(Number(e.target.value), 1), producto.stock))
          }
        />
      </label>

      <button onClick={() => addToCart(producto, cantidad)}>Agregar al carrito</button>
      <Link to="/products">Volver al catálogo</Link>
    </section>
  );
}

export default ProductDetail;