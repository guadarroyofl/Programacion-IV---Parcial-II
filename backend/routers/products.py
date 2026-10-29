from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import Product
from schemas import ProductCreate, ProductOut

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=list[ProductOut])
def listar_productos(category: Optional[str] = None, db: Session = Depends(get_db)):
    consulta = db.query(Product)
    if category:
        consulta = consulta.filter(Product.category == category.lower())
    return consulta.order_by(Product.id).all()


@router.get("/{product_id}", response_model=ProductOut)
def obtener_producto(product_id: int, db: Session = Depends(get_db)):
    producto = db.get(Product, product_id)
    if producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto

