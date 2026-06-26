# 🍽️ Dish Dashboard

Full-stack dish management app with real-time WebSocket updates.

**Stack:** React + Vite · FastAPI · MongoDB (Motor)

---

## Features

- View all dishes with image, name, and publish status
- Toggle `isPublished` per dish via the dashboard
- **Real-time sync** — if a dish is toggled directly in the DB/backend (outside the dashboard), the UI updates automatically via WebSocket
- Filter by All / Published / Unpublished
- Live stats counter in the header

---

## Project Structure

```
dish-dashboard/
├── backend/
│   ├── main.py          # FastAPI app — REST + WebSocket
│   ├── db.py            # MongoDB Motor client
│   ├── models.py        # Pydantic models
│   ├── seed.py          # DB seed script (runs on startup)
│   ├── requirements.txt
│   └── .env             # MongoDB credentials
└── frontend/
    ├── src/
    │   ├── App.jsx               # Root component + state
    │   ├── hooks/useWebSocket.js # WS client with auto-reconnect
    │   └── components/
    │       ├── DishCard.jsx      # Individual dish card
    │       └── Toast.jsx         # Notification toast
    ├── index.html
    └── package.json
```

---

## Setup & Run

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The backend runs at `http://localhost:8000`. On first startup it seeds 8 dishes into MongoDB.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The dashboard runs at `http://localhost:5173`.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/dishes` | Fetch all dishes |
| `PATCH` | `/dishes/{dishId}/toggle` | Toggle `isPublished`, broadcasts WS event |
| `WS` | `/ws` | WebSocket connection for real-time updates |

---

## Real-Time Flow

```
Toggle in DB directly
       │
       ▼
Backend PATCH /dishes/{id}/toggle
       │
       ▼
WebSocket broadcast → all connected clients
       │
       ▼
React state updated → UI re-renders instantly
```

Even changes made directly in MongoDB (via Compass / Mongosh) won't auto-push to the frontend — but any toggle via the API will. To simulate a "backend-only" change, call the PATCH endpoint from another client (curl, Postman, etc.) and watch the dashboard update live.

```bash
# Example: toggle dish 3 from terminal while dashboard is open
curl -X PATCH http://localhost:8000/dishes/3/toggle
```

---

## Environment Variables

Create `backend/.env`:

```
MONGODB_name=your_db_user
MONGODB_password=your_password
MONGODB_cluster=mongodb+srv://your_user:<db_password>@cluster.mongodb.net/?appName=Cluster
```

## Images of Project

<img width="1275" height="828" alt="image" src="https://github.com/user-attachments/assets/b45304ce-67bf-4e50-bcde-1c2b51779670" />
<img width="1240" height="797" alt="image" src="https://github.com/user-attachments/assets/b64d23ea-98d1-44c0-a03a-b4f2593c16cc" />
<img width="1274" height="715" alt="image" src="https://github.com/user-attachments/assets/d57f16cf-53b2-4b01-a8b5-dcac0ac0746d" />



