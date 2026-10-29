import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api"; // NUEVO

function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const [pedidoRealizado, setPedidoRealizado] = useState(false);
  const [enviando, setEnviando] = useState(false); // NUEVO
  const [error, setError] = useState<string | null>(null); // NUEVO

  function cambiarCantidad(id: number, stock: number, valor: number) {
    // Mínimo 1, máximo el stock disponible
    const cantidad = Math.min(Math.max(valor, 1), stock);
    updateQuantity(id, cantidad);
  }

  // CAMBIÓ: antes solo simulaba el éxito; ahora manda el pedido al backend
  async function finalizarPedido() {
    setEnviando(true);
    setError(null);

    try {
      await createOrder(
        items.map((item) => ({
          product_id: item.producto.id,
          quantity: item.cantidad,
        }))
      );
      clearCart();
      setPedidoRealizado(true);
    } catch (err) {
      // El carrito NO se vacía: el usuario ve el error y puede corregir y reintentar
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setEnviando(false);
    }
  }

  if (pedidoRealizado) {
    return (
      <section className="carrito">
        <h1>Carrito</h1>
        <p>¡Pedido realizado con éxito! Gracias por tu compra.</p>
        <Link to="/products">Volver al catálogo</Link>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section>
        <h1>Carrito</h1>
        <p>Tu carrito está vacío.</p>
        <Link to="/products">Ir al catálogo</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Carrito</h1>

      {items.map((item) => (
        <article key={item.producto.id}>
          <img src={item.producto.imageUrl} alt={item.producto.name} width={80} />
          <h3>{item.producto.name}</h3>
          <p>Precio: ${item.producto.precio}</p>

          <label>
            Cantidad:
            <input
              type="number"
              min={1}
              max={item.producto.stock}
              value={item.cantidad}
              onChange={(e) =>
                cambiarCantidad(item.producto.id, item.producto.stock, Number(e.target.value))
              }
            />
          </label>

          <p>Subtotal: ${item.producto.precio * item.cantidad}</p>
          <button onClick={() => removeFromCart(item.producto.id)}>Eliminar</button>
        </article>
      ))}

      <h2>Total: ${totalPrice}</h2>

      {/* NUEVO: error visible en pantalla */}
      {error && (
        <p role="alert" style={{ color: "crimson" }}>
          No se pudo finalizar el pedido. {error}
        </p>
      )}

      <button onClick={clearCart} disabled={enviando}>
        Vaciar carrito
      </button>
      <button onClick={finalizarPedido} disabled={enviando}>
        {enviando ? "Enviando pedido..." : "Finalizar pedido"}
      </button>
    </section>
  );
}

export default Cart;