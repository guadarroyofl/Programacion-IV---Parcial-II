export type Category = "bebidas" | "snacks" | "golosinas" | "limpieza";

export interface Product{
    id: number;
    precio: number;
    categoria: Category;
    name: string;
    stock: number;
    descripcion: string;
    imageUrl: string;
}

export interface CartItem{
    producto: Product;
    cantidad: number;
}