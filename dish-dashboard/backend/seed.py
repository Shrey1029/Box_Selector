import asyncio
from db import dishes_collection

data = [
    {
        "dishId": "1",
        "dishName": "Margherita Pizza",
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg",
        "isPublished": True,
    },
    {
        "dishId": "2",
        "dishName": "Spaghetti Carbonara",
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/33/Fresh_made_pasta_07.jpg",
        "isPublished": True,
    },
    {
        "dishId": "3",
        "dishName": "Chicken Tikka Masala",
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/c/cd/Indian_tikka_massala.jpg",
        "isPublished": False,
    },
    {
        "dishId": "4",
        "dishName": "Caesar Salad",
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Caesar_salad.jpg/800px-Caesar_salad.jpg",
        "isPublished": True,
    },
    {
        "dishId": "5",
        "dishName": "Beef Tacos",
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/7/73/001_Tacos_de_carnitas%2C_carne_asada_y_longaniza.jpg",
        "isPublished": True,
    },
    {
        "dishId": "6",
        "dishName": "Pad Thai",
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/7/75/Authentic_Thai_Cuisine_-_Pad_Thai_%288653965262%29.jpg",
        "isPublished": False,
    },
    {
        "dishId": "7",
        "dishName": "Sushi Platter",
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/6/60/Sushi_platter.jpg",
        "isPublished": True,
    },
    {
        "dishId": "8",
        "dishName": "French Onion Soup",
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d8/Onion_soup-1.jpg",
        "isPublished": True,
    },
]


async def seed():
    existing = await dishes_collection.count_documents({})
    if existing > 0:
        print(f"Database already has {existing} dishes. Skipping seed.")
        return

    await dishes_collection.insert_many(data)
    print(f"Seeded {len(data)} dishes successfully.")


if __name__ == "__main__":
    asyncio.run(seed())
