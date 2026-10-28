import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [cantidad, setCantidad] = useState(1);

  // useParams siempre devuelve texto, por eso Number(id)
  const producto = products.find((p) => p.id === Number(id));

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