from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models  # noqa: F401  (hace que SQLAlchemy conozca las tablas antes de crearlas)
from database import Base, SessionLocal, engine
from routers import orders, products
from seed import cargar_productos_iniciales

# Crea las tablas si no existen y carga los productos de ejemplo si la tabla está vacía
Base.metadata.create_all(bind=engine)
with SessionLocal() as db:
    cargar_productos_iniciales(db)

app = FastAPI(title="API Kiosco", version="1.0.0")

# CORS: permite que el frontend (Vite, normalmente en el puerto 5173) llame a esta API (puerto 8000).
# Se acepta cualquier puerto de localhost porque Vite cambia de puerto si el 5173 está ocupado.
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(orders.router)