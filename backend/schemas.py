from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

Category = Literal["bebidas", "snacks", "golosinas", "limpieza", "varios"]


class ProductCreate(BaseModel):
    name: str
    category: Category
    price: float = Field(gt=0)      # price debe ser mayor a 0
    stock: int = Field(ge=0)        # stock no puede ser negativo
    description: Optional[str] = None
    image_url: Optional[str] = None

    @field_validator("name")
    @classmethod
    def name_no_vacio(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("El nombre no puede estar vacío")
        return value.strip()


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    category: str
    price: float
    stock: int
    description: Optional[str] = None
    image_url: Optional[str] = None


class OrderItemIn(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class OrderCreate(BaseModel):
    items: list[OrderItemIn] = Field(min_length=1)


class OrderItemOut(BaseModel):
    product_id: int
    name: str
    quantity: int
    unit_price: float
    subtotal: float


class OrderOut(BaseModel):
    id: int
    created_at: datetime
    total: float
    items: list[OrderItemOut]