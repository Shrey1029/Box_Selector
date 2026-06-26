from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from db import dishes_collection
from models import DishOut
from seed import seed
from typing import List
import json

app = FastAPI(title="Dish Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── WebSocket Connection Manager ────────────────────────────────────────────

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        dead = []
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                dead.append(connection)
        for d in dead:
            self.active_connections.remove(d)


manager = ConnectionManager()


# ─── Startup ──────────────────────────────────────────────────────────────────

@app.on_event("startup")
async def startup_event():
    await seed()


# ─── REST Endpoints ───────────────────────────────────────────────────────────

@app.get("/dishes", response_model=List[DishOut])
async def get_dishes():
    """Return all dishes from the database."""
    cursor = dishes_collection.find({}, {"_id": 0})
    dishes = await cursor.to_list(length=None)
    return dishes


@app.patch("/dishes/{dish_id}/toggle", response_model=DishOut)
async def toggle_dish(dish_id: str):
    """Toggle the isPublished status of a dish and broadcast to all WS clients."""
    dish = await dishes_collection.find_one({"dishId": dish_id}, {"_id": 0})
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")

    new_status = not dish["isPublished"]
    await dishes_collection.update_one(
        {"dishId": dish_id}, {"$set": {"isPublished": new_status}}
    )

    updated = await dishes_collection.find_one({"dishId": dish_id}, {"_id": 0})

    # Broadcast change to all connected WebSocket clients
    await manager.broadcast({
        "type": "DISH_UPDATED",
        "dish": updated,
    })

    return updated


# ─── WebSocket Endpoint ───────────────────────────────────────────────────────

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive; client sends pings
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
