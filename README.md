# Kiosco de barrio

Mini-app de un kiosco: catálogo de productos, filtro por categoría, detalle de producto,
carrito y pedido. Hecha con React + TypeScript + Vite + react-router-dom.

## Rutas
- `/` inicio
- `/products` catálogo (filtro por categoría con `?category=`)
- `/products/:id` detalle de producto
- `/cart` carrito
- cualquier otra ruta muestra la página 404

## Requisitos
- Node.js (versión LTS)
- Python 3.10 o superior (solo para el backend, Parte 2)

## Frontend: instalar y correr
npm install
npm run dev

Abrir la URL que muestra la terminal (normalmente http://localhost:5173).

## Backend (FastAPI + SQLite)

### Instalar dependencias
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

### Correr el backend
uvicorn main:app --reload

La API queda en http://localhost:8000 y la documentación en http://localhost:8000/docs.

### Correr el frontend apuntando a la API
En otra terminal, en la raíz del proyecto:
npm install
npm run dev

El frontend consume la API en http://localhost:8000/api (configurable con VITE_API_URL
en un archivo .env). Con el backend apagado, la interfaz muestra un mensaje de error en pantalla.