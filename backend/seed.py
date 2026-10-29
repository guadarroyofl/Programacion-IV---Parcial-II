from sqlalchemy.orm import Session

from models import Product

PRODUCTOS_INICIALES = [
    {"name": "Coca-Cola 500ml", "category": "bebidas", "price": 1500, "stock": 21, "description": "Gaseosa clásica", "image_url": "/productosimg/coca-500ml.png"},
    {"name": "Papas Fritas lays", "category": "snacks", "price": 3500, "stock": 7, "description": "Papas fritas clásicas", "image_url": "/productosimg/papas-lays.png"},
    {"name": "Poett Limpiador 900ml", "category": "limpieza", "price": 2700, "stock": 15, "description": "Perfume para piso", "image_url": "/productosimg/poett-900ml.png"},
    {"name": "Agua mineral Villavicencio 500ml", "category": "bebidas", "price": 1700, "stock": 40, "description": "Agua sin gas", "image_url": "/productosimg/agua-villavicencio.png"},
    {"name": "Gomitas Mogul", "category": "golosinas", "price": 2000, "stock": 11, "description": "Gomitas acidas", "image_url": "/productosimg/gomitas-mogul.png"},
    {"name": "Aquarius de Pera 300ml", "category": "bebidas", "price": 1500, "stock": 10, "description": "Jugo de pera", "image_url": "/productosimg/aquarius-pera.png"},
    {"name": "Alfajor Tatin", "category": "golosinas", "price": 1200, "stock": 3, "description": "Alfajor de chocolate", "image_url": "/productosimg/alfajor-tatin.png"},
    {"name": "Maní King", "category": "snacks", "price": 2200, "stock": 9, "description": "Maní Tostado sin piel", "image_url": "/productosimg/mani-king.png"},
    {"name": "Detergente Magistral 300ml", "category": "limpieza", "price": 1900, "stock": 27, "description": "Detergente anti-grasa", "image_url": "/productosimg/magistral-300ml.png"},
    {"name": "Nutella 140g", "category": "golosinas", "price": 4600, "stock": 7, "description": "Pasta de avellanas Nutella", "image_url": "/productosimg/nutella-140g.png"},
]


def cargar_productos_iniciales(db: Session) -> None:
    """Carga los productos de ejemplo solo si la tabla está vacía."""
    if db.query(Product).count() > 0:
        return
    db.add_all([Product(**datos) for datos in PRODUCTOS_INICIALES])
    db.commit()