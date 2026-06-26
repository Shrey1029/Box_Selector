from pydantic import BaseModel
from typing import Optional


class Dish(BaseModel):
    dishId: str
    dishName: str
    imageUrl: str
    isPublished: bool


class DishOut(BaseModel):
    dishId: str
    dishName: str
    imageUrl: str
    isPublished: bool

    class Config:
        from_attributes = True
