import type { Category, Product } from "../types";

const API_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

// Así devuelve los productos el BACKEND (nombres de la tabla de la consigna)
interface ProductApi {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string | null;
  image_url: string | null;
}

// Traduce del formato del backend al formato de TU frontend (tu tipo Product)
function toProduct(p: ProductApi): Product {
  return {
    id: p.id,
    name: p.name,
    precio: p.price,
    categoria: p.category as Category,
    stock: p.stock,
    descripcion: p.description ?? "",
    imageUrl: p.image_url ?? "",
  };
}

export interface OrderItemInput {
  product_id: number;
  quantity: number;
}

export interface OrderItem {
  product_id: number;
  name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  created_at: string;
  total: number;
  items: OrderItem[];
}

async function leerMensajeDeError(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (typeof body.detail === "string") return body.detail;
    if (Array.isArray(body.detail)) {
      // Errores de validación de Pydantic (422): lista de { msg, loc, ... }
      return body.detail.map((e: { msg: string }) => e.msg).join(". ");
    }
  } catch {
    // la respuesta no era JSON
  }
  return `Error del servidor (código ${response.status})`;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: AbortSignal.timeout(10000), // corta si el servidor tarda más de 10 segundos
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Verificá que el backend esté encendido.");
  }

  if (!response.ok) {
    throw new Error(await leerMensajeDeError(response));
  }
  return (await response.json()) as T;
}

export async function getProducts(category?: string): Promise<Product[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const data = await request<ProductApi[]>(`/products${query}`);
  return data.map(toProduct);
}

export async function getProductById(id: number): Promise<Product> {
  const data = await request<ProductApi>(`/products/${id}`);
  return toProduct(data);
}

export function createOrder(items: OrderItemInput[]): Promise<Order> {
  return request<Order>("/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
}