import json

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import Order, Product
from schemas import OrderCreate, OrderOut

router = APIRouter(prefix="/api/orders", tags=["orders"])


def armar_respuesta(pedido: Order) -> OrderOut:
    """Convierte el pedido guardado en la base (items_json es texto) en la respuesta de la API."""
    return OrderOut(
        id=pedido.id,
        created_at=pedido.created_at,
        total=pedido.total,
        items=json.loads(pedido.items_json),
    )


@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def crear_pedido(datos: OrderCreate, db: Session = Depends(get_db)):
    # 1) Juntar cantidades por producto (si el mismo producto viene dos veces, se suman)
    cantidades: dict[int, int] = {}
    for item in datos.items:
        cantidades[item.product_id] = cantidades.get(item.product_id, 0) + item.quantity

    # 2) Validar TODO antes de modificar nada
    lineas = []
    total = 0.0
    for product_id, cantidad in cantidades.items():
        producto = db.get(Product, product_id)
        if producto is None:
            raise HTTPException(status_code=404, detail=f"El producto {product_id} no existe")
        if producto.stock < cantidad:
            raise HTTPException(
                status_code=400,
                detail=f"Stock insuficiente para '{producto.name}': quedan {producto.stock} y pediste {cantidad}",
            )
        subtotal = round(producto.price * cantidad, 2)
        total += subtotal
        lineas.append((producto, cantidad, subtotal))

    # 3) Recién ahora se descuenta el stock y se guarda el pedido (una sola transacción)
    items_guardados = []
    for producto, cantidad, subtotal in lineas:
        producto.stock -= cantidad
        items_guardados.append(
            {
                "product_id": producto.id,
                "name": producto.name,
                "quantity": cantidad,
                "unit_price": producto.price,
                "subtotal": subtotal,
            }
        )

    pedido = Order(total=round(total, 2), items_json=json.dumps(items_guardados))
    db.add(pedido)
    db.commit()
    db.refresh(pedido)
    return armar_respuesta(pedido)


@router.get("", response_model=list[OrderOut])
def listar_pedidos(db: Session = Depends(get_db)):
    pedidos = db.query(Order).order_by(Order.id.desc()).all()
    return [armar_respuesta(p) for p in pedidos]