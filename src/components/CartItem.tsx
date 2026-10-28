import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const [pedidoRealizado, setPedidoRealizado] = useState(false);

  function cambiarCantidad(id: number, stock: number, valor: number) {
    // Mínimo 1, máximo el stock disponible
    const cantidad = Math.min(Math.max(valor, 1), stock);
    updateQuantity(id, cantidad);
  }

  function finalizarPedido() {
    // Parte 1: solo simula el éxito, no llama a ninguna API
    clearCart();
    setPedidoRealizado(true);
  }

  if (pedidoRealizado) {
    return (
      <section>
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
      <button onClick={clearCart}>Vaciar carrito</button>
      <button onClick={finalizarPedido}>Finalizar pedido</button>
    </section>
  );
}

export default Cart;